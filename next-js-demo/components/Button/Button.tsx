import { LoadingDots } from '@/components/LoadingDots';
import clsx from 'clsx';
import { forwardRef } from 'react';
import styles from './Button.module.css';

import Link from 'next/link';

export const Button = forwardRef(function Button(
	{
		children,
		type,
		className,
		onClick,
		size,
		href,
		variant = 'invert',
		loading,
		disabled,
		as,
		style,
	},
	ref
) {
	if (href) {
		return (
			<Link
				className={clsx(
					styles.button,
					type && styles[type],
					size && styles[size],
					variant && styles[variant],
					className
				)}
				ref={ref}
				href={href}
				onClick={onClick}
				as={as}
				style={style}
			>
				<span>{children}</span>
			</Link>
		);
	}

	return (
		<button
			className={clsx(
				styles.button,
				type && styles[type],
				size && styles[size],
				styles[variant],
				className
			)}
			style={style}
			ref={ref}
			onClick={onClick}
			disabled={loading || disabled}
		>
			{loading && <LoadingDots className={styles.loading} />}
			<span>{children}</span>
		</button>
	);
});

export const ButtonLink = forwardRef(function Button(
	{ children, type, className, href, onClick, size, style, variant = 'invert' },
	ref
) {
	return (
		<Link
			className={clsx(
				styles.button,
				type && styles[type],
				size && styles[size],
				variant && styles[variant],
				className
			)}
			ref={ref}
			href={href}
			onClick={onClick}
			style={style}
		>
			<span>{children}</span>
		</Link>
	);
});
