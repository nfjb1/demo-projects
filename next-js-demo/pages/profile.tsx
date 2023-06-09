import { ComingSoon } from '@/page-components/ComingSoon';
import { Meta } from '@/components/Meta';

const ProfilePage = () => {
	return (
		<>
			<Meta title='Coming Soon...' />
			<ComingSoon title='Profile' />
		</>
	);
};

ProfilePage.auth = true;

export default ProfilePage;
