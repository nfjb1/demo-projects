/** @type {import('next').NextConfig} */

module.exports = {
	output: 'standalone',
	typescript: {
		ignoreBuildErrors: true,
	},
	reactStrictMode: false,
	images: {
		domains: [
			'lh3.googleusercontent.com',
			'scontent-muc2-1.xx.fbcdn.net',
			'images.takeshape.io',
			'via.placeholder.com',
			'images.unsplash.com',
		],
	},
	async redirects() {
		return [
			{
				source: '/login',
				destination: '/auth/login',
				permanent: true,
			},
			{
				source: '/sign-up',
				destination: '/auth/register',
				permanent: true,
			},
			{
				source: '/auth/error',
				missing: [
					{
						type: 'query',
						key: 'error',
					},
				],
				permanent: true,
				destination: '/auth/login',
			},
			{
				source: '/verify',
				missing: [
					{
						type: 'query',
						key: 'token',
					},
				],
				permanent: true,
				destination: '/',
			},
			{
				source: '/verify/:token',
				destination: '/auth/email-verfication?token=:token',
				permanent: true,
			},
		];
	},
};
