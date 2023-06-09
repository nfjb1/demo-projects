import NextAuth from 'next-auth';

declare module 'next-auth' {
	/**
	 * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
	 */
	interface Session {
		user: {
			level: string | undefined | null;
			points: number | undefined | null;
			providerType: string | undefined | null;
			id: any | undefined | null;
			name: string | undefined | null;
			email: string | undefined | null;
			image: string | undefined | null;
			emailVerified: boolean | undefined | null;
			firstLogin: boolean | undefined | null;
			firstName: string | undefined | null;
			lastName: string | undefined | null;
		};
	}

	interface User {
		id: any | undefined | null;
		name: string | undefined | null;
		email: string | undefined | null;
		image: string | undefined | null;
		emailVerified: boolean | undefined | null;
		firstLogin: boolean | undefined | null;
		firstName: string | undefined | null;
		lastName: string | undefined | null;
	}
}
