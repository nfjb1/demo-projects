import { Avatar } from '@/components/Avatar';
import { Button } from '@/components/Button';
import { Input, Textarea } from '@/components/Input';
import { Container, Spacer, Wrapper } from '@/components/Layout';
import { fetcher } from '@/lib/fetch';
// import { useCurrentUser } from '@/lib/user';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import styles from './Settings.module.css';

import { verifyPassword } from '@/api-lib/db';

import { reloadSession } from '@/lib/session';

import { useSession, signIn, signOut } from 'next-auth/react';

const EmailVerify = ({ user }) => {
	const [status, setStatus] = useState();
	const verify = useCallback(async () => {
		try {
			setStatus('loading');
			await fetcher('/api/user/email/verify', { method: 'POST' });
			toast.success(
				'An email has been sent to your mailbox. Follow the instruction to verify your email.'
			);
			setStatus('success');
		} catch (e) {
			toast.error(e.message);
			setStatus('');
		}
	}, []);
	if (user.emailVerified) return null;
	return (
		<Container className={styles.note}>
			<Container flex={1}>
				<p>
					<strong>Note:</strong> <span>Your email</span> (
					<span className={styles.link}>{user.email}</span>) is unverified.
				</p>
			</Container>
			<Spacer size={1} axis='horizontal' />
			<Button
				loading={status === 'loading'}
				size='small'
				onClick={verify}
				disabled={status === 'success'}
			>
				Verify
			</Button>
		</Container>
	);
};

const ChangePassword = () => {
	const [isLoading, setIsLoading] = useState(false);

	const [passwordForm, setPasswordForm] = useState({
		currentPassword: '',
		newPassword: '',
	});

	const onSubmit = useCallback(
		async (e) => {
			e.preventDefault();
			try {
				setIsLoading(true);
				await fetcher('/api/user/change-password', {
					method: 'PATCH',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						oldPassword: passwordForm.currentPassword,
						newPassword: passwordForm.newPassword,
					}),
				});
				toast.success('Your password has been updated');
			} catch (e) {
				toast.error(e.message);
			} finally {
				setIsLoading(false);
			}
		},
		[passwordForm]
	);

	function handleChange(e) {
		setPasswordForm({
			...passwordForm,
			[e.target.name]: e.target.value,
		});
	}

	return (
		<section className={styles.card}>
			<h4 className={styles.sectionTitle}>Password</h4>
			<form onSubmit={onSubmit}>
				<Input
					htmlType='password'
					autoComplete='current-password'
					name='currentPassword'
					onChange={handleChange}
					label='Old Password'
					required
				/>
				<Spacer size={0.5} axis='vertical' />
				<Input
					htmlType='password'
					autoComplete='new-password'
					onChange={handleChange}
					label='New Password'
					required
				/>
				<Spacer size={0.5} axis='vertical' />
				<Button
					htmlType='submit'
					className={styles.submit}
					type='success'
					loading={isLoading}
				>
					Save
				</Button>
			</form>
		</section>
	);
};

const ChangeEmail = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [showConfirmWithPassword, setShowConfirmWithPassword] = useState(false);
	const [confirmPassword, setConfirmPassword] = useState(null);
	const [newEmail, setNewEmail] = useState('');

	const newEmailRef = useRef();

	// const onSubmit = useCallback(
	// 	async (e) => {
	// 		e.preventDefault();
	// 		try {
	// 			setIsLoading(true);
	// 			setShowConfirmWithPassword(true);
	// 		} catch (e) {
	// 			toast.error(e.message);
	// 		} finally {
	// 			setIsLoading(false);
	// 		}
	// 	},
	// 	[newEmail]
	// );

	const onSubmit = (e) => {
		e.preventDefault();
		setShowConfirmWithPassword(true);
	};

	function handleChange(e) {
		setNewEmail(e.target.value);
	}

	useEffect(() => {
		if (confirmPassword) {
			updateEmail(newEmail, confirmPassword);
			toast.success('Email changed successfully');
			setNewEmail('');
			newEmailRef.current.value = '';
		}
	}, [confirmPassword]);

	async function updateEmail(email, password) {
		try {
			setIsLoading(true);
			await fetcher('/api/user/new-email', {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					email: newEmail,
				}),
			});

			setShowConfirmWithPassword(false);

			signIn('credentials', {
				email,
				password,
				redirect: false,
			});
		} catch (e) {
			toast.error(e.message);
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<section className={styles.card}>
			<h4 className={styles.sectionTitle}>Email</h4>
			<form onSubmit={onSubmit}>
				<Input
					htmlType='email'
					autoComplete='email'
					onChange={handleChange}
					label='New Email'
					ref={newEmailRef}
					required
				/>
				<Spacer size={0.5} axis='vertical' />
				{!showConfirmWithPassword && (
					<Button
						htmlType='submit'
						className={styles.submit}
						type='success'
						loading={isLoading}
					>
						Save
					</Button>
				)}
			</form>
			{showConfirmWithPassword && (
				<EnterPasswordToChange setConfirmPassword={setConfirmPassword} />
			)}
		</section>
	);
};

