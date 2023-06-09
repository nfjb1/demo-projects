import { Dashboard } from '@/page-components/Dashboard';
import Head from 'next/head';
import { Meta } from '@/components/Meta';

const DashboardPage = () => {
	return (
		<>
			<Meta title='Dashboard' />
			<Dashboard />
		</>
	);
};

DashboardPage.auth = true;

export default DashboardPage;
