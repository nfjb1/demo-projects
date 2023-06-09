import { ComingSoon } from '@/page-components/ComingSoon';
import { Meta } from '@/components/Meta';

const TradingPage = () => {
	return (
		<>
			<Meta title='Coming Soon...' />
			<ComingSoon title='Trading' />
		</>
	);
};

TradingPage.auth = true;

export default TradingPage;
