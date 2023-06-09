import {
	CircularProgressbar,
	CircularProgressbarWithChildren,
} from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

import { MdCelebration } from 'react-icons/md';

const MembershipProgressBar = ({ points, level }) => {
	if (level === 'silver') {
		return (
			<CircularProgressbar
				value={points}
				maxValue={300}
				strokeWidth={8}
				text={level.toUpperCase()}
				styles={{
					path: {
						stroke: 'var(--colors-gray12)',
					},
					trail: {
						stroke: 'var(--colors-gray4)',
					},
					text: {
						fill: `${
							level === 'gold'
								? 'var(--colors-amber5)'
								: 'var(--colors-gray11)'
						}`,
						fontSize: '0.8rem',
						fontWeight: 'bold',
					},
				}}
			/>
		);
	}

	if (level === 'gold') {
		return (
			<CircularProgressbarWithChildren
				value={100}
				maxValue={100}
				strokeWidth={8}
				styles={{
					path: {
						stroke: 'rgba(197, 166, 99, 1)',
					},
					trail: {
						stroke: 'var(--colors-gray4)',
					},
				}}
			>
				<MdCelebration size='3rem' />
			</CircularProgressbarWithChildren>
		);
	}
};

export default MembershipProgressBar;
