import { Marketplace } from '@/page-components/Marketplace';
import { Meta } from '@/components/Meta';

const MarketplacePage = () => {
	return (
		<>
			<Meta title='Marketplace' />
			<Marketplace />
		</>
	);
};

MarketplacePage.auth = true;

export default MarketplacePage;
