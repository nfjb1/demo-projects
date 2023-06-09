import clsx from 'clsx';
import { forwardRef } from 'react';
import styles from './Input.module.css';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { useState } from 'react';

const Input = forwardRef(function Input(
	{
		label,
		placeholder,
		className,
		htmlType,
		autoComplete,
		size,
		ariaLabel,
		required,
		onChange,
		name,
		icon,
		revealPassword,
	},
	ref
) {
	const [showPassword, setShowPassword] = useState(false);
	if (icon) {
		return (
			<div className={clsx(styles.root, className)}>
				<label>
					{label && <div className={styles.label}>{label}</div>}
					<div className={styles.input_wrapper}>
						{icon}
						<input
							type={
								htmlType === 'password'
									? showPassword
										? 'text'
										: 'password'
									: htmlType
							}
							autoComplete={autoComplete}
							placeholder={placeholder}
							ref={ref}
							onChange={onChange}
							className={clsx(styles.input_withIcon, size && styles[size])}
							aria-label={ariaLabel}
							required={required}
							name={name}
						/>
						{htmlType === 'password' &&
							(showPassword ? (
								<FiEyeOff
									onClick={() => setShowPassword(!showPassword)}
									style={{ cursor: 'pointer' }}
								/>
							) : (
								<FiEye
									onClick={() => setShowPassword(!showPassword)}
									style={{ cursor: 'pointer' }}
								/>
							))}
					</div>
				</label>
			</div>
		);
	}

	return (
		<div className={clsx(styles.root, className)}>
			<label>
				{label && <div className={styles.label}>{label}</div>}
				<input
					type={htmlType}
					autoComplete={autoComplete}
					placeholder={placeholder}
					ref={ref}
					onChange={onChange}
					className={clsx(styles.input, size && styles[size])}
					aria-label={ariaLabel}
					required={required}
					name={name}
				/>
			</label>
		</div>
	);
});

export default Input;
