import styles from './Spinner.module.css';
import { CSSProperties } from 'react';
export default function Spinner({
	size,
	type,
	color,
}: {
	size?: string;
	type?: string;
	color?: string;
}) {
	function determineSize(size: string | undefined) {
		switch (size) {
			case 'small':
				return { width: '1rem', height: '1rem' };
			case 'normal':
				return { width: '2rem', height: '2rem' };
			case 'large':
				return { width: '3rem', height: '3rem' };
			default:
				return { width: '2rem', height: '2rem' };
		}
	}

	function determineType(type: string | undefined) {
		switch (type) {
			case 'fullscreen':
				return {
					display: 'flex',
					height: '100vh',
					width: '100%',
					justifyContent: 'center',
					alignItems: 'center',
				} as CSSProperties;
			default:
				return {};
		}
	}

	function determineColor(color: string | undefined) {
		switch (color) {
			case 'invert':
				return {
					borderColor: 'var(--font-color-invert)',
					borderBottomColor: 'transparent',
				} as CSSProperties;
			default:
				return {};
		}
	}

	return (
		<div style={determineType(type)}>
			<span
				className={styles.loader}
				style={Object.assign(determineColor(color), determineSize(size))}
			></span>
		</div>
	);
}
