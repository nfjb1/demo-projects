import styles from './AssetBox.module.css';

import dashboardBox from './DashboardAssetBox.module.css';

import { CSSProperties } from 'react';

import { Button } from '@/components/Button';

import Image from 'next/image';

import Link from 'next/link';

import clsx from 'clsx';

interface Car {
	title: string;
	description: string;
}

export function AssetBox({ car }: { car: any }) {
	const carType = () => {
		switch (car.carData.type) {
			case 'sportscar':
				return 'Sports Car';
			case 'classic':
				return 'Classic Car';
			default:
				return '...';
		}
	};

	const stage = () => {
		switch (car.metaData.stage) {
			case 'none':
				return 'Starting soon';
			case 'funding':
				return 'Funding phase';
			case 'funding_closed':
				return 'Funding closed';
			case 'trading':
				return 'Trading active';
			default:
				return '...';
		}
	};

	const expPerformance = () => {
		if ((car.carData.expectedAverageTotalPerformancePerYear * 100) % 1 === 0) {
			return (car.carData.expectedAverageTotalPerformancePerYear * 100).toFixed(0);
		}
		return (car.carData.expectedAverageTotalPerformancePerYear * 100).toFixed(2);
	};

	return (
		<Link
			href='/cars/[id]'
			as={`/cars/${car.carData.brand}-${car.carData.model}-${car.metaData.carId}`}
			className={styles.box}
		>
			<Image
				src={car.metaData.imageUrl}
				width={1000}
				height={1000}
				alt={`${car.carData.brand} ${car.carData.model}`}
				className={styles.top_image}
			/>
			<div className={styles.top_image_overlay}>{carType()}</div>
			<div
				className={[styles.funding_devider, styles[car.metaData.stage]].join(' ')}
			>
				<div className={styles.funding_devider_left}>
					<p>{stage()}</p>
				</div>
				<div className={styles.funding_devider_right}>
					{car.metaData.stage === 'funding' && (
						<>
							<div className={styles.progress_bar}>
								<div
									className={styles.progress_bar_progress}
									style={{
										width: `${car.metaData.stageProgress}%`,
									}}
								></div>
							</div>
							{car.metaData.stageProgress}%
						</>
					)}
				</div>
			</div>
			<div className={styles.car_info}>
				<h2>{car.carData.brand}</h2>
				<h1>
					{car.carData.brand} {car.carData.model}
				</h1>
				<div className={styles.list_object}>
					<h4>Price per digital share:</h4>
					<h4>1.00€</h4>
				</div>
				<div className={styles.list_object}>
					<h4>Number of digital shares:</h4>
					<h4>{car.carData.numberOfTokens}</h4>
				</div>
				<div className={styles.list_object}>
					<h4>Financing volume:</h4>
					<h4>{car.carData.numberOfTokens} €</h4>
				</div>
				<div className={styles.list_object}>
					<h4>
						Historical performance:
						<br />
						of comparable assets p.a.*
					</h4>
					<h3>{expPerformance()}%</h3>
				</div>
				{car.metaData.stage === 'trading' && (
					<>
						<button
							type='button'
							className={[styles.buy_sell_button].join(' ')}
						>
							Trade this asset
						</button>
					</>
				)}
			</div>
		</Link>
	);
}

export function DashboardAssetBox({ car }: { car: any }) {
	const carType = () => {
		switch (car.carData.type) {
			case 'sportscar':
				return 'Sports Car';
			case 'classic':
				return 'Classic Car';
			default:
				return '...';
		}
	};

	const stage = () => {
		switch (car.metaData.stage) {
			case 'none':
				return 'Starting soon';
			case 'funding':
				return 'Funding phase';
			case 'funding_closed':
				return 'Funding closed';
			case 'trading':
				return 'Trading active';
			default:
				return '...';
		}
	};

	const expPerformance = () => {
		if ((car.carData.expectedAverageTotalPerformancePerYear * 100) % 1 === 0) {
			return (car.carData.expectedAverageTotalPerformancePerYear * 100).toFixed(0);
		}
		return (car.carData.expectedAverageTotalPerformancePerYear * 100).toFixed(2);
	};

	return (
		<>
			<div className={clsx('card', dashboardBox.box)}>
				<Image
					src={car.metaData.imageUrl}
					width={1000}
					height={1000}
					alt={`${car.carData.brand} ${car.carData.model}`}
					className={dashboardBox.top_image}
				/>
				<div>
					<h2>{car.carData.brand}</h2>
					<h1>
						{car.carData.brand} {car.carData.model}
					</h1>
					<Button
						href='/cars/[id]'
						as={`/cars/${car.carData.brand}-${car.carData.model}-${car.metaData.carId}`}
					>
						More about the car
					</Button>
				</div>
			</div>
		</>
	);

	// return (
	// 	<Link
	// 		href='/cars/[id]'
	// 		as={`/cars/${car.carData.brand}-${car.carData.model}-${car.metaData.carId}`}
	// 		className={styles.box}
	// 	>
	// 		<Image
	// 			src={car.metaData.imageUrl}
	// 			width={1000}
	// 			height={1000}
	// 			alt={`${car.carData.brand} ${car.carData.model}`}
	// 			className={styles.top_image}
	// 		/>
	// 		<div className={styles.top_image_overlay}>{carType()}</div>
	// 		<div
	// 			className={[styles.funding_devider, styles[car.metaData.stage]].join(' ')}
	// 		>
	// 			<div className={styles.funding_devider_left}>
	// 				<p>{stage()}</p>
	// 			</div>
	// 			<div className={styles.funding_devider_right}>
	// 				{car.metaData.stage === 'funding' && (
	// 					<>
	// 						<div className={styles.progress_bar}>
	// 							<div
	// 								className={styles.progress_bar_progress}
	// 								style={{
	// 									width: `${car.metaData.stageProgress}%`,
	// 								}}
	// 							></div>
	// 						</div>
	// 						{car.metaData.stageProgress}%
	// 					</>
	// 				)}
	// 			</div>
	// 		</div>
	// 		<div className={styles.car_info}>
	// 			<h2>{car.carData.brand}</h2>
	// 			<h1>
	// 				{car.carData.brand} {car.carData.model}
	// 			</h1>
	// 			<div className={styles.list_object}>
	// 				<h4>Price per digital share:</h4>
	// 				<h4>1.00€</h4>
	// 			</div>
	// 			<div className={styles.list_object}>
	// 				<h4>Number of digital shares:</h4>
	// 				<h4>{car.carData.numberOfTokens}</h4>
	// 			</div>
	// 			<div className={styles.list_object}>
	// 				<h4>Financing volume:</h4>
	// 				<h4>{car.carData.numberOfTokens} €</h4>
	// 			</div>
	// 			<div className={styles.list_object}>
	// 				<h4>
	// 					Historical performance:
	// 					<br />
	// 					of comparable assets p.a.*
	// 				</h4>
	// 				<h3>{expPerformance()}%</h3>
	// 			</div>
	// 			{car.metaData.stage === 'trading' && (
	// 				<>
	// 					<button
	// 						type='button'
	// 						className={[styles.buy_sell_button].join(' ')}
	// 					>
	// 						Trade this asset
	// 					</button>
	// 				</>
	// 			)}
	// 		</div>
	// 	</Link>
	// );
}
