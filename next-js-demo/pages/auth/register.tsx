import { AuthWrapper } from '@/page-components/Auth';
import { getProviders, signIn } from 'next-auth/react';

const Register = ({
	providers,
}: {
	providers: { [key: string]: { name: string; id: string } };
}) => {
	return (
		<>
			<AuthWrapper url='register' providers={providers} signIn={signIn} />
		</>
	);
};

export default Register;

export async function getServerSideProps(context: any) {
	const providers = await getProviders();
	return {
		props: { providers },
	};
}
