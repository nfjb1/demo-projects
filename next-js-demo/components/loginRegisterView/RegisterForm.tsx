import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

import Spinner from '../Layout/Spinner';

import { FiLock, FiAtSign, FiUser, FiAlertCircle } from 'react-icons/fi';

interface FormData {
	name: string;
	email: string;
	password: string;
	password_confirm: string;
}

export default function RegisterForm({
	setShowVerifyEmailInfo,
}: {
	setShowVerifyEmailInfo: (value: boolean) => void;
}) {
	// const dispatch = useDispatch<AppDispatch>();
	const router = useRouter();

	const [loading, setLoading] = useState(false);
	const [showErrorMessage, setShowErrorMessage] = useState({
		status: false,
		message: '',
	} as { status: boolean; message: string });
	const [showPasswordInfo, setShowPasswordInfo] = useState(false as boolean);
	const [showPasswordDoNotMatch, setShowPasswordDoNotMatch] = useState(
		false as boolean
	);
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		password: '',
		password_confirm: '',
	} satisfies FormData);

	const sumbitButton = useRef(
		null
	) as unknown as React.MutableRefObject<HTMLButtonElement>;

	const { name, email, password, password_confirm } = formData;

	useEffect(() => {
		validateForm();
	}, [formData, showPasswordInfo]);

	async function createUser({
		name,
		email,
		password,
	}: {
		name: string;
		email: string;
		password: string;
	}) {
		const response = await fetch('/api/auth/signup', {
			method: 'POST',
			body: JSON.stringify({ name, email, password }),
			headers: {
				'Content-Type': 'application/json',
			},
		});

		if (response.status === 422) {
			setShowErrorMessage({
				status: true,
				message: 'You are already registered.',
			});

			setLoading(false);
			disableButton(false);
			return;
		}

		const data = await response.json();

		// if (!response.ok) {
		// 	throw new Error(data.message || 'Something went wrong!');
		// }

		return data;
	}

	async function handleSubmit(e: any) {
		e.preventDefault();
		disableButton(false);
		if (!validateForm()) return;
		setLoading(true);
		disableButton(true);

		try {
			await createUser({ name, email, password });
			setShowVerifyEmailInfo(true);
		} catch (error) {
			console.log('error');
			console.log(error);
		}

		// await dispatch(registerUser(formData))
		// 	.then((res) => {
		// 		console.log(res);
		// 		if (res.payload === 'already in database') {
		// 			setShowErrorMessage({
		// 				status: true,
		// 				message: 'User already in database.',
		// 			});
		// 			setLoading(false);
		// 			disableButton(false);
		// 		} else {
		// 			setLoading(false);
		// 			disableButton(false);
		// 			router.replace('/');
		// 		}
		// 	})
		// 	.catch((err) => {
		// 		toast.error('An error occured. Error: ' + err);
		// 		setLoading(false);
		// 		disableButton(false);
		// 	});
	}

	function disableButton(disable: boolean) {
		if (disable) {
			sumbitButton.current.classList.add('submit_disabled');
		} else {
			sumbitButton.current.classList.remove('submit_disabled');
		}
	}

	function validateForm(): boolean {
		if (
			name !== '' &&
			email !== '' &&
			password !== '' &&
			password_confirm !== '' &&
			password === password_confirm
		) {
			disableButton(false);
			return true;
		} else {
			disableButton(true);
			return false;
		}
	}

	function checkForPasswordMatch(value: string) {
		if (value !== password) {
			setShowPasswordDoNotMatch(true);
		} else {
			setShowPasswordDoNotMatch(false);
		}
	}

	function handleFormChange(e: React.ChangeEvent<HTMLInputElement>): void {
		e.target.name === 'password' && checkForStrongPassword(e.target.value);
		e.target.name === 'password_confirm' && checkForPasswordMatch(e.target.value);
		setFormData({ ...formData, [e.target.name]: e.target.value });
	}

	function checkForStrongPassword(password: string): void {
		const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9_])/;
		if (!passwordRegex.test(password) || password.length < 8) {
			setShowPasswordInfo(true);
		} else {
			setShowPasswordInfo(false);
		}
	}

	const forgetPassword = <Link href='/forgot-password'>Forgot password?</Link>;
	const passwordInfo =
		'Password must have more than 8 characters, include uppercase, lowercase, numbers, and special characters.';

	return (
		<>
			<div>
				<form onSubmit={handleSubmit}>
					<div className='input_field'>
						<div className='input_field_icon'>
							<span>
								<FiUser />
							</span>
						</div>
						<div className='input_field_wrapper'>
							<input
								type='text'
								name='name'
								autoComplete='name'
								placeholder=' '
								onChange={handleFormChange}
								className='input_field_text'
							/>
							<span className='input_field_label'>First and last name</span>
						</div>
					</div>
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
								placeholder=' '
								autoComplete='new-password'
								onChange={handleFormChange}
								className='input_field_text'
							/>
							<span className='input_field_label'>Password</span>
						</div>
					</div>
					{showPasswordInfo && (
						<div className='error_message'>{passwordInfo}</div>
					)}
					{password !== '' && !showPasswordInfo && (
						<>
							<div className='input_field'>
								<div className='input_field_icon'>
									<span>
										<FiLock />
									</span>
								</div>
								<div className='input_field_wrapper'>
									<input
										type='password'
										name='password_confirm'
										placeholder=' '
										autoComplete='new-password'
										onChange={handleFormChange}
										className='input_field_text'
									/>
									<span className='input_field_label'>
										Repeat password
									</span>
								</div>
							</div>
							{password_confirm !== '' && showPasswordDoNotMatch && (
								<div className='error_message'>
									<FiAlertCircle size='1rem' />
									Passwords do not match
								</div>
							)}
						</>
					)}
					<div className='input_field submit_button'>
						<button
							type='submit'
							ref={sumbitButton}
							className='submit_button'
						>
							{!loading ? 'Registieren' : <Spinner size='small' />}
						</button>
					</div>
					{showErrorMessage.status && (
						<div className='error_message'>
							{showErrorMessage.message}{' '}
							{showErrorMessage.message ===
								'You are already registered.' && (
								<span>Try to login.</span>
							)}
						</div>
					)}
				</form>
			</div>
		</>
	);
}
