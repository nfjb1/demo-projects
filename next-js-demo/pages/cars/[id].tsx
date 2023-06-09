import styles from '../../styles/components/CarDetails/CarDetail.module.css';

import stylesAssetBox from '@/components/AssetBox/AssetBox.module.css';
import { Meta } from '@/components/Meta';
import Image from 'next/image';
import { Spacer } from '@/components/Layout';
import Link from 'next/link';
import { FiChevronLeft } from 'react-icons/fi';

export default function Car({ car }) {
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

	const convertDateString = (dateString: Date) => {
		const date = new Date(dateString);
		const months = [
			'Jan',
			'Feb',
			'Mar',
			'Apr',
			'May',
			'Jun',
			'Jul',
			'Aug',
			'Sep',
			'Oct',
			'Nov',
			'Dec',
		];
		return `${months[date.getMonth()]}. ${date.getFullYear()}`;
	};

	return (
		<>
			<Meta title={`${car.carData.brand} ${car.carData.model}`} />
			<main>
				<Link href='/dashboard'>
					<div className={styles.sub_header}>
						<FiChevronLeft />
						Back to dashboard
					</div>
				</Link>
				<div className={styles.car_detail_wrapper}>
					<div id={styles.item_0}>
						<Image
							src={car.metaData.imageUrl}
							width={1700}
							height={900}
							alt='test'
						/>
					</div>
					<div id={styles.item_1}>
						<div style={{ width: '86.66%' }}>
							<div className={styles.type_info_box}>{carType()}</div>
							<h1>
								{car.carData.brand} {car.carData.model}
							</h1>
							<Spacer size={1} axis='vertical' />
							<h3>
								{carType()}, {car.carData.brand}
							</h3>
							<Spacer size={1} axis='vertical' />
							{car.metaData.stage === 'funding' && (
								<div className={styles.stage_info_box}>
									<h1>Funding phase</h1>
									<div className={stylesAssetBox.list_object}>
										<p>Progress</p>
										<h3>{car.metaData.stageProgress}</h3>
									</div>
									<h4>
										Secure your digital shares in the iconic{' '}
										{car.carData.brand} {car.carData.model}
									</h4>
								</div>
							)}
							<h2>About this car</h2>
							<p>{car.carData.description}</p>
						</div>
					</div>
					<div id={styles.item_2}>
						<div className={styles.details_box}>
							<div className={styles.details_box_list_object}>
								<p>Brand / Model</p>
								<h3>
									{car.carData.brand} / {car.carData.brand}
								</h3>
							</div>
							<div className={styles.details_box_list_object}>
								<p>Mileage</p>
								<h3>{car.carData.mileage} km</h3>
							</div>

							<div className={styles.details_box_list_object}>
								<p>Initial Registration</p>
								<h3>
									{convertDateString(car.carData.firstRegistration)}
								</h3>
							</div>
							<div className={styles.details_box_list_object}>
								<p>Body Type</p>
								<h3>{car.carData.bodyType}</h3>
							</div>
							<div className={styles.details_box_list_object}>
								<p>Engine</p>
								<h3>{car.carData.engine}</h3>
							</div>
							<div className={styles.details_box_list_object}>
								<p>Performance</p>
								<h3>{car.carData.performance} PS</h3>
							</div>
							<div className={styles.details_box_list_object}>
								<p>First delivery</p>
								<h3>{convertDateString(car.carData.firstDelivery)}</h3>
							</div>
							<div className={styles.details_box_list_object}>
								<p>Expected Total Performance</p>
								<h3>{car.carData.expectedTotalPerformance} %</h3>
							</div>
							<div className={styles.details_box_list_object}>
								<p>Expected Total Performance p.a.</p>
								<h3>
									{car.carData.expectedAverageTotalPerformancePerYear} %
								</h3>
							</div>
							<div className={styles.details_box_list_object}>
								<p>Number of tokens</p>
								<h3>{car.carData.numberOfTokens} %</h3>
							</div>
							<div className={styles.details_box_list_object}>
								<p>Start Of Period</p>
								<h3>{convertDateString(car.carData.startOfPeriod)}</h3>
							</div>
							<div className={styles.details_box_list_object}>
								<p>Expected End Of Period</p>
								<h3>
									{convertDateString(car.carData.expectedEndOfPeriod)}
								</h3>
							</div>
							<div className={styles.details_box_list_object}>
								<p>Next Distribution</p>
								<h3>{convertDateString(car.carData.nextDistribution)}</h3>
							</div>
						</div>
					</div>
				</div>
			</main>
		</>
	);
}

export const getStaticProps = async ({ params }) => {
	// only get last 9 leters from id

	console.log('inside of getStaticProps');

	try {
		const newId = params.id.slice(-9);

		const apiUrl =
			process.env.NEXT_PUBLIC_VERCEL_ENV === 'production'
				? 'https://project2.nicolas.app/'
				: 'http://localhost:3000';

		const res = await fetch(`${apiUrl}/api/cars/${newId}`);
		const resJ = await res.json();
		const car = resJ.data[0];

		return {
			props: {
				car,
				revalidate: 30,
			},
		};
	} catch (err) {
		console.log(err);
	}
};

export const getStaticPaths = async () => {
	console.log('inside of getStaticPaths');

	const apiUrl =
		process.env.NEXT_PUBLIC_VERCEL_ENV === 'production'
			? 'https://project2.nicolas.app'
			: 'http://localhost:3000';

	const res = await fetch(`${apiUrl}/api/cars`);
	const resJ = await res.json();
	const cars = resJ.data;

	const paths = cars.map((car) => ({
		params: {
			id: car.carData.brand + '-' + car.carData.model + '-' + car.metaData.carId,
		},
	}));

	return {
		paths,
		fallback: false,
	};
};
