import { Wrapper, Spacer, Container } from '@/components/Layout';
import { Button } from '@/components/Button';
import { Input, Textarea } from '@/components/Input';
import clsx from 'clsx';
import { MembershipProgressBar } from '@/components/MembershipProgressBar';
import useSWR from 'swr';
import { useSession } from 'next-auth/react';
import styles from './Notifications.module.css';
import { useCallback, useEffect, useRef, useState } from 'react';

import { toast } from 'react-toastify';

const CreateNotification = ({ user }) => {
	const [notificationForm, setNotificationForm] = useState({
		receiver: '',
		title: '',
		description: '',
	});

	const [isLoading, setIsLoading] = useState(false);

	async function onSubmit(e) {
		e.preventDefault();
		setIsLoading(true);

		await fetch('/api/user/notifications', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(notificationForm),
		})
			.then((res) => res.json())
			.then((data) => {
				if (data.success) {
					toast.success('Notification created successfully');
				} else {
					toast.error(data.message);
				}
			})
			.finally(() => {
				setIsLoading(false);
			});
	}

	function handleChange(e) {
		setNotificationForm({
			...notificationForm,
			[e.target.name]: e.target.value,
		});
	}

	return (
		<div className='card'>
			<h1>Create Notification</h1>

			<form onSubmit={onSubmit}>
				<Input
					htmlType='text'
					autoComplete='off'
					name='receiver'
					onChange={handleChange}
					label='Email of receiver'
					required
				/>
				<Spacer size={0.5} axis='vertical' />
				<Input
					htmlType='text'
					autoComplete='off'
					name='title'
					onChange={handleChange}
					label='Title'
					required
				/>
				<Spacer size={0.5} axis='vertical' />
				<Input
					htmlType='text'
					autoComplete='off'
					name='description'
					onChange={handleChange}
					label='Description'
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
		</div>
	);
};

export const Notifications = () => {
	const { data: session, status } = useSession();

	const { data: membership, error, isLoading } = useSWR('/api/user/membership');

	return (
		<>
			<Wrapper className='wrapper'>
				<Spacer size={2} axis='vertical' />

				<CreateNotification user={session.user} />
			</Wrapper>
		</>
	);
};
