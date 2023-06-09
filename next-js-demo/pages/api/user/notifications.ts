import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '@/api-lib/mongodb';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import {
	getNotificationsForUser,
	updateNotificationToRead,
	findUserByEmail,
	createNotification,
} from '@/api-lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const session = await getServerSession(req, res, authOptions);
	const client = await clientPromise;

	switch (req.method) {
		case 'GET':
			return await findUserByEmail(client, session?.user.email)
				.then(async ({ _id }) => {
					await getNotificationsForUser(client, _id).then((membership) => {
						res.status(200).json(membership);
					});
				})
				.catch((error) => {
					res.status(400).json(error);
				});

		case 'POST':
			return await findUserByEmail(client, session?.user.email)
				.then(async ({ _id }) => {
					await createNotification(client, req.body, _id).then(
						(notification) => {
							res.status(200).json(notification);
						}
					);
				})
				.catch((error) => {
					console.log(error);
					res.status(400).json(error);
				});

		case 'PATCH':
			return await findUserByEmail(client, session?.user.email)
				.then(async ({ _id }) => {
					await updateNotificationToRead(
						client,
						req.body.notificationId,
						_id
					).then((notification) => {
						res.status(200).json(notification);
					});
				})
				.catch((error) => {
					res.status(400).json(error);
				});

		default:
			res.status(400).json({ success: false, message: 'Invalid request method' });
	}
}
