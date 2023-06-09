import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

import navStyles from './Header.module.css';
import Link from 'next/link';
import Image from 'next/image';
import logo from './logo-black-PNG.png';

import Spinner from './Spinner';

import Header_Sidebar from './Header_Sidebar';

import useUser from '../../data/use-user';

import { FiMenu } from 'react-icons/fi';

import { useSession, signOut } from 'next-auth/react';

export default function Header() {
	// const { user, mutate, loading, error } = useUser();

	const { data: session, status } = useSession();

	// const isAuthenticated = user.isAuthenticated ? true : false;

	const [showMenu, setShowMenu] = useState(false as boolean);

	const [showHeader, setShowHeader] = useState(true);

	// const router = useRouter();
	const { asPath, events } = useRouter();

	const pagesWithoutHeader = ['/auth/login', '/auth/register'];

	useEffect(() => {
		console.log(asPath);
		if (pagesWithoutHeader.includes(asPath)) {
			setShowHeader(false);
		} else {
			setShowHeader(true);
		}
	}, []);

	useEffect(() => {
		const handleRouteChange = () => {
			if (pagesWithoutHeader.includes(asPath)) {
				setShowHeader(false);
			} else {
				setShowHeader(true);
			}
		};

		events.on('routeChangeStart', handleRouteChange);

		return () => {
			events.off('routeChangeStart', handleRouteChange);
		};
	}, [asPath, events, pagesWithoutHeader]);

	return (
		<nav>
			<div className={navStyles.nav}>
				<div className={navStyles.nav_left_section}>
					<Link href='/'>
						<Image src={logo} alt='Logo' className={navStyles.nav_logo} />
					</Link>
				</div>
				<div className={navStyles.nav_right_section}>
					<div className={navStyles.nav_login_button}>
						{status === 'loading' ? (
							<Spinner size='small' color='invert' />
						) : session ? (
							<Link href='/dashboard'>Dashboard</Link>
						) : (
							<Link href='/auth/login'>Login</Link>
						)}
					</div>

					<FiMenu
						onClick={() => setShowMenu(!showMenu)}
						style={{ cursor: 'pointer' }}
					/>
					{/* <FontAwesomeIcon icon={solid('bars')} /> */}
				</div>
			</div>
			<Header_Sidebar setShowMenu={setShowMenu} showMenu={showMenu} />
		</nav>
	);
}
