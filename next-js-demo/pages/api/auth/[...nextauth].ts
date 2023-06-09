import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import FacebookProvider from 'next-auth/providers/facebook';
import GithubProvider from 'next-auth/providers/github';
import TwitterProvider from 'next-auth/providers/twitter';
import Auth0Provider from 'next-auth/providers/auth0';
import CredentialsProvider from 'next-auth/providers/credentials';
// import AppleProvider from "next-auth/providers/apple"
// import EmailProvider from "next-auth/providers/email"

import { createMembership, getMembershipStatus } from '@/api-lib/db';

import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import clientPromise from '@/api-lib/db_Connect_nextauth';
import { verifyPassword } from '@/api-lib/db';
import { getCookies, getCookie, setCookie, deleteCookie } from 'cookies-next';

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
export const authOptions: NextAuthOptions = {
	session: {
		strategy: 'jwt',
	},
	adapter: MongoDBAdapter(clientPromise),

	// https://next-auth.js.org/configuration/providers/oauth
	pages: {
		signIn: '/auth/login',
		signOut: '/auth/logout',
		newUser: '/welcome',
		error: '/auth/error',
	},
	providers: [
		/* EmailProvider({
         server: process.env.EMAIL_SERVER,
         from: process.env.EMAIL_FROM,
       }),
    // Temporarily removing the Apple provider from the demo site as the
    // callback URL for it needs updating due to Vercel changing domains

    Providers.Apple({
      clientId: process.env.APPLE_ID,
      clientSecret: {
        appleId: process.env.APPLE_ID,
        teamId: process.env.APPLE_TEAM_ID,
        privateKey: process.env.APPLE_PRIVATE_KEY,
        keyId: process.env.APPLE_KEY_ID,
      },
    }),
    */
		FacebookProvider({
			clientId: process.env.FACEBOOK_ID,
			clientSecret: process.env.FACEBOOK_SECRET,
		}),
		// GithubProvider({
		// 	clientId: process.env.GITHUB_ID,
		// 	clientSecret: process.env.GITHUB_SECRET,
		// }),
		GoogleProvider({
			clientId: process.env.GOOGLE_ID as string,
			clientSecret: process.env.GOOGLE_SECRET as string,
			authorization: {
				params: {
					scope: 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email openid',
				},
			},
		}),
		// TwitterProvider({
		// 	clientId: process.env.TWITTER_ID,
		// 	clientSecret: process.env.TWITTER_SECRET,
		// }),
		// Auth0Provider({
		// 	clientId: process.env.AUTH0_ID,
		// 	clientSecret: process.env.AUTH0_SECRET,
		// 	issuer: process.env.AUTH0_ISSUER,
		// }),

		CredentialsProvider({
			// The name to display on the sign in form (e.g. 'Sign in with...')
			name: 'Credentials',
			// The credentials is used to generate a suitable form on the sign in page.
			// You can specify whatever fields you are expecting to be submitted.
			// e.g. domain, username, password, 2FA token, etc.
			// You can pass any HTML attribute to the <input> tag through the object.
			credentials: {
				username: { label: 'Username', type: 'text', placeholder: 'jsmith' },
				password: { label: 'Password', type: 'password' },
				email: { label: 'Email', type: 'email' },
			},
			async authorize(credentials): Promise<any> {
				try {
					const client = await clientPromise;

					const usersCollection = client.db('nextauth').collection('users');

					const user = await usersCollection.findOne({
						email: credentials?.email,
					});

					if (!user) {
						// client.close();
						throw new Error('User not found');
					}

					const isValid = await verifyPassword(
						credentials?.password,
						user.password
					);

					if (!isValid) {
						// client.close();
						throw new Error('Wrong password');
					}

					if (!user.emailVerified) {
						// client.close();
						throw new Error('Email verification outstanding');
					}

					return {
						id: user._id,
						name: user.name,
						email: user.email,
						emailVerified: user.emailVerified,
						registrationType: 'email',
						membership: user.membership,
						isNewUser: user.isNewUser,
					} as any;
				} catch (err) {
					throw new Error(err);
				}
			},
		}),
	],
	callbacks: {
		jwt: async (params) => {
			const client = await clientPromise;

			if (params.isNewUser || params.user?.isNewUser) {
				// create a new entry in membeship table

				await createMembership(params.user?.id);
			}

			// console.log('jwt callback: ' + JSON.stringify(params, null, 2));

			if (params.user) {
				const fullName = params.user.name.split(' ');
				params.token.firstName = fullName[0];
				params.token.lastName = fullName[fullName.length - 1];

				params.token.providerType = params.account.provider;
			}

			return params.token;
		},
		session: async ({ session, user, token }) => {
			if (session.user) {
				session.user.firstLogin = token.firstLogin as boolean;
				session.user.firstName = token.firstName as string;
				session.user.lastName = token.lastName as string;
				session.user.providerType = token.providerType as string;
			}

			return session;
		},
	},
};

export default NextAuth(authOptions);
