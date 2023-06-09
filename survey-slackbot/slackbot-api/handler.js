// - - - - - - - - - - - - - - - - - - - - - Modules Import - - - - - - - - - - - - - - - - - - - - -

const serverless = require('serverless-http');
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const axios = require('axios').default;
const bodyParser = require('body-parser');
const request = require('request-promise');
const { v4: uuidv4 } = require('uuid');
const mongoose = require('mongoose');
const printMessage = require('print-message');

require('dotenv').config();

// - - - - - - - - - - - - - - - - - - - - - Schema Import - - - - - - - - - - - - - - - - - - - - -
const HasAnswered = require('./databaseModel/hasanswered_model');
const Answer = require('./databaseModel/answer_model');

// - - - - - - - - - - - - - - - - - - - - - Connect to MongoDB - - - - - - - - - - - - - - - - - - - - -
const connectDB = require('./config/databaseConnect');
connectDB();

// - - - - - - - - - - - - - - - - - - - - - ExpressJS Settings - - - - - - - - - - - - - - - - - - - - -
const app = express();
app.use(cors());
app.use(
	bodyParser.urlencoded({
		extended: true,
	})
);
app.use(bodyParser.json());

// - - - - - - - - - - - - - - - - - - - - - Answer Handler - - - - - - - - - - - - - - - - - - - - -
app.post('/slack/event-subscription', async (req, res) => {
	try {
		// check if AWS or localhost
		const body = process.env.NODE_ENV
			? JSON.parse(decodeURIComponent(req.body.toString('utf8')).substring(8))
			: JSON.parse(req.body.payload);

		const { answeredQuestion, answerOfQuestion } = getValuesFromBody(body);

		if (!checkValidAnswer(answeredQuestion, answerOfQuestion)) {
			res.status(300).json({ message: 'Ein Fehler ist aufgetreten' });
			return;
		}

		updateMessageBlockInSlack(res, body, answeredQuestion);

		await connectDB();

		let userObj_hasAnswered = await getUserHasAnsweredObjFromDatabase(body);
		if (!userObj_hasAnswered._id) {
			// create entry
			const hashed_id = await bcrypt.hash(body.user.id + process.env.RANDOM_ID, 10);
			const unique_id = uuidv4();
			const newHasAnsweredEntry = new HasAnswered({
				hashed_id: hashed_id,
				unique_id: unique_id,
				answers: {
					q1: {
						answered: undefined,
					},
					q2: {
						answered: undefined,
					},
					q3: {
						answered: undefined,
					},
				},
			});

			userObj_hasAnswered = await newHasAnsweredEntry.save();
		}

		let userObj_Answer = await getUserAnswerFromDatabase(userObj_hasAnswered);
		if (!userObj_Answer._id) {
			printMessage(['handler.js INFO: Creating new entry in collection']);
			// create Entry
			const newAnswerEntry = new Answer({
				unique_id: userObj_hasAnswered.unique_id,
				answers: {
					q1: {
						answer: undefined,
					},
					q2: {
						answer: undefined,
					},
					q3: {
						answer: undefined,
					},
				},
			});
			userObj_Answer = await newAnswerEntry.save();
		}

		if (userObj_hasAnswered.answers[answeredQuestion].answered) {
			// Questions answered before
			const currentWeekNumber = require('current-week-number');
			sendMessage(
				res,
				body,
				'Du hast die Frage ' +
					answeredQuestion.substring(1) +
					' bereits für die Kalenderwoche ' +
					currentWeekNumber().toString() +
					' beantwortet. Beachte, dass das Absenden einer Antwort sich immer auf die aktuelle Woche bezieht.'
			);
		} else {
			// Questions not answered before
			printMessage(['handler.js INFO: Updating collection entry']);
			updateDatabaseHasAnsweredEntry(
				res,
				body,
				userObj_hasAnswered,
				answeredQuestion
			);
			updateDatabaseAnswerEntry(
				userObj_hasAnswered,
				answeredQuestion,
				answerOfQuestion
			);
		}
	} catch (err) {
		console.log(err);
		return res.status(401).send(err);
	}
});

app.delete('/drop-old-collections', async (req, res) => {
	await connectDB();
	const questions_answered_DB = await mongoose.connection.useDb('questions_answered');

	const currentWeekNumber = require('current-week-number');
	const currentDB = new Date().getFullYear() + '_cw_' + currentWeekNumber();

	if (req.headers['x-slackbot-token'] == process.env.SLACK_BOT_TOKEN) {
		try {
			(await questions_answered_DB.db.listCollections().toArray()).map(
				(collection) => {
					collection.name !== currentDB &&
						questions_answered_DB.collection(collection.name).drop();
				}
			);
			res.status(200).send('Old collections successfully dropped.');
		} catch (err) {
			res.status(500).send(err);
		}
	} else {
		res.status(401).send('Slackbot token must be right.');
	}
});

