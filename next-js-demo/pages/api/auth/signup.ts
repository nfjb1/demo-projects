import { hashPassword } from '@/api-lib/db';
import clientPromise from '@/api-lib/mongodb';
import { randomBytes } from 'crypto';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getCookies, setCookie, deleteCookie } from 'cookies-next';

import { sendEmail } from '@/api-lib/email';

async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== 'POST') {
		return;
	}

	const data = req.body;

	const { name, email, password } = data;

	// if (!email || !email.includes('@') || !password || password.trim().length < 7) {
	// 	res.status(422).json({
	// 		message:
	// 			'Invalid input - password should also be at least 7 characters long.',
	// 	});
	// 	return;
	// }

	const client = await clientPromise;

	const db = client.db('nextauth');

	const existingUser = await db.collection('users').findOne({ email: email });

	if (existingUser) {
		res.status(422).json({ message: 'User exists already!' });
		return;
	}

	try {
		const hashedPassword = await hashPassword(password);

		const emailVerificationToken = randomBytes(64).toString('hex');

		await db.collection('users').insertOne({
			name: name,
			email: email,
			password: hashedPassword,
			image: null,
			emailVerified: true,
			emailVerificationToken: emailVerificationToken,
			isNewUser: true,
			createdAt: new Date().toISOString(),
		});

		await sendEmail({
			toEmail: email,
			subject: 'CarCollectors - Please verify your email address',
			bodyHtml: `Hello ${name.split(' ')[0]}, <br> please click <a href="${
				process.env.EMAIL_VERIFY_URL
			}/verify/${emailVerificationToken}">here</a> to verify your email address.<br><br>Thanks,<br>your team from CarCollectors`,
		});

		setCookie('isNewUser', 'true', { req, res });
	} catch (err) {
		res.status(500).json({ message: `Error ${err}` });
	}

	res.status(201).json({ message: 'Created user!' });
}

export default handler;
