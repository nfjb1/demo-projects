import { ComingSoon } from '@/page-components/ComingSoon';
import { Meta } from '@/components/Meta';

const NotFoundPage = () => {
	return (
		<>
			<Meta title='Coming Soon...' />
			<ComingSoon title='' />
		</>
	);
};

NotFoundPage.auth = false;

export default NotFoundPage;
