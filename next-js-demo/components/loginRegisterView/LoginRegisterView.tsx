import { useState } from 'react';

import Image from 'next/image';
import styles from './LoginRegisterView.module.css';
import Meta from '../Meta/Meta';
import Link from 'next/link';

import Background from '../../public/carSVG.svg';

import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

import useUser from '../../data/use-user';
import Router from 'next/router';
import { toast } from 'react-toastify';

import { FiCheck } from 'react-icons/fi';

export default function Login({
	url,
	providers,
	signIn,
}: {
	url: string;
	providers?: any;
	signIn?: any;
}) {
	const [viewType, setViewType] = useState(url as string);
	const [showVerifyEmailInfo, setShowVerifyEmailInfo] = useState(false as boolean);

	// const { user, mutate, loading, error } = useUser();

	const privacyInfo = (
		<>
			<p className='hint_text'>
				By continuing, you agree to our terms and conditions and privacy policy.
				Information on the processing of your data can be found in our privacy
				policy.
			</p>
		</>
	);

	return (
		<>
			<Meta title={viewType === 'register' ? 'Register' : 'Login'} />
			<div className={styles.login_page}>
				<div className={styles.login_box}>
					<div className={styles.svg}>
						<Image
							src={Background}
							alt='Login Background'
							className={styles.login_svg}
						/>
					</div>

					<div className={styles.form}>
						{!showVerifyEmailInfo ? (
							<div className={styles.form_wrapper}>
								<div className={styles.header}>
									<h1>
										{viewType === 'register'
											? 'Weclome to CARCOLLECTORS'
											: 'Welcome aa!'}
									</h1>
								</div>
								<div className={styles.top_row}>
									<h5>(Only enter a real email address)</h5>
								</div>
								<div>
									<div className={styles.form_group}>
										{viewType === 'register' ? (
											<RegisterForm
												setShowVerifyEmailInfo={
													setShowVerifyEmailInfo
												}
											/>
										) : (
											<LoginForm />
										)}
									</div>
									{privacyInfo}
								</div>
								<h4 className={styles.lineH}>
									<span>or continue with</span>
								</h4>
								<div className={styles.social_media_login_wrapper}>
									<Link
										href='#'
										onClick={() =>
											signIn('google', {
												callbackUrl:
													'http://localhost:3000/profile',
											})
										}
									>
										<div
											id={styles.google_sign_in_button}
											className={styles.sign_in_button}
										>
											<Image
												src='https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg'
												alt='Google Login'
												width={50}
												height={50}
											/>
										</div>
									</Link>
									<Link
										href='#'
										onClick={() =>
											signIn('facebook', {
												callbackUrl:
													'http://localhost:3000/profile',
											})
										}
									>
										<div
											id={styles.facebook_sign_in_button}
											className={styles.sign_in_button}
										>
											<Image
												src='https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/facebook.svg'
												alt='Facebook Login'
												width={50}
												height={50}
											/>
										</div>
									</Link>
									{/* 
									{providers &&
										Object.values(providers).map((provider) => (
											<div
												key={provider.name}
												style={{ marginBottom: 0 }}
											>
												<button
													onClick={() =>
														signIn(provider.id, {
															callbackUrl:
																'http://localhost:3000/profile',
														})
													}
												>
													Sign in with {provider.name}
												</button>
											</div>
										))} */}
								</div>
								<div className={styles.bottom_row}>
									<h5>
										{viewType === 'register' ? (
											<>
												<span>Already registered? </span>
												<span
													onClick={() => setViewType('login')}
												>
													Log in here.
												</span>
											</>
										) : (
											<>
												<span>
													You don&apos;t have an account yet?{' '}
												</span>
												<span
													onClick={() =>
														setViewType('register')
													}
												>
													Join now
												</span>
											</>
										)}
									</h5>
								</div>
							</div>
						) : (
							<>
								<div className={styles.confirmation_wrapper}>
									<FiCheck size='8rem' />
									<div>
										<h1>Thank you!</h1>
										<h4>
											Please check your inbox to verify your email
											address and finish your registration.
										</h4>
									</div>
								</div>
							</>
						)}
					</div>
				</div>
			</div>
		</>
	);
}
