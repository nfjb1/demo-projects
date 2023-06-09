import { getProviders, signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';

import { AuthWrapper } from '@/page-components/Auth';

const LoginPage = ({
	providers,
}: {
	providers: { [key: string]: { name: string; id: string } };
}) => {
	const router = useRouter();
	const { error } = router.query;

	if (error === 'SessionRequired') {
		toast.error('You have to be logged in to access this page.');
	}

	return (
		<>
			<AuthWrapper url='login' providers={providers} signIn={signIn} />
		</>
	);
};

export default LoginPage;

export async function getServerSideProps(context: any) {
	const providers = await getProviders();
	return {
		props: { providers },
	};
}
