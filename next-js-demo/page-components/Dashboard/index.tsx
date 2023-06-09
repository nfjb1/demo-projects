import { Wrapper, Spacer, Container } from '@/components/Layout';

import { Button } from '@/components/Button';

import clsx from 'clsx';

import { CircularProgressbar } from 'react-circular-progressbar';

import { MembershipProgressBar } from '@/components/MembershipProgressBar';

import styles from './Dashboard.module.css';

import Link from 'next/link';

import { useSession } from 'next-auth/react';
import useSWR from 'swr';

import { FiBell, FiCheck } from 'react-icons/fi';

import { useState } from 'react';

import { DashboardAssetBox } from '@/components/AssetBox';

// TODO: Zu LIB auslagern

function formatDate(type, dateString) {
	switch (type) {
		case 'day-month-year':
			const date = new Date(dateString);
			const year = new Date().getFullYear();
			const month = new Date().toLocaleString('default', { month: 'short' });
			const day = date.toLocaleString('default', { day: 'numeric' });
			const lastYear = year - 1;
			const outputYear = date.getFullYear() === year ? '' : lastYear;
			const output = `${day}. ${month} ${outputYear}`;
			return output;
		case 'month-year':
			const dateMonthYear = new Date(dateString);
			const yearMonthYear = new Date().getFullYear();
			const monthMonthYear = new Date().toLocaleString('default', {
				month: 'short',
			});
			const lastYearMonthYear = yearMonthYear - 1;
			const outputYearMonthYear =
				dateMonthYear.getFullYear() === yearMonthYear
					? yearMonthYear
					: lastYearMonthYear;
			const outputMonthYear = `${monthMonthYear} ${outputYearMonthYear}`;
			return outputMonthYear;
		case 'time':
			const time = new Date(dateString);
			const hours = time.getHours();
			const minutes = time.getMinutes();
			const outputTime = `${hours}:${minutes}`;
			return outputTime;
		default:
			return dateString;
	}
}

const Notifications = ({ user }) => {
	const { data: notifications, mutate } = useSWR('/api/user/notifications');

	const [showAllNotifications, setShowAllNotifications] = useState(2 as number);
	const [showDescription, setShowDescription] = useState([] as number[]);
	const [showDoneIcon, setShowDoneIcon] = useState([] as number[]);

	if (!notifications) {
		return <p>Loading</p>;
	}

	async function markAsRead(notificationId) {
		mutate(async () => {
			await fetch(`/api/user/notifications`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					notificationId: notificationId,
				}),
			});

			return notifications.filter(
				(notification) => notification.id !== notificationId
			);
		}, false);
	}

	return (
		<>
			{notifications && (
				<ul>
					{notifications.slice(0, showAllNotifications).map((notification) => (
						<li
							key={notification.id}
							className='list-item card'
							style={{
								gap: '1rem',
								alignItems: 'center',
							}}
							onMouseEnter={() =>
								setShowDoneIcon([...showDoneIcon, notification.id])
							}
							onMouseLeave={() =>
								setShowDoneIcon(
									showDoneIcon.filter((id) => id !== notification.id)
								)
							}
						>
							<FiBell size='1rem' />
							<div
								style={{ flexBasis: '70%', cursor: 'pointer' }}
								onClick={() =>
									showDescription.includes(notification.id)
										? setShowDescription(
												showDescription.filter(
													(id) => id !== notification.id
												)
										  )
										: setShowDescription([
												...showDescription,
												notification.id,
										  ])
								}
							>
								<b className='small'>{notification.title}</b>

								{showDescription.includes(notification.id) && (
									<>
										<Spacer size={0.5} axis='vertical' />
										<p className='small'>
											{notification.description}
										</p>
									</>
								)}
							</div>
							<div style={{ width: '4rem', textAlign: 'right' }}>
								{showDoneIcon.includes(notification.id) ? (
									<>
										<FiCheck
											size='1.1rem'
											style={{ cursor: 'pointer' }}
											onClick={() => markAsRead(notification.id)}
										/>
									</>
								) : (
									<p className='small'>
										{formatDate(
											'day-month-year',
											notification.created_at
										)}
									</p>
								)}
							</div>
						</li>
					))}
				</ul>
			)}
			{notifications.length > 2 ? (
				showAllNotifications == 2 ? (
					<Button
						style={{
							marginTop: '1rem',
							width: '100%',
						}}
						onClick={() => setShowAllNotifications(99)}
					>
						Show more notifications
					</Button>
				) : (
					<Button
						style={{
							marginTop: '1rem',
							width: '100%',
						}}
						onClick={() => setShowAllNotifications(2)}
					>
						Hide more notifications
					</Button>
				)
			) : null}
		</>
	);
};

