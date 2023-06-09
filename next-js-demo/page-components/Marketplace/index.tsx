import Head from 'next/head';
import Image from 'next/image';
import { Inter } from 'next/font/google';
import styles from './Marketplace.module.css';
import Meta from '@/components/Meta/Meta';

// import useUser from '../data/use-user';

import Link from 'next/link';

import { AssetBox } from '@/components/AssetBox';

import Spinner from '@/components/Layout/Spinner';
import { useEffect, useState } from 'react';

import useSWR, { useSWRConfig } from 'swr';

// const inter = Inter({ subsets: ['latin'] });

import { useSession, signIn, signOut } from 'next-auth/react';

export const Marketplace = () => {
	const { data: session, status } = useSession();

	// const fetcher = async (input: RequestInfo, init: RequestInit, ...args: any[]) => {
	// 	const res = await fetch(input, init);
	// 	return res.json();
	// };

	const { data, error, isLoading } = useSWR('/api/cars');

	const [filterData, setFilterData] = useState(null);

	// , axios.get, {
	// 	refreshInterval: 1000,
	// 	revalidateOnFocus: false,
	// 	revalidateOnReconnect: false,
	// 	revalidateOnMount: true,
	// 	shouldRetryOnError: false,
	// 	// onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
	// 	// Never retry on 404.
	// 	if (error.status === 404) return;

	// 	// Only retry up to 10 times.
	// 	if (retryCount >= 10) re turn;

	// 	// Retrying twice as long as the previous attempt.
	// 	setTimeout(() => revalidate({ retryCount: retryCount + 1 }), 1000);
	// },
	// });

	function greetUser() {
		const date = new Date();
		const hour = date.getHours();

		if (hour < 12) {
			return 'Good morning';
		} else if (hour < 18) {
			return 'Good afternoon';
		} else {
			return 'Good evening';
		}
	}

	return (
		<>
			<main className={styles.main}>
				{session && (
					<>
						<h1>
							{greetUser()}, {session?.user?.firstName}.
						</h1>

						<h4>
							Expand your portfolio with alternative investments -
							don&apos;t buy the whole asset, benefit from a share.
						</h4>
					</>
				)}

				<div className={styles.filter_wrapper}>
					{/* <h3>Filter cars</h3> */}
					<div className={styles.filter_button_wrapper}>
						<button
							type='button'
							className={[
								styles.filter_button,
								filterData === null && styles.active,
							].join(' ')}
							onClick={() => setFilterData(null)}
						>
							All
						</button>
						<button
							type='button'
							className={[
								styles.filter_button,
								filterData === 'none' && styles.active,
							].join(' ')}
							onClick={() => setFilterData('none')}
						>
							Starting soon
						</button>
						<button
							type='button'
							className={[
								styles.filter_button,
								filterData === 'funding' && styles.active,
							].join(' ')}
							onClick={() => setFilterData('funding')}
						>
							Funding active
						</button>
						<button
							type='button'
							className={[
								styles.filter_button,
								filterData === 'funding_closed' && styles.active,
							].join(' ')}
							onClick={() => setFilterData('funding_closed')}
						>
							Funding closed
						</button>
						<button
							type='button'
							className={[
								styles.filter_button,
								filterData === 'trading' && styles.active,
							].join(' ')}
							onClick={() => setFilterData('trading')}
						>
							Trading active
						</button>
					</div>
				</div>
				<div className={styles.asset_box_wrapper}>
					{isLoading &&
						Array.from({ length: 8 }, (x, i) => {
							return <span className={styles.loader} key={i}></span>;
						})}

					{data?.data?.map((car: any) => {
						if (filterData === null) {
							return <AssetBox car={car} key={car.metaData.carId} />;
						}

						if (filterData !== null && car.metaData.stage == filterData) {
							return <AssetBox car={car} key={car.metaData.carId} />;
						}
					})}
				</div>
			</main>
		</>
	);
};
