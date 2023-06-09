import clientPromise from '@/api-lib/mongodb';
import type { NextApiRequest, NextApiResponse } from 'next';

async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== 'POST') {
		res.status(403).json({ message: 'not post!' });
		return;
	}

	const { query } = req;
	const verificationToken = query.token as string;

	if (verificationToken === 'undefined') {
		console.log('no verification token');
		res.status(403).json({ message: 'no verification token!' });
		return;
	}

	const client = await clientPromise;

	const db = client.db('nextauth');

	const userWithToken = await db
		.collection('users')
		.findOne({ emailVerificationToken: verificationToken });

	if (userWithToken) {
		await db
			.collection('users')
			.updateOne(
				{ _id: userWithToken._id },
				{ $set: { emailVerified: true }, $unset: { emailVerificationToken: '' } }
			);
		res.status(200).json({ message: 'Verified!' });
		return;
	}

	if (!userWithToken) {
		res.status(403).json({ message: 'Not Verified!' });
		return;
	}
}

export default handler;
