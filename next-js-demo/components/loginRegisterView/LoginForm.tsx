import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

import Spinner from '../Layout/Spinner';

import { FiLock, FiAtSign } from 'react-icons/fi';

import Router from 'next/router';
import { signIn } from 'next-auth/react';

import { FiAlertCircle } from 'react-icons/fi';
import { toast } from 'react-toastify';

interface FormData {
	email: string;
	password: string;
}

export default function LoginForm() {
	const [loading, setLoading] = useState(false as boolean);
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
		disableButton(true);

		const cUrl =
			process.env.NEXT_PUBLIC_VERCEL_ENV === 'production'
				? process.env.BASE_URL
				: 'http://localhost:3000';

		const res = await signIn('credentials', {
			email,
			password,
			callbackUrl: `${cUrl}/profile`,
			redirect: false,
		});

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
					disableButton(false);
					break;
				case 'Error: Email verification needed':
					setShowErrorMessage({
						status: true,
						message: 'Email verification still outstanding.',
					});
					setLoading(false);
					disableButton(false);
					break;
				case 'Error: User not found':
					setShowErrorMessage({
						status: true,
						message: 'No user found with entered email address.',
					});
					setLoading(false);
					disableButton(false);
					break;
				default:
					toast.error('Something went wrong. Please try again later. ');
					setLoading(false);
					disableButton(false);
					break;
			}

			// if (error === 'Database not reached') {
			// 	setShowErrorMessage({
			// 		status: true,
			// 		message: 'Wrong email or password. ',
			// 	});
			// 	setLoading(false);
			// 	disableButton(false);
			// } else {
			// 	setShowErrorMessage({
			// 		status: true,
			// 		message: 'Wrong email or password. ',
			// 	});
			// 	setLoading(false);
			// 	disableButton(false);
			// }
		} else {
			Router.replace('/profile');
		}
	}

	function disableButton(disable: boolean) {
		if (disable) {
			sumbitButton.current.classList.add('submit_disabled');
		} else {
			sumbitButton.current.classList.remove('submit_disabled');
		}
	}

	function validateForm(): boolean {
		if (email !== '' && password !== '') {
			disableButton(false);
			return true;
		} else {
			disableButton(true);
			return false;
		}
	}

	function handleFormChange(e: React.ChangeEvent<HTMLInputElement>): void {
		setShowErrorMessage({ status: false, message: '' });
		setFormData({ ...formData, [e.target.name]: e.target.value });
	}

	const forgetPassword = <Link href='/forgot-password'>Forgot password?</Link>;

	return (
		<>
			<div>
				<form onSubmit={handleSubmit}>
					<div className='input_field'>
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
					</div>
					<div className='form_options'>
						<span className='hint_text'>{forgetPassword}</span>
					</div>

					<div className='input_field submit_button'>
						<button
							type='submit'
							ref={sumbitButton}
							className='submit_button'
						>
							{!loading ? 'Login' : <Spinner size='small' />}
						</button>
					</div>

					{showErrorMessage.status && (
						<div className='error_message'>
							<FiAlertCircle size='1rem' /> {showErrorMessage.message}
						</div>
					)}
				</form>
			</div>
		</>
	);
}
