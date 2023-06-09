import { Benefits } from '@/page-components/Benefits';
import { Meta } from '@/components/Meta';

const BenefitsPage = () => {
	return (
		<>
			<Meta title='Benefits' />
			<Benefits />
		</>
	);
};

BenefitsPage.auth = false;

export default BenefitsPage;
