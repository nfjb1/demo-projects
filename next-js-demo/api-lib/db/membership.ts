import bcrypt from 'bcryptjs';
import { ObjectId } from 'mongodb';
import { hash, compare } from 'bcryptjs';
import { randomBytes } from 'crypto';
import { sendEmail } from '@/api-lib/email';

import Membership from '@/api-lib/db/models/Membership';

import User from '@/api-lib/db/models/User';
import dbConnect from '@/api-lib/dbConnect';

export async function createMembership(userId) {
	await dbConnect();

	return await User.findOneAndUpdate(
		{ _id: new ObjectId(userId) },
		{ membership: await Membership.create({}) },
		{ returnOriginal: false }
	);
}

export async function getMembershipStatus(db, userId) {
	return (
		await User.findOne(
			{ _id: new ObjectId(userId) },
			{
				membership: {
					level: 1,
					points: 1,
				},
			}
		)
	).membership;
}

// export async function hashPassword(password: string) {
// 	const hashedPassword = await hash(password, 12);
// 	return hashedPassword;
// }

// export async function verifyPassword(password: string, hashedPassword: string) {
// 	const isValid = await compare(password, hashedPassword);
// 	return isValid;
// }

// export async function findUserWithEmailAndPassword(db, email, password) {
// 	const user = await db.collection('users').findOne({ email });
// 	if (user && (await bcrypt.compare(password, user.password))) {
// 		return { ...user, password: undefined }; // filtered out password
// 	}
// 	return null;
// }

// export async function deleteUser(db, id) {
// 	return db
// 		.db('nextauth')
// 		.collection('users')
// 		.findOneAndDelete({ _id: new ObjectId(id) })
// 		.then(({ value }) => value);
// }

// export async function findUserForAuth(db, userId) {
// 	return db
// 		.collection('users')
// 		.findOne({ _id: new ObjectId(userId) }, { projection: { password: 0 } })
// 		.then((user) => user || null);
// }

// export async function findUserById(db, userId) {
// 	return db
// 		.collection('users')
// 		.findOne({ _id: new ObjectId(userId) }, { projection: dbProjectionUsers() })
// 		.then((user) => user || null);
// }

// export async function findUserByUsername(db, username) {
// 	return db
// 		.findOne({ username }, { projection: dbProjectionUsers() })
// 		.then((user) => user || null);
// }

// export async function findUserByEmail(db, email) {
// 	return db
// 		.db('nextauth')
// 		.collection('users')
// 		.findOne({ email }, { projection: dbProjectionUsers() })
// 		.then((user) => user || null);
// }

// export async function updateUserEmail(db, oldEmail, newEmail) {
// 	const user = await findUserByEmail(db, newEmail);

// 	if (!user) {
// 		return false;
// 	}

// 	const emailVerificationToken = randomBytes(64).toString('hex');

// 	await sendEmail({
// 		toEmail: oldEmail,
// 		subject: 'CarCollectors - Your Email Address has been changed',
// 		bodyHtml: `Hello ${
// 			user.name.split(' ')[0]
// 		}, <br> your email address has been changed to ${newEmail}.<br><br>Thanks,<br>your team from CarCollectors`,
// 	});

// 	await sendEmail({
// 		toEmail: newEmail,
// 		subject: 'CarCollectors - Please verify your email address',
// 		bodyHtml: `Hello ${
// 			user.name.split(' ')[0]
// 		}, <br> please click <a href="https://demo1.meta7-studios.com/verify/${emailVerificationToken}">here</a> to verify your email address.<br><br>Thanks,<br>your team from CarCollectors`,
// 	});

// 	return db
// 		.db('nextauth')
// 		.collection('users')
// 		.updateOne(
// 			{ email: oldEmail },
// 			{
// 				$set: {
// 					email: newEmail,
// 					emailVerified: false,
// 					emailVerificationToken: emailVerificationToken,
// 				},
// 			}
// 		)
// 		.then((user) => {
// 			if (user.modifiedCount === 0) {
// 				return false;
// 			}
// 			return true;
// 		});
// }

// export async function updateUserById(db, id, data) {
// 	return db
// 		.collection('users')
// 		.findOneAndUpdate(
// 			{ _id: new ObjectId(id) },
// 			{ $set: data },
// 			{ returnDocument: 'after', projection: { password: 0 } }
// 		)
// 		.then(({ value }) => value);
// }

// export async function insertUser(
// 	db,
// 	{ email, originalPassword, bio = '', name, profilePicture, username }
// ) {
// 	const user = {
// 		emailVerified: false,
// 		profilePicture,
// 		email,
// 		name,
// 		username,
// 		bio,
// 	};
// 	const password = await bcrypt.hash(originalPassword, 10);
// 	const { insertedId } = await db.collection('users').insertOne({ ...user, password });
// 	user._id = insertedId;
// 	return user;
// }

// export async function updateUserPasswordByOldPassword(db, id, oldPassword, newPassword) {
// 	const user = await db.db('nextauth').collection('users').findOne(new ObjectId(id));
// 	if (!user) return false;
// 	const matched = await bcrypt.compare(oldPassword, user.password);
// 	if (!matched) return false;
// 	const password = await bcrypt.hash(newPassword, 10);
// 	await db
// 		.db('nextauth')
// 		.collection('users')
// 		.updateOne({ _id: new ObjectId(id) }, { $set: { password } });
// 	return true;
// }

// export async function UNSAFE_updateUserPassword(db, id, newPassword) {
// 	const password = await bcrypt.hash(newPassword, 10);
// 	await db
// 		.collection('users')
// 		.updateOne({ _id: new ObjectId(id) }, { $set: { password } });
// }

export function dbProjectionMembership(prefix = '') {
	return {
		[`${prefix}_id`]: 0,
		[`${prefix}userId`]: 0,
	};
}
