import { useState } from 'react';
import { toast } from 'react-toastify';
import Router, { useRouter } from 'next/router';

import Spinner from '../../components/Layout/Spinner';

export default function EmailVerification() {
	const router = useRouter();
	const { token } = router.query;
	const [success, setSuccess] = useState(false);
	const [loading, setLoading] = useState(true);

	async function isVerified() {
		if (!success) {
			try {
				if (token === 'undefined') {
					return;
				}

				if (!token) {
					return;
				}

				const response = await fetch('/api/auth/verify-email?token=' + token, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({ token }),
				});

				if (response.status === 200) {
					setSuccess(true);
					setLoading(false);
				} else {
					setSuccess(false);
					setLoading(false);
				}
			} catch (error) {
				console.log(error);
				setSuccess(false);
				setLoading(false);
			}
		}
	}

	isVerified();

	if (loading) return <Spinner type='fullscreen' size='large' />;
	if (!success && !loading) {
		toast.error('Invalid email verification token');
		Router.push('/');
	} else {
		toast.success('Email verified successfully. You can now login.');
		Router.push('/auth/login');
	}

	// return (
	// 	<>
	// 		{!success && !loading && (
	// 			<div className='container'>
	// 				<p>Verified</p>
	// 			</div>
	// 		)}
	// 	</>
	// );
}
