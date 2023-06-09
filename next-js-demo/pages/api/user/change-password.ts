import { findUserByEmail, updateUserPasswordByOldPassword } from '@/api-lib/db';
import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '@/api-lib/mongodb';
import { unstable_getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';

import { sendEmail } from '@/api-lib/email';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	switch (req.method) {
		case 'PATCH':
			const client = await clientPromise;

			const { oldPassword, newPassword } = req.body;
			const session = await unstable_getServerSession(req, res, authOptions);

			const { _id: userId, email } = await findUserByEmail(
				client,
				session.user.email
			);

			console.log(userId);

			const success = await updateUserPasswordByOldPassword(
				client,
				userId,
				oldPassword,
				newPassword
			);

			if (!success) {
				res.status(401).json({
					error: { message: 'The old password you entered is incorrect.' },
				});
				return;
			}

			sendEmail({
				toEmail: email,
				subject: 'Password Changed',
				bodyHtml: `<p>Your password has been changed.</p>`,
			});

			res.status(200).end();
	}
}
