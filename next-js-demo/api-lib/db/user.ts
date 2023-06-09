import bcrypt from 'bcryptjs';
import { ObjectId } from 'mongodb';
import { hash, compare } from 'bcryptjs';
import { randomBytes } from 'crypto';
import { sendEmail } from '@/api-lib/email';

import Stripe from 'stripe';

const secret = process.env.STRIPE_SECRET_KEY || '';

const stripe = new Stripe(secret, {
	apiVersion: '2020-08-27',
	typescript: true,
});

export async function hashPassword(password: string) {
	const hashedPassword = await hash(password, 12);
	return hashedPassword;
}

export async function verifyPassword(password: string, hashedPassword: string) {
	const isValid = await compare(password, hashedPassword);
	return isValid;
}

export async function findUserWithEmailAndPassword(db, email, password) {
	const user = await db.collection('users').findOne({ email });
	if (user && (await bcrypt.compare(password, user.password))) {
		return { ...user, password: undefined }; // filtered out password
	}
	return null;
}

export async function deleteUser(db, id) {
	return db
		.db('nextauth')
		.collection('users')
		.findOneAndDelete({ _id: new ObjectId(id) })
		.then(({ value }) => value);
}

export async function findUserForAuth(db, userId) {
	return db
		.collection('users')
		.findOne({ _id: new ObjectId(userId) }, { projection: { password: 0 } })
		.then((user) => user || null);
}

export async function findUserById(db, userId) {
	return db
		.collection('users')
		.findOne({ _id: new ObjectId(userId) }, { projection: dbProjectionUsers() })
		.then((user) => user || null);
}

export async function findUserByUsername(db, username) {
	return db
		.findOne({ username }, { projection: dbProjectionUsers() })
		.then((user) => user || null);
}

export async function findUserByEmail(db, email) {
	return db
		.db('nextauth')
		.collection('users')
		.findOne({ email })
		.then((user) => user || null);
}

export async function cancelSub(db, email) {
	const user = await findUserByEmail(db, email);

	if (!user) {
		return false;
	}

	const allSubriptions = await stripe.subscriptions.list({});

	const subscriptionsForUser = allSubriptions.data.filter((subscription) => {
		return subscription.metadata.email === email;
	});

	const activeSubscriptions = subscriptionsForUser.filter((subscription) => {
		return subscription.status === 'active' || subscription.status === 'trialing';
	});

	if (activeSubscriptions.length === 0) {
		return false;
	}

	const subscriptionId = activeSubscriptions[0].id;

	const deletedSubscription = await stripe.subscriptions.del(subscriptionId);

	if (deletedSubscription.status === 'canceled') {
		return true;
	}

	return false;
}

export async function checkForActiveSubscription(
	client,
	email: string | null | undefined
): Promise<boolean> {
	return new Promise((resolve, reject) => {
		try {
			findUserByEmail(client, email).then(async ({ email }) => {
				const allSubriptions = await stripe.subscriptions.list({});

				const subscriptionsForUser = allSubriptions.data.filter(
					(subscription) => {
						return subscription.metadata.email === email;
					}
				);

				const activeSubscriptions = subscriptionsForUser.filter(
					(subscription) => {
						return (
							subscription.status === 'active' ||
							subscription.status === 'trialing'
						);
					}
				);

				if (activeSubscriptions.length > 0) {
					resolve(true);
				}

				resolve(false);
			});
		} catch (e) {
			reject(e);
		}
	});
}

export async function usedFreeTries(db, email) {
	// find user by email and check if he has used all free tries by checking the number of tries in the "try" field. if try is equal to 3, return true, else return false

	return db
		.db('nextauth')
		.collection('users')
		.findOne({ email }, { projection: dbProjectionTries() })
		.then((user) => user.try || null);
}

export async function proUser(db, email) {
	// find user by email and check if he has used all free tries by checking the number of tries in the "try" field. if try is equal to 3, return true, else return false

	const userHasActiveSubscription = await checkForActiveSubscription(db, email);

	if (!userHasActiveSubscription) {
		const tries = await usedFreeTries(db, email);

		if (tries === 3) {
			return false;
		} else {
			addTry(db, email);
		}
	}

	return true;
}

export async function addTry(db, email) {
	// find user by and email and add 1 to the "try" field
	return db
		.db('nextauth')
		.collection('users')
		.findOneAndUpdate({ email }, { $inc: { try: 1 } })
		.then((user) => user || null);
}

export async function updateUserEmail(db, oldEmail, newEmail) {
	const user = await findUserByEmail(db, newEmail);

	if (!user) {
		return false;
	}

	const emailVerificationToken = randomBytes(64).toString('hex');

	await sendEmail({
		toEmail: oldEmail,
		subject: 'CarCollectors - Your Email Address has been changed',
		bodyHtml: `Hello ${
			user.name.split(' ')[0]
		}, <br> your email address has been changed to ${newEmail}.<br><br>Thanks,<br>your team from CarCollectors`,
	});

	await sendEmail({
		toEmail: newEmail,
		subject: 'CarCollectors - Please verify your email address',
		bodyHtml: `Hello ${
			user.name.split(' ')[0]
		}, <br> please click <a href="https://demo1.meta7-studios.com/verify/${emailVerificationToken}">here</a> to verify your email address.<br><br>Thanks,<br>your team from CarCollectors`,
	});

	return db
		.db('nextauth')
		.collection('users')
		.updateOne(
			{ email: oldEmail },
			{
				$set: {
					email: newEmail,
					emailVerified: false,
					emailVerificationToken: emailVerificationToken,
				},
			}
		)
		.then((user) => {
			if (user.modifiedCount === 0) {
				return false;
			}
			return true;
		});
}

export async function updateUserById(db, id, data) {
	return db
		.collection('users')
		.findOneAndUpdate(
			{ _id: new ObjectId(id) },
			{ $set: data },
			{ returnDocument: 'after', projection: { password: 0 } }
		)
		.then(({ value }) => value);
}

export async function insertUser(
	db,
	{ email, originalPassword, bio = '', name, profilePicture, username }
) {
	const user = {
		emailVerified: false,
		profilePicture,
		email,
		name,
		username,
		bio,
	};
	const password = await bcrypt.hash(originalPassword, 10);
	const { insertedId } = await db.collection('users').insertOne({ ...user, password });
	user._id = insertedId;
	return user;
}

export async function updateUserPasswordByOldPassword(db, id, oldPassword, newPassword) {
	const user = await db.db('nextauth').collection('users').findOne(new ObjectId(id));
	if (!user) return false;
	const matched = await bcrypt.compare(oldPassword, user.password);
	if (!matched) return false;
	const password = await bcrypt.hash(newPassword, 10);
	await db
		.db('nextauth')
		.collection('users')
		.updateOne({ _id: new ObjectId(id) }, { $set: { password } });
	return true;
}

export async function UNSAFE_updateUserPassword(db, id, newPassword) {
	const password = await bcrypt.hash(newPassword, 10);
	await db
		.collection('users')
		.updateOne({ _id: new ObjectId(id) }, { $set: { password } });
}

export function dbProjectionUsers(prefix = '') {
	return {
		[`${prefix}emailVerified`]: 0,
		[`${prefix}image`]: 0,
	};
}

export function dbProjectionTries(prefix = '') {
	return {
		[`${prefix}try`]: 1,
	};
}
