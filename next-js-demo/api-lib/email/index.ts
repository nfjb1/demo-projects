const nodemailer = require('nodemailer');

export async function sendEmail({
	toEmail,
	subject,
	bodyHtml,
}: {
	toEmail: string;
	subject: string;
	bodyHtml: string;
}) {
	const transporter = nodemailer.createTransport({
		host: 'smtp.gmail.com',
		port: 465,
		secure: true,
		auth: {
			type: 'OAuth2',
			user: 'nicolas@meta7-studios.com',
			serviceClient: process.env.EMAIL_CLIENT_ID,
			privateKey: process.env.EMAIL_PRIVATE_KEY,
		},
	});
	await transporter.verify();
	await transporter.sendMail({
		from: 'CarCollectors <no-reply@meta7-studios.com>',
		to: toEmail,
		subject: subject,
		html: bodyHtml,
	});
}
