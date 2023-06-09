import { ComingSoon } from '@/page-components/ComingSoon';
import { Meta } from '@/components/Meta';

const TermsPage = () => {
	return (
		<>
			<Meta title='Coming Soon...' />
			<ComingSoon title='Terms' />
		</>
	);
};

TermsPage.auth = true;

export default TermsPage;
