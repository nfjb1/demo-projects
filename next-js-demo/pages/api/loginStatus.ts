import type { NextApiRequest, NextApiResponse } from 'next';

import { authOptions } from './auth/[...nextauth]';
import { unstable_getServerSession } from 'next-auth/next';

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

type Data = {
	message: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
	const session = await unstable_getServerSession(req, res, authOptions);

	if (!session) {
		res.status(401).json({ message: 'You must be logged in.' });
		return;
	}

	return res.status(200).json({ message: 'Success' });
}
