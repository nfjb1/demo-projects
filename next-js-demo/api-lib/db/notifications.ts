import { ObjectId } from 'mongodb';
import Notification from '@/api-lib/db/models/Notifications';
import dbConnect from '@/api-lib/dbConnect';

export async function getNotificationsForUser(db, userId) {
	return db
		.db('data')
		.collection('notifications')
		.find(
			{ receiver: userId, read_by: { $nin: [userId] } },
			{ projection: dbProjectionNotifications() }
		)
		.sort({ created_at: -1 })
		.toArray()
		.then((notifications) => notifications || null);
}

export async function updateNotificationToRead(db, notificationId, userId) {
	return db
		.db('data')
		.collection('notifications')
		.findOneAndUpdate(
			{ id: notificationId },
			{ $push: { read_by: new ObjectId(userId) } },
			{ returnOriginal: false }
		)
		.then(({ value }) => value || null);
}

// create new notification following mongoose NotificationsSchema Notification
export async function createNotification(db, notification, userId) {
	await dbConnect();

	const receiverId = await db
		.db('nextauth')
		.collection('users')
		.findOne({ email: notification.receiver }, { projection: { _id: 1 } })
		.then((user) => {
			return user;
		})
		.catch((err) => console.log(err));

	if (!receiverId) {
		return { success: false, message: 'Receiver not found' };
	}

	try {
		new Notification({
			...notification,
			receiver: receiverId,
			sender: new ObjectId(userId),
		}).save();

		return { success: true, message: 'Notification created' };
	} catch (err) {
		return { success: false, message: 'Notification not created' };
	}
}

export function dbProjectionNotifications(prefix = '') {
	return {
		[`${prefix}_id`]: 0,
		[`${prefix}sender`]: 0,
		[`${prefix}receiver`]: 0,
		[`${prefix}read_by`]: 0,
	};
}
