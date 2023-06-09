import { Wrapper, Spacer, Container } from '@/components/Layout';
import clsx from 'clsx';
import { MembershipProgressBar } from '@/components/MembershipProgressBar';
import useSWR from 'swr';
import { useSession } from 'next-auth/react';

import { getMembershipStatus } from '@/api-lib/db';

const MembershipStatus = ({ user, membership, membershipLoading }) => {
	console.log(membership);

	if (membershipLoading) return <div>Loading...</div>;

	const maxPoints = 300;
	const points = membership.points;
	const pointsLeftToNextStatus = 300 - points;

	const level = membership.level;

	return (
		<section className='card' style={{ textAlign: 'center' }}>
			<h2>My status</h2>
			<Spacer size={0.25} axis='vertical' />
			<p>Earn points to increase your VIP status</p>
			<Spacer size={2} axis='vertical' />
			<h3>
				Your current status:{' '}
				{level === 'gold' ? (
					<b className='gold_text'>GOLD</b>
				) : (
					<b className='siver_text'>SILVER</b>
				)}{' '}
			</h3>
			<Spacer size={1} axis='vertical' />
			<div style={{ width: '40%', margin: '0 auto' }}>
				<MembershipProgressBar points={points} level={level} />
			</div>
			<Spacer size={1} axis='vertical' />
			<p style={{ textAlign: 'center' }}>
				{level === 'gold' ? (
					<b>{300 + points} Points</b>
				) : (
					<>
						<b>{points}</b> / <b>{maxPoints}</b> Points
					</>
				)}
			</p>
			<Spacer size={1} axis='vertical' />
			<p style={{ textAlign: 'center' }}>
				{level === 'gold' ? (
					<>
						<b>Congrats!</b> You are a <b className='gold_text'>GOLD</b>{' '}
						member
					</>
				) : (
					<span className='small'>
						Only <b>{pointsLeftToNextStatus}</b> Points left to reach status{' '}
						<b className='gold_text'>GOLD</b>
					</span>
				)}
			</p>
		</section>
	);
};

const UpcomingEvents = ({ membership, membershipLoading }) => {
	const { data: events, error, isLoading: eventsLoading } = useSWR('/events.json');

	if (membershipLoading || eventsLoading) return <div>Loading...</div>;

	const userLevel = membership.level;

	return (
		<section className='card'>
			<ul>
				{events.map((event) => (
					<li
						className='list-item'
						key={event.id}
						style={
							event.levels.length === 1 && event.levels[0] !== userLevel
								? { opacity: '0.1' }
								: {}
						}
					>
						<div>
							<h3 className='list-item_left_side'>{event.date}</h3>
							{event.levels.map((level) => (
								<div
									className={clsx(level, 'membership_info', 'small')}
									key={level}
								>
									{level.toUpperCase()}
								</div>
							))}
						</div>
						<div style={{ flexBasis: '80%' }}>
							<h2>{event.title}</h2>
							<p>{event.description}</p>
						</div>
					</li>
				))}
			</ul>
		</section>
	);
};

export const Membership = () => {
	const { data: session, status } = useSession();

	const { data: membership, error, isLoading } = useSWR('/api/user/membership');

	if (status === 'loading') return <div>Loading...</div>;

	return (
		<>
			<Wrapper className='wrapper'>
				<Spacer size={2} axis='vertical' />
				<h1>Membership</h1>
				<Spacer size={1} axis='vertical' />
				<MembershipStatus
					user={session.user}
					membership={membership}
					membershipLoading={isLoading}
				/>
			</Wrapper>
			<Spacer size={2} axis='vertical' />
			<Wrapper>
				<h1>Upcoming Events</h1>
				<Spacer size={1} axis='vertical' />
				<UpcomingEvents membership={membership} membershipLoading={isLoading} />
			</Wrapper>
		</>
	);
};
