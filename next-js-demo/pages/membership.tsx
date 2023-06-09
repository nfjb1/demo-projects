import { Membership } from '@/page-components/Membership';
import { Meta } from '@/components/Meta';

const MembershipPage = () => {
	return (
		<>
			<Meta title='Membership' />
			<Membership />
		</>
	);
};

MembershipPage.auth = true;

export default MembershipPage;