const UserGreeting = ({ user }) => {
	const { data: notifications, error, isLoading } = useSWR('/api/user/notifications');

	if (!notifications) {
		return <p>Loading</p>;
	}

	return (
		<>
			<div className={clsx(styles.user_greeting, 'card')}>
				<h2>Welcome back, {user.firstName}.</h2>
				<Spacer size={0.5} axis='vertical' />
				<p>
					You have <b>{notifications.length}</b> unread notifications
				</p>
				<Spacer size={1.5} axis='vertical' />

				<Notifications user={user} />
			</div>
		</>
	);
};

const MembershipOverview = ({ user }) => {
	const { data: membership, error, isLoading } = useSWR('/api/user/membership');

	return (
		<div className={clsx(styles.membership_overview, 'card')}>
			{!isLoading && (
				<Link href='/membership'>
					<div style={{ padding: '0 1rem' }}>
						<MembershipProgressBar
							points={membership.points}
							level={membership.level}
						/>
					</div>
					<Spacer size={1} axis='vertical' />
					<p className='small' style={{ textAlign: 'center' }}>
						{membership.level === 'gold' ? (
							<>
								<b>Congrats!</b>
								<br />
								<Spacer size={0.5} axis='vertical' />
								You are a <b className='gold_text'>GOLD</b> member
							</>
						) : (
							<>
								<b>{300 - membership.points}</b> points missing for{' '}
								<span className='gold_text'>GOLD</span> status
							</>
						)}
					</p>
				</Link>
			)}
		</div>
	);
};

const UpcomingEvents = ({ user }) => {
	const { data: events, error, isLoading } = useSWR('/events.json');

	return (
		<div className={clsx('card', styles.upcoming_events)}>
			<h3>Next Events</h3>
			<Spacer size={1} axis='vertical' />
			<ul>
				{!isLoading &&
					events.slice(0, 3).map((event) => (
						<Link href='/event/[id]' as={`/event/${event.id}`} key={event.id}>
							<li className='list-item' style={{ flexDirection: 'column' }}>
								<div>
									<p
										className='list-item_left_side small'
										style={{ marginBottom: '0.5rem' }}
									>
										{event.date}
									</p>
								</div>
								<div style={{ flexBasis: '80%' }}>
									<h4 style={{ marginBottom: '0.1rem' }}>
										{event.title}
									</h4>
									{event.levels.map((level) => (
										<div
											className={clsx(
												level,
												'membership_info',
												'small'
											)}
											key={level}
										>
											{level.toUpperCase()}
										</div>
									))}
								</div>
							</li>
						</Link>
					))}
			</ul>

			<Button href='/events'>View all events</Button>
		</div>
	);
};

const InvestmentOverview = ({ user }) => {
	return (
		<div className={clsx('card', styles.investment_overview)}>
			<h2>Investment overview</h2>
			<Spacer size={1} axis='vertical' />
			<Wrapper>
				<Container>
					<div className='card'>
						<p>15 owned cars</p>
					</div>
					<Spacer size={2} axis='horizontal' />
					<div className='card'>
						<p>+21%</p>
					</div>
					<Spacer size={2} axis='horizontal' />
					<div className='card'>
						<p>2.301,23€ invested</p>
					</div>
				</Container>
			</Wrapper>
			<Spacer size={1} axis='vertical' />
		</div>
	);
};

const AssetOverview = ({ user }) => {
	const { data, error, isLoading } = useSWR('/api/cars');

	return (
		<div className={clsx('card', styles.asset_overview)}>
			{/* <h2>Asset overview</h2> */}
			{/* <Spacer size={3} axis='vertical' /> */}
			{data?.data?.map((car: any) => {
				return <DashboardAssetBox car={car} key={car.metaData.carId} />;
			})}
			{/* <p>
				You have <b>0</b> new notifications
			</p> */}
		</div>
	);
};

export const Dashboard = () => {
	const { data: session, status } = useSession();

	console.log(session);

	if (status === 'loading') {
		return <p></p>;
	}

	return (
		<>
			<Spacer size={2} axis='vertical' />

			<Wrapper className={styles.overview_section}>
				<UserGreeting user={session.user} />
				<MembershipOverview user={session.user} />
				<UpcomingEvents user={session.user} />
				<InvestmentOverview user={session.user} />
			</Wrapper>
			<Spacer size={2} axis='vertical' />

			<Wrapper>
				<h2>Your Assets</h2>
				<AssetOverview user={session.user} />
			</Wrapper>
		</>
	);
};
