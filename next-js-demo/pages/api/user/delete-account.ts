import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '@/api-lib/mongodb';
import { unstable_getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { deleteUser, verifyPassword, findUserByEmail } from '@/api-lib/db';

// create a nextjs api route to update the user's email address in the database
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	switch (req.method) {
		case 'DELETE':
			// get the user's session
			const session = await unstable_getServerSession(req, res, authOptions);

			if (!session) {
				res.status(401).json({
					success: false,
					message: 'You must be logged in.',
				});
				return;
			}

			if (!req.body.password) {
				res.status(400).json({
					success: false,
					message: 'Password is undefined.',
				});
				return;
			}

			const client = await clientPromise;

			const { _id: userId, password } = await findUserByEmail(
				client,
				session.user.email
			);

			if (!(await verifyPassword(req.body.password, password))) {
				res.status(400).json({ success: false, message: 'Incorrect password.' });
				return;
			}

			try {
				const success = await deleteUser(client, userId);

				console.log(success);
				res.status(200).json({ success: true, message: success });
				return;
			} catch (error) {
				console.log(error);
				res.status(500).json({ success: false, message: error });
				return;
			}

			// if (user.type === 'social') {
			// 	const success = await deleteAccount(
			// 		client,
			// 		session.user.email,
			// 		req.body.email
			// 	);
			// }

			// if (session.user.email !== req.body.password) {
			// 	res.status(400).json({ success: false, message: 'Incorrect password.' });
			// 	return;
			// }

			// const client = await clientPromise;

			// TODO: Check if social media account is linked to the user's account. If so then delete the social media account as well.
			// The _id is the "userId" in accounts

			try {
				// const user = await deleteUser(client, session.user.email, req.body.email);

				// if (user.type === 'social') {
				// 	const success = await deleteAccount(
				// 		client,
				// 		session.user.email,
				// 		req.body.email
				// 	);
				// }

				res.status(200).json({ success: true, message: 'success' });
				return;
			} catch (error) {
				console.log(error);
				res.status(500).json({ success: false, message: error });
				return;
			}
		default:
			res.status(400).json({ success: false, message: 'Invalid request method' });
	}
}
