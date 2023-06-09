import styles from './ComingSoon.module.css';

import { Spacer } from '@/components/Layout';

import { Button } from '@/components/Button';

export const ComingSoon = ({ title }) => {
	return (
		<div className={styles.container}>
			<h1>This project is still under construction</h1>
			<Spacer size={2} axis='vertical' />
			<h3>{title ? `The ${title}` : 'This'} page is coming soon...</h3>
			<Spacer size={2} axis='vertical' />
			<Button size='large' href='/' style={{ maxWidth: '23rem' }}>
				Go Back Home
			</Button>
		</div>
	);
};
