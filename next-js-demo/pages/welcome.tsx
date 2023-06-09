import { useSession, signIn, signOut } from 'next-auth/react';

import Link from 'next/link';

export default function WelcomeAfterRegister() {
	const { data: session, status } = useSession({ required: true });

	if (status === 'loading') return;

	return (
		<>
			<h1>Welcome to CarCollectors, {session.user.firstName}</h1>
			<h4>
				<Link href='/dashboard'>Click here to go to the dashboard</Link>
			</h4>
		</>
	);
}

WelcomeAfterRegister.auch = true;
