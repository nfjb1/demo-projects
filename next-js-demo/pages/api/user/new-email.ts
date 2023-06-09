import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '@/api-lib/mongodb';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { updateUserEmail } from '@/api-lib/db';

// create a nextjs api route to update the user's email address in the database
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	switch (req.method) {
		case 'PATCH':
			// get the user's session
			const session = await getServerSession(req, res, authOptions);

			if (!session) {
				res.status(401).json({
					success: false,
					message: 'You must be logged in.',
				});
				return;
			}

			if (session.user.email === req.body.email) {
				res.status(400).json({ success: false, message: 'Same email.' });
				return;
			}

			if (!req.body.email) {
				res.status(400).json({ success: false, message: 'Email is undefined.' });
				return;
			}

			const client = await clientPromise;

			try {
				const success = await updateUserEmail(
					client,
					session.user.email,
					req.body.email
				);

				if (!success) {
					res.status(400).json({
						success: false,
						message: 'User with email not found or email already exists',
					});
					return;
				}

				res.status(200).json({ success: true, message: 'Email changed' });
				return;
			} catch (error) {
				console.log(
					'could not change ' + session.user.email + ' to ' + req.body.email
				);

				console.log(error);
				res.status(500).json({ success: false, message: error });
				return;
			}
		default:
			res.status(400).json({ success: false, message: 'Invalid request method' });
	}
}
