import { Events } from '@/page-components/Events';
import { Meta } from '@/components/Meta';

const EventsPage = () => {
	return (
		<>
			<Meta title='Benefits' />
			<Events />
		</>
	);
};

EventsPage.auth = false;

export default EventsPage;
