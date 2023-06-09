import Meta from '@/components/Meta/Meta';
import { Notifications } from '@/page-components/Admin';

const AdminNotificationsPage = () => {
	return (
		<>
			<Meta title='Admin - Notifications' />
			<Notifications />
		</>
	);
};

AdminNotificationsPage.auth = true;

export default AdminNotificationsPage;
