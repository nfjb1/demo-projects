import clientPromise from '@/api-lib/mongodb';

import type { NextApiRequest, NextApiResponse } from 'next';

// export async function handler(req, res) {
// 	const session = await unstable_getServerSession(req, res, authOptions);

// 	if (!session) {
// 		res.status(401).json({ message: 'You must be logged in.' });
// 		return;
// 	}

// 	return res.json({
// 		message: 'Success',
// 	});
// }

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { verifyPassword } from '@/api-lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const { query, method } = req;
	const id = parseInt(query.id as string, 10);
	const name = query.name as string;

	switch (method) {
		case 'POST':
			// Update or create data in your database

			const { credentials } = req.body;

			const client = await clientPromise;

			const usersCollection = client.db('nextauth').collection('users');

			const user = await usersCollection.findOne({
				email: credentials.email,
			});

			if (!user) {
				client.close();
				throw new Error('No user found!');
			}

			const isValid = await verifyPassword(credentials.password, user.password);

			if (!isValid) {
				client.close();
				throw new Error('Could not log you in!');
			}

			client.close();
			res.status(200).json({ email: user.email });

			break;
		default:
			res.setHeader('Allow', ['GET', 'PUT']);
			res.status(405).end(`Method ${method} Not Allowed`);
	}
}
