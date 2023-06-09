import { Landing } from '@/page-components/Landing';
import { Meta } from '@/components/Meta';

const LandingPage = () => {
	return (
		<>
			<Meta title='Welcome to CarCollectors' />
			<Landing />
		</>
	);
};

LandingPage.auth = false;

export default LandingPage;
