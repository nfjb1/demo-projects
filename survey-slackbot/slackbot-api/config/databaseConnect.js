// - - - - - - - - - - - - - - - - - - - - - Connect to MongoDB - - - - - - - - - - - - - - - - - - - - -

const mongoose = require('mongoose');
const printMessage = require('print-message');

const connectDB = async () => {
	try {
		await mongoose.connect(
			'mongodb+srv://api-connection:' +
				process.env.MONGO_DB_PASSWORD +
				'@XXXX.eejtf.mongodb.net/?retryWrites=true&w=majority',
			{
				useNewUrlParser: true,
				useUnifiedTopology: true,
			}
		);
		printMessage(['databaseConnect.js INFO: Database Connected']);
		return;
	} catch (err) {
		console.error(err);
		process.exit(1);
	}
};

module.exports = connectDB;
