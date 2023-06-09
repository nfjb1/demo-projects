import clsx from 'clsx';
import styles from './Container.module.css';

type ContainerProps = {
	justifyContent?: string;
	flex?: string;
	alignItems?: string;
	gap?: string;
	column?: boolean;
	className?: string;
	children: any;
};

const Container = ({
	justifyContent,
	flex,
	alignItems,
	gap,
	column,
	className,
	children,
}: ContainerProps) => {
	return (
		<div
			className={clsx(styles.container, column && styles.column, className)}
			style={{
				justifyContent,
				flex,
				alignItems,
				gap,
			}}
		>
			{children}
		</div>
	);
};

export default Container;
