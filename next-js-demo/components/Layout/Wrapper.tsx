import clsx from 'clsx';
import styles from './Wrapper.module.css';

const Wrapper = ({ children, className }: { children: any; className?: string }) => {
	return <div className={clsx(styles.wrapper, className)}>{children}</div>;
};

export default Wrapper;