// - - - - - - - - - - - - - - - - - - - - - Functions - - - - - - - - - - - - - - - - - - - - -

const sendMessage = (res, body, messageText) => {
	axios
		.post(
			body.response_url,
			{
				response_type: 'ephemeral',
				replace_original: false,
				text: messageText,
			},
			{ headers: { 'Content-Type': 'application/json' } }
		)
		.then((response) => {
			res.send();
			return;
		})
		.catch((error) => {
			res.send();
			return;
		});
};

const updateMessageBlockInSlack = async (res, body, answeredQuestion) => {
	const newBlock = createNewBlock(body, answeredQuestion);
	const p = {
		channel: body.channel.id,
		ts: body.message.ts,
		blocks: encodeURI(JSON.stringify(newBlock)),
	};

	await request
		.get({
			url:
				'http://slack.com/api/chat.update?blocks=' +
				p.blocks +
				'&channel=' +
				p.channel +
				'&ts=' +
				p.ts,
			headers: {
				Authorization: 'Bearer ' + process.env.SLACK_BOT_TOKEN,
			},
		})
		.then((response) => {
			res.status(200);
		})
		.catch((err) => console.error(err));
};

const getUserHasAnsweredObjFromDatabase = async (body) => {
	let userObj = {};
	const returnId = await HasAnswered.find({})
		.clone()
		.then((users) => {
			users.map((user) => {
				if (
					bcrypt.compareSync(
						body.user.id + process.env.RANDOM_ID,
						user.hashed_id
					)
				) {
					userObj = user;
				}
			});
		});

	return userObj;
};

const getUserAnswerFromDatabase = async (userObj_hasAnswered) => {
	let userObj = {};
	await Answer.find({})
		.clone()
		.then((users) => {
			users.map((user) => {
				if (user.unique_id == userObj_hasAnswered.unique_id) {
					printMessage(['handler.js INFO: User already exists in collection']);
					userObj = user;
				}
			});
		});

	return userObj;
};

const updateDatabaseHasAnsweredEntry = (
	res,
	body,
	userObj_hasAnswered,
	answeredQuestion
) => {
	HasAnswered.findByIdAndUpdate(
		userObj_hasAnswered._id,
		{
			$set: {
				['answers.' + answeredQuestion + '.answered']: true,
			},
		},
		{ new: true },
		(err, updatedUserObj_hasAnswered) => {
			checkIfAllAnswered(res, body, updatedUserObj_hasAnswered);
		}
	);
};

const updateDatabaseAnswerEntry = (
	userObj_hasAnswered,
	answeredQuestion,
	answerOfQuestion
) => {
	Answer.findOneAndUpdate(
		{ unique_id: userObj_hasAnswered.unique_id },
		{
			$set: {
				['answers.' + answeredQuestion + '.answer']: answerOfQuestion,
			},
		},
		(err, doc) => {}
	);
};

const checkIfAllAnswered = (res, body, userObj_hasAnswered) => {
	if (
		userObj_hasAnswered.answers.q1.answered &&
		userObj_hasAnswered.answers.q2.answered &&
		userObj_hasAnswered.answers.q3.answered
	) {
		sendMessage(
			res,
			body,
			'Danke, du hast alle Fragen für diese Woche beantwortet! :slightly_smiling_face:'
		);
	}
};

const createNewBlock = (orgBlock, question) => {
	const newBlock = orgBlock;

	const blockNumber =
		question == 'q1' ? 5 : question == 'q2' ? 9 : question == 'q3' && 13;

	newBlock.message.blocks[blockNumber] = {
		type: 'context',
		elements: [
			{
				type: 'plain_text',
				text: 'Deine Antwort wurde gesendet.',
			},
		],
	};

	return newBlock.message.blocks;
};

const checkValidAnswer = (answeredQuestion, answerOfQuestion) => {
	const possibleQuestions = ['q1', 'q2', 'q3'];
	const possibleAnswers = [1, 2, 3, 4, 5, 6];

	if (
		possibleQuestions.includes(answeredQuestion) &&
		possibleAnswers.includes(answerOfQuestion)
	) {
		return true;
	}

	return false;
};

const getValuesFromBody = (body) => {
	const answeredQuestion = body.actions[0].value.substring(
		0,
		body.actions[0].value.indexOf('_')
	);

	const answerOfQuestion = parseFloat(
		body.actions[0].value.substring(body.actions[0].value.indexOf('_') + 1)
	);
	return { answeredQuestion, answerOfQuestion };
};

// 404 Handler
app.use((req, res, next) => {
	return res.status(404).json({
		error: 'Not Found',
	});
});

app.listen(3000, () => {
	printMessage(['handler.js INFO: Listening on port 3000']);
});

module.exports.handler = serverless(app, { callbackWaitsForEmptyEventLoop: false });
