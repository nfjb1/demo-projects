import Router from 'next/router';
import { toast } from 'react-toastify';

import { useRouter } from 'next/router';

export default function AuthError() {
	const router = useRouter();
	const { error } = router.query;

	console.log(error);

	if (error) {
		toast.error('Error ' + error);
		Router.replace('/auth/login');
	}
}
