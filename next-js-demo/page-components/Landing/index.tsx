import { useRef } from 'react';
import Link from 'next/link';

import styles from './Landing.module.css';

import CarModel from '@/components/landingPageCar/Car.js';

export const Landing = () => {
	const section1 = useRef(null);
	const section2 = useRef(null);
	const section3 = useRef(null);
	const section4 = useRef(null);

	return (
		<>
			<CarModel sections={{ section1, section2, section3, section4 }} />
			<div className={styles.landing_page}>
				<section className={styles.content}>
					<div ref={section1} className={styles.section1}>
						<div className={styles.hero_element}>
							<div className={styles.hero_element_text_holder}>
								<h1>
									Take the wheel of your financial future as a car
									collector by investing in tokenized supercars
								</h1>
							</div>
						</div>
					</div>
					<div ref={section2} className={styles.section2}>
						<div className={styles.section_element}>
							<div className={styles.section_text_holder}>
								<div className={styles.section_text_title}>
									<h1>
										Discover all benefits of investing in tokenized
										supercars
									</h1>
								</div>
								<div className={styles.section_text_subtext}>
									<h2>
										With our tokenized supercars, you can experience
										the joy of car ownership without the limitations
										of a conventional car. Our digital assets are easy
										to acquire and manage, giving you access to a
										variety of supercars that you can own as part of
										your portfolio.
									</h2>
								</div>
								<Link href='/benefits'>
									<div className={styles.section_button}>
										<span>Explore all benefits</span>
									</div>
								</Link>
							</div>
						</div>
					</div>
					<div ref={section3} className={styles.section3}>
						<div className={styles.section_element}>
							<div className={styles.section_text_holder}>
								<div className={styles.section_text_title}>
									<h1>
										Tokenized Supercar Events: Drive Your Exclusives
									</h1>
								</div>
								<div className={styles.section_text_subtext}>
									<h2>
										Tokenized supercar collectors can experience the
										thrill of driving their exclusive automobiles at
										our events. Meet other car enthusiasts and learn
										about the technology behind our digital assets.
										Sign up on our website to participate.
									</h2>
								</div>
								<Link href='/events'>
									<div className={styles.section_button}>
										<span>Read more about events</span>
									</div>
								</Link>
							</div>
						</div>
					</div>
					<div ref={section4} className={styles.section4}>
						<div className={styles.section_element}>
							<div className={styles.section_text_holder}>
								<div className={styles.section_text_title}>
									<h1>Join Us Now!</h1>
								</div>
								<div className={styles.section_text_subtext}>
									<h2>
										With our tokenized supercars, you can experience
										the joy of car ownership without the limitations
										of a conventional car. Our digital assets are easy
										to acquire and manage, giving you access to a
										variety of supercars that you can own as part of
										your portfolio.
									</h2>
								</div>
								<Link href='/login'>
									<div className={styles.section_button}>
										<span>Get Started</span>
									</div>
								</Link>
							</div>
						</div>
					</div>
				</section>
			</div>
		</>
	);
};
