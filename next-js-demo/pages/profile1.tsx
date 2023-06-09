import { toast } from 'react-toastify';
import Router from 'next/router';

import { useState } from 'react';

import { useSession, signOut } from 'next-auth/react';

export default function Profile() {
	// const { user, mutate, loading, error } = useUser();

	const [email, setEmail] = useState('');
	const [passwordForm, setPasswordForm] = useState({
		currentPassword: '',
		newPassword: '',
	});
	const [password, setPassword] = useState('');

	const { data: session } = useSession();

	function handleEmailChange(e) {
		setEmail(e.target.value);
	}

	async function handleEmailSubmit(e) {
		e.preventDefault();

		const res = await fetch('/api/user/new-email', {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				email,
			}),
		});

		if (res.status === 200) {
			Router.push('/auth/login');
			signOut({ redirect: false }).then(() => {
				toast.success('Sign in again to verify your new email address.');
			});
		} else {
			toast.error(`Something went wrong updating your email. Error code: ${res}`);
		}
	}

	function handlePasswordChange(e) {
		setPasswordForm({
			...passwordForm,
			[e.target.name]: e.target.value,
		});
	}

	async function handlePasswordChangeSubmit(e) {
		e.preventDefault();

		const res = await fetch('/api/user/change-password', {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				oldPassword: passwordForm.currentPassword,
				newPassword: passwordForm.newPassword,
			}),
		});

		if (res.status === 200) {
			Router.push('/auth/login');
			signOut({ redirect: false }).then(() => {
				toast.success('Sign in with your new password.');
			});
		} else {
			toast.error(`Old password is incorrect.`);
		}
	}

	async function handleDeleteAccountSubmit(e) {
		e.preventDefault();
		const res = await fetch('/api/user/delete-account', {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				password,
			}),
		});

		if (res.status === 200) {
			Router.push('/auth/login');
			signOut({ redirect: false }).then(() => {
				toast.success('Account deleted.');
			});
		} else {
			toast.error(`Something went wrong deleting your account. Error code: ${res}`);
		}
	}

	function handleDeleteAccountPasswordChange(e) {
		setPassword(e.target.value);
	}

	console.log(session);

	return (
		<div>
			{session && (
				<>
					{session.user?.providerType === 'credentials' && (
						<div>
							<p>
								Since you registered by email, you can change your email
								address here:
							</p>
							<form onSubmit={handleEmailSubmit}>
								<input
									type='text'
									name='email'
									onChange={handleEmailChange}
								/>
								<button type='submit'>Update Email</button>
							</form>
							<form onSubmit={handlePasswordChangeSubmit}>
								<input
									type='password'
									name='currentPassword'
									placeholder='Current Password'
									onChange={handlePasswordChange}
								/>
								<input
									type='password'
									name='newPassword'
									placeholder='New Password'
									onChange={handlePasswordChange}
								/>
								<button type='submit'>Update Password</button>
							</form>
							<form onSubmit={handleDeleteAccountSubmit}>
								<input
									type='password'
									name='password'
									onChange={handleDeleteAccountPasswordChange}
								/>
								<button type='submit'>Delete Account</button>
							</form>
						</div>
					)}
				</>
			)}
		</div>
	);
}

Profile.auth = true;
