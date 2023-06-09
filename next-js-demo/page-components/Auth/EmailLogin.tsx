// import { Login } from '@/page-components/Auth';
import Head from 'next/head';

import Link from 'next/link';

import Spinner from '@/components/Layout/Spinner';

import { FiLock, FiAtSign } from 'react-icons/fi';

import Router from 'next/router';
import { signIn } from 'next-auth/react';

import { FiAlertCircle } from 'react-icons/fi';
import { toast } from 'react-toastify';

import { Button } from '@/components/Button';
import { ButtonLink } from '@/components/Button/Button';
import { Input } from '@/components/Input';
import { Spacer, Wrapper } from '@/components/Layout';
import { TextLink } from '@/components/Text';
import { fetcher } from '@/lib/fetch';
import { useCallback, useEffect, useRef, useState } from 'react';
import styles from './Auth.module.css';

interface FormData {
	email: string;
	password: string;
}

const EmailLogin = () => {
	const [loading, setLoading] = useState(false as boolean);
	const [buttonDisabled, setButtonDisabled] = useState(true);
	const [showErrorMessage, setShowErrorMessage] = useState({
		status: false,
		message: '',
	} as { status: boolean; message: string });
	const [formData, setFormData] = useState({
		email: '',
		password: '',
	} satisfies FormData);

	const sumbitButton = useRef(
		null
	) as unknown as React.MutableRefObject<HTMLButtonElement>;

	const { email, password } = formData;

	useEffect(() => {
		validateForm();
	}, [formData]);

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		// use useSWR to fetch data from the API to login user
		e.preventDefault();
		if (!validateForm()) return;
		setLoading(true);
		setButtonDisabled(true);

		const cUrl =
			process.env.NEXT_PUBLIC_VERCEL_ENV === 'production'
				? 'https://project2.nicolas.app'
				: 'http://localhost:3000';

		const res = await signIn('credentials', {
			email,
			password,
			callbackUrl: `${cUrl}/dashboard`,
			redirect: false,
		});

		if (res?.status !== 401 && res?.status !== 200) {
			toast.error('Something went wrong. Please try again later. ');
			setLoading(false);
			setButtonDisabled(false);
		}

		if (res?.status == 401) {
			const { error } = res;

			console.log(error);

			switch (error) {
				case 'Error: Wrong password':
					setShowErrorMessage({
						status: true,
						message: 'The password you have entered is wrong. ',
					});
					setLoading(false);
					setButtonDisabled(false);
					break;
				case 'Error: Email verification needed':
					setShowErrorMessage({
						status: true,
						message: 'Email verification still outstanding.',
					});
					setLoading(false);
					setButtonDisabled(false);
					break;
				case 'Error: User not found':
					setShowErrorMessage({
						status: true,
						message: 'No user found with entered email address.',
					});
					setLoading(false);
					setButtonDisabled(false);
					break;
				default:
					toast.error('Something went wrong. Please try again later. ');
					setLoading(false);
					setButtonDisabled(false);
					break;
			}

			// if (error === 'Database not reached') {
			// 	setShowErrorMessage({
			// 		status: true,
			// 		message: 'Wrong email or password. ',
			// 	});
			// 	setLoading(false);
			// 	setButtonDisabled(false);
			// } else {
			// 	setShowErrorMessage({
			// 		status: true,
			// 		message: 'Wrong email or password. ',
			// 	});
			// 	setLoading(false);
			// 	setButtonDisabled(false);
			// }
		} else {
			Router.replace('/dashboard');
		}
	}

	// function setButtonDisabled(disable: boolean) {
	// 	// if (disable) {
	// 	// 	sumbitButton.current.classList.add('submit_disabled');
	// 	// } else {
	// 	// 	sumbitButton.current.classList.remove('submit_disabled');
	// 	// }
	// }

	function validateForm(): boolean {
		console.log(email, password);

		if (email !== '' && password !== '') {
			setButtonDisabled(false);
			return true;
		} else {
			setButtonDisabled(true);
			return false;
		}
	}

	function handleFormChange(e: React.ChangeEvent<HTMLInputElement>): void {
		console.log(e);

		setShowErrorMessage({ status: false, message: '' });
		setFormData({ ...formData, [e.target.name]: e.target.value });
	}

	const forgetPassword = <Link href='/forgot-password'>Forgot password?</Link>;

	return (
		<>
			<div>
				<form onSubmit={handleSubmit}>
					<Input
						htmlType='email'
						autoComplete='email'
						placeholder='Email Address'
						name='email'
						ariaLabel='Email Address'
						icon={<FiAtSign />}
						size='large'
						onChange={handleFormChange}
						required
					/>
					<Spacer size={0.5} axis='vertical' />
					<Input
						htmlType='password'
						autoComplete='password'
						placeholder='Password'
						name='password'
						ariaLabel='Email Address'
						icon={<FiLock />}
						size='large'
						onChange={handleFormChange}
						required
					/>
					<Spacer size={0.25} axis='vertical' />
					<div className='form_options'>
						<span className='hint_text'>{forgetPassword}</span>
					</div>
					<Spacer size={0.5} axis='vertical' />
					<Button
						htmlType='submit'
						className={styles.submit}
						type='success'
						size='large'
						ref={sumbitButton}
						disabled={buttonDisabled && 'disabled'}
						loading={loading}
					>
						Log in
					</Button>
					<Spacer size={0.25} axis='vertical' />

					{/* <Link href='/forget-password' passHref>
						<ButtonLink type='success' size='large' variant='ghost'>
							Forget password
						</ButtonLink>
					</Link> */}
					{/* <div className='input_field'>
						<div className='input_field_icon'>
							<span>
								<FiAtSign />
							</span>
						</div>
						<div className='input_field_wrapper'>
							<input
								type='email'
								name='email'
								autoComplete='email'
								placeholder=' '
								onChange={handleFormChange}
								className='input_field_text'
							/>
							<span className='input_field_label'>Email address</span>
						</div>
					</div>
					<div className='input_field'>
						<div className='input_field_icon'>
							<span>
								<FiLock />
							</span>
						</div>
						<div className='input_field_wrapper'>
							<input
								type='password'
								name='password'
								autoComplete='password'
								placeholder=' '
								onChange={handleFormChange}
								className='input_field_text'
							/>
							<span className='input_field_label'>Password</span>
						</div>
					</div> */}
					<Spacer size={0.4} axis='vertical' />

					{/* <div className='input_field submit_button'>
						<button
							type='submit'
							ref={sumbitButton}
							className='submit_button'
						>
							{!loading ? 'Login' : <Spinner size='small' />}
						</button>
					</div> */}

					{showErrorMessage.status && (
						<div className='error_message'>
							<FiAlertCircle size='1rem' /> {showErrorMessage.message}
						</div>
					)}
				</form>
			</div>
		</>
	);
};

export default EmailLogin;
