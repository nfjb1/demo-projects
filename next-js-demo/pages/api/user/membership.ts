import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '@/api-lib/mongodb';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { getMembershipStatus, findUserByEmail } from '@/api-lib/db';

// create a nextjs api route to update the user's email address in the database
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const session = await getServerSession(req, res, authOptions);
	const client = await clientPromise;

	console.log(req.method);

	switch (req.method) {
		case 'GET':
			return await findUserByEmail(client, session?.user.email)
				.then(({ _id }) => {
					getMembershipStatus(client, _id).then((membership) => {
						res.status(200).json(membership);
					});
				})
				.catch((error) => {
					res.status(400).json(error);
				});

		default:
			res.status(400).json({ success: false, message: 'Invalid request method' });
	}
}
