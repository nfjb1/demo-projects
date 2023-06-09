import { Avatar } from '@/components/Avatar';
import { Button, ButtonLink } from '@/components/Button';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import { fetcher } from '@/lib/fetch';
// import { useCurrentUser } from '@/lib/user';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import Container from './Container';
import styles from './Nav.module.css';
import Spacer from './Spacer';
import Wrapper from './Wrapper';
import navSidebarStyles from './HeaderSidebar.module.css';

import Image from 'next/image';

import { useSession, signOut } from 'next-auth/react';

import { FiMenu, FiX } from 'react-icons/fi';

import logo from './logo-black-PNG.png';

const UserMenu = ({ user }) => {
	const menuRef = useRef();
	const avatarRef = useRef();

	// const { data: session, status } = useSession();

	// const user = session?.user;

	const [visible, setVisible] = useState(false);

	const router = useRouter();
	useEffect(() => {
		const onRouteChangeComplete = () => setVisible(false);
		router.events.on('routeChangeComplete', onRouteChangeComplete);
		return () => router.events.off('routeChangeComplete', onRouteChangeComplete);
	});

	useEffect(() => {
		// detect outside click to close menu
		const onMouseDown = (event) => {
			if (
				!menuRef.current.contains(event.target) &&
				!avatarRef.current.contains(event.target)
			) {
				setVisible(false);
			}
		};
		document.addEventListener('mousedown', onMouseDown);
		return () => {
			document.removeEventListener('mousedown', onMouseDown);
		};
	}, []);

	const onSignOut = useCallback(async () => {
		try {
			await fetcher('/api/auth', {
				method: 'DELETE',
			});
			toast.success('You have been signed out');
			// mutate({ user: null });
		} catch (e) {
			toast.error(e.message);
		}
	}, []);

	return (
		<>
			<div className={styles.user}>
				<button
					className={styles.trigger}
					ref={avatarRef}
					// onClick={() => setVisible(!visible)}
				>
					<Avatar size={32} username={user.name} url={user.image} />
				</button>
				<div
					ref={menuRef}
					role='menu'
					aria-hidden={visible}
					className={styles.popover}
				>
					{visible && (
						<div className={styles.menu}>
							<Link passHref href={`/user/${user.username}`}>
								<p className={styles.item}>Profile</p>
							</Link>
							<Link passHref href='/settings'>
								<p className={styles.item}>Settngs</p>
							</Link>
							<div className={styles.item} style={{ cursor: 'auto' }}>
								<Container alignItems='center'>
									<span>Theme</span>
									<Spacer size={0.5} axis='horizontal' />
									<ThemeSwitcher />
								</Container>
							</div>
							<button onClick={onSignOut} className={styles.item}>
								Sign out
							</button>
						</div>
					)}
				</div>
			</div>
		</>
	);
};

function Nav_Sidebar(props: { showMenu: boolean; setShowMenu: Function; user: any }) {
	const { showMenu, setShowMenu } = props;

	const user = props.user;

	return (
		<div
			className={navSidebarStyles.sidenav}
			style={
				showMenu
					? { transform: 'translateX(0rem)' }
					: { transform: 'translateX(100%)' }
			}
		>
			<div className={navSidebarStyles.sidenav_header}>
				<div>
					{user && (
						<Link href='/profile' onClick={() => setShowMenu(false)}>
							{/* <Image
								src={user?.image ? user?.image : '/favicon.ico'}
								width={100}
								height={100}
								className={navSidebarStyles.sidenav_header_user_image}
								alt='Profile Pic'
							/> */}
							<Avatar size={32} username={user.name} url={user.image} />
							<p className={navSidebarStyles.sidenav_header_user_name}>
								{user?.name}
							</p>
						</Link>
					)}

					<FiX
						style={{ cursor: 'pointer' }}
						onClick={() => setShowMenu(!showMenu)}
					/>
					{/* <FontAwesomeIcon icon={solid('xmark')} /> */}
				</div>
			</div>
			<div className={navSidebarStyles.sidenav_menu}>
				<Link
					className='sidenav_menu_item'
					href='/dashboard'
					onClick={() => setShowMenu(!showMenu)}
				>
					Dashboard
				</Link>
				<Link
					className='sidenav_menu_item'
					href='/membership'
					onClick={() => setShowMenu(!showMenu)}
				>
					Membership
				</Link>
				<Link
					className='sidenav_menu_item'
					href='/profile'
					onClick={() => setShowMenu(!showMenu)}
				>
					Profile
				</Link>
				<Link
					className='sidenav_menu_item'
					href='/marketplace'
					onClick={() => setShowMenu(!showMenu)}
				>
					Marketplace
				</Link>
				<Link
					className='sidenav_menu_item'
					href='/trading'
					onClick={() => setShowMenu(!showMenu)}
				>
					Trading
				</Link>
				<Link
					className='sidenav_menu_item'
					href='/contact'
					onClick={() => setShowMenu(!showMenu)}
				>
					Contact Us
				</Link>
			</div>
			<div className={navSidebarStyles.sidenav_footer}>
				<Link className={navSidebarStyles.sidenav_footer_item} href='/terms'>
					Terms & Conditions
				</Link>
				<Link className={navSidebarStyles.sidenav_footer_item} href='/privacy'>
					Privacy Statement
				</Link>
				<Link className={navSidebarStyles.sidenav_footer_item} href='/legal'>
					Legal Notice
				</Link>
				{user && (
					<Link
						className={[
							navSidebarStyles.sidenav_footer_item,
							navSidebarStyles.sidenav_footer_logout,
						].join(' ')}
						onClick={() => {
							signOut({ redirect: false }).then(() => {
								setShowMenu(false);
								toast.success('Logged out successfully');
							});
						}}
						href='/'
					>
						Logout
					</Link>
				)}
			</div>
		</div>
	);
}

const Nav = () => {
	// const { data: { user } = {}, mutate } = useCurrentUser();

	const { data: session, status } = useSession();

	const user = session?.user;

	const [showMenu, setShowMenu] = useState(false as boolean);

	return (
		<>
			<nav className={styles.nav}>
				<Wrapper className={styles.wrapper}>
					<Container
						className={styles.content}
						alignItems='center'
						justifyContent='space-between'
					>
						<Link href='/'>
							<Image src={logo} alt='Logo' className={styles.logo} />
							{/* <p className={styles.logo}>Next.js MongoDB App</p> */}
						</Link>
						<Container alignItems='center' gap='1rem'>
							{user ? (
								<UserMenu user={user} />
							) : (
								<>
									<Link passHref href='/login'>
										{/* <ButtonLink
										size='small'
										type='success'
										variant='ghost'
										color='link'
									> */}
										Log in
										{/* </ButtonLink> */}
									</Link>
									<Spacer axis='horizontal' size={0.25} />
									<Link passHref href='/sign-up'>
										<Button size='small' type='success'>
											Sign Up
										</Button>
									</Link>
								</>
							)}
							<FiMenu
								onClick={() => setShowMenu(!showMenu)}
								style={{ cursor: 'pointer' }}
								size={18}
							/>
						</Container>
					</Container>
				</Wrapper>
			</nav>
			<Nav_Sidebar setShowMenu={setShowMenu} showMenu={showMenu} user={user} />
		</>
	);
};

export default Nav;
