import useSWR from 'swr';
import { toast } from 'react-toastify';

interface UserData {
	email: string;
	name: string;
	profilePicture: string;
	_id: string;
}

interface User {
	isAuthenticated: boolean;
	isPremiumMember: boolean;
	userData: UserData | undefined;
}

export default function useUser() {
	const userFetcher = async (url: string, token: string) => {
		return fetch(url, {
			headers: token
				? {
						Authorization: `Bearer ${token}`,
						'Content-Type': 'application/json',
						Accept: 'application/json',
				  }
				: undefined,
		})
			.then(async (res) => {
				const data = await res.json();

				if (data.message === 'Authorization Error') {
					throw new Error('Authorization Error');
				}

				return data satisfies UserData;
			})
			.catch((error) => {
				if (!(error.message === 'Authorization Error')) {
					toast.error("API Error: Couldn't fetch user data");
				}

				throw new Error(error.message);
			});
	};

	const url = 'http://localhost:4000/profile';
	const token = '';

	const { data, mutate, error } = useSWR(
		[url, token],
		([url, token]) => userFetcher(url, token),
		{
			revalidateOnReconnect: false,
			shouldRetryOnError: false,
			revalidateOnFocus: false,
			refreshWhenHidden: false,
		}
	);

	const loading = !data && !error;
	const loggedOut = loading || error;

	if (data) {
		const fullName = data.name.split(' ');
		data.firstName = fullName[0];
		data.lastName = fullName[fullName.length - 1];
	}

	return {
		loading,
		user: {
			isAuthenticated: !loggedOut,
			isPremiumMember: false,
			userData: data,
		} satisfies User,
		mutate,
		error,
	};
}