const DeleteAccount = () => {
	const [isLoading, setIsLoading] = useState(false);

	const [password, setPassword] = useState('');

	const onSubmit = useCallback(
		async (e) => {
			e.preventDefault();
			try {
				setIsLoading(true);
				await fetcher('/api/user/delete-account', {
					method: 'DELETE',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						password,
					}),
				});
				toast.success('Account deleted successfully');
				signOut();
			} catch (e) {
				toast.error(e.message);
			} finally {
				setIsLoading(false);
				() => {
					const event = new Event('visibilitychange');
					document.dispatchEvent(event);
				};
			}
		},
		[password]
	);

	function handleChange(e) {
		setPassword(e.target.value);
	}

	return (
		<section className={styles.card}>
			<h4 className={styles.sectionTitle}>Delete Account</h4>
			<form onSubmit={onSubmit}>
				<Input
					htmlType='password'
					autoComplete='password'
					onChange={handleChange}
					label='Current Password'
					required
				/>
				<Spacer size={0.5} axis='vertical' />
				<Button
					htmlType='submit'
					className={styles.submit}
					type='success'
					loading={isLoading}
				>
					Delete Account
				</Button>
			</form>
		</section>
	);
};

const EnterPasswordToChange = ({ setConfirmPassword }) => {
	const [isLoading, setIsLoading] = useState(false);
	const [password, setPassword] = useState('');

	const { data: session } = useSession();

	const email = session.user.email;

	const onSubmit = useCallback(
		async (e) => {
			e.preventDefault();
			try {
				setIsLoading(true);

				const res = await signIn('credentials', {
					email,
					password,
					redirect: false,
				});

				if (res?.status !== 200) {
					// throw error
					throw new Error('Incorrect Password');
				}

				setConfirmPassword(password);
			} catch (e) {
				toast.error(e.message);
			} finally {
				setIsLoading(false);
				setPassword('');
			}
		},
		[email, password]
	);

	function handleChange(e) {
		setPassword(e.target.value);
	}

	return (
		<>
			<h4 className={styles.sectionTitle}>Enter Password to confirm</h4>
			<form onSubmit={onSubmit}>
				<Input
					htmlType='password'
					autoComplete='password'
					onChange={handleChange}
					label='Current Password'
					required
				/>
				<Spacer size={0.5} axis='vertical' />
				<Button
					htmlType='submit'
					className={styles.submit}
					type='success'
					loading={isLoading}
				>
					Confirm
				</Button>
			</form>
		</>
	);
};

const AboutYou = ({ user }) => {
	const usernameRef = useRef();
	const nameRef = useRef();
	const bioRef = useRef();
	const profilePictureRef = useRef();

	const [avatarHref, setAvatarHref] = useState(user.image);
	const onAvatarChange = useCallback((e) => {
		const file = e.currentTarget.files?.[0];
		if (!file) return;
		const reader = new FileReader();
		reader.onload = (l) => {
			setAvatarHref(l.currentTarget.result);
		};
		reader.readAsDataURL(file);
	}, []);

	const [isLoading, setIsLoading] = useState(false);

	const onSubmit = useCallback(
		async (e) => {
			e.preventDefault();
			try {
				setIsLoading(true);
				const formData = new FormData();
				formData.append('username', usernameRef.current.value);
				formData.append('name', nameRef.current.value);
				formData.append('bio', bioRef.current.value);
				if (profilePictureRef.current.files[0]) {
					formData.append('profilePicture', profilePictureRef.current.files[0]);
				}
				const response = await fetcher('/api/user', {
					method: 'PATCH',
					body: formData,
				});
				// mutate({ user: response.user }, false);
				toast.success('Your profile has been updated');
			} catch (e) {
				toast.error(e.message);
			} finally {
				setIsLoading(false);
			}
		},
		[user]
	);

	useEffect(() => {
		usernameRef.current.value = user.username;
		nameRef.current.value = user.name;
		bioRef.current.value = user.bio;
		profilePictureRef.current.value = '';
		setAvatarHref(user.profilePicture);
	}, [user]);

	return (
		<section className={styles.card}>
			<h4 className={styles.sectionTitle}>About You</h4>
			<form onSubmit={onSubmit}>
				<Input ref={usernameRef} label='Your Username' />
				<Spacer size={0.5} axis='vertical' />
				<Input ref={nameRef} label='Your Name' />
				<Spacer size={0.5} axis='vertical' />
				<Textarea ref={bioRef} label='Your Bio' />
				<Spacer size={0.5} axis='vertical' />
				<span className={styles.label}>Your Avatar</span>
				<div className={styles.avatar}>
					<Avatar size={96} username={user.username} url={avatarHref} />
					<input
						aria-label='Your Avatar'
						type='file'
						accept='image/*'
						ref={profilePictureRef}
						onChange={onAvatarChange}
					/>
				</div>
				<Spacer size={0.5} axis='vertical' />
				<Button
					htmlType='submit'
					className={styles.submit}
					type='success'
					loading={isLoading}
				>
					Save
				</Button>
			</form>
		</section>
	);
};

export const Settings = () => {
	const { data: session } = useSession();

	// const { data, error, mutate } = useCurrentUser();

	// const data = {
	// 	user: {
	// 		name: 'Nicolas',
	// 		username: 'nicolas',
	// 		bio: "I'm a software engineer",
	// 		profilePicture: 'https://avatars.githubusercontent.com/u/1164541?v=4',
	// 		email: 'bernd@senf.de',
	// 		emailVerified: true,
	// 	},
	// };
	const router = useRouter();
	useEffect(() => {
		if (!session) return;
		if (!session.user) {
			router.replace('/login');
		}
	}, [session]);
	return (
		<Wrapper className={styles.wrapper}>
			{session?.user ? (
				<>
					{/* <EmailVerify user={data.user} /> */}
					<AboutYou user={session.user} />
					<ChangePassword user={session.user} />
					<ChangeEmail />
					<DeleteAccount user={session} />
					<p>{session.user.email}</p>
				</>
			) : null}
		</Wrapper>
	);
};
