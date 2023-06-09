import { SessionProvider } from 'next-auth/react';
import '@/assets/globals.css';
import '@/assets/base.css';

import type { AppProps } from 'next/app';
import { Provider } from 'react-redux';

import { store, AppDispatch } from '../redux/store';

import type { Session } from 'next-auth';

import Header from '../components/Layout/Header';

import axios from 'axios';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { SWRConfig } from 'swr';

import { useSession } from 'next-auth/react';

import Spinner from '../components/Layout/Spinner';
import Router from 'next/router';

import { deleteCookie, getCookie } from 'cookies-next';

import type { NextComponentType } from 'next';
type CustomAppProps = AppProps & {
	Component: NextComponentType & { auth?: boolean }; // add auth type
};

// const fetcher = (...args) => fetch(...args).then((res) => res.json());

// function fetcher(url, username, password) {
// 	return fetch(url, {
// 		method: 'POST',
// 		headers: { 'Content-Type': 'application/json' },
// 		body: JSON.stringify({ username, password }),
// 	}).then((res) => res.json());
// }

import { Layout } from '@/components/Layout';
import { ThemeProvider } from 'next-themes';

const fetcher = async (input: RequestInfo, init: RequestInit, ...args: any[]) => {
	const res = await fetch(input, init);
	return res.json();
};

export default function App({
	Component,
	pageProps: { session, ...pageProps },
}: CustomAppProps) {
	return (
		<SWRConfig
			value={{
				fetcher,
			}}
		>
			<SessionProvider session={session}>
				<ThemeProvider>
					<Layout>
						{/* <Header /> */}
						{Component.auth ? (
							<Auth>
								<Component {...pageProps} />
							</Auth>
						) : (
							<Component {...pageProps} />
						)}
						<ToastContainer />
					</Layout>
				</ThemeProvider>
			</SessionProvider>
		</SWRConfig>
	);
}

function Auth({ children }: { children: React.ReactNode }): JSX.Element {
	// if `{ required: true }` is supplied, `status` can only be "loading" or "authenticated"
	const { status } = useSession({ required: true });

	if (getCookie('isNewUser')) {
		Router.push('/welcome');
		deleteCookie('isNewUser');
	}

	if (status === 'loading') {
		return <Spinner type='fullscreen' size='large' />;
	}

	return children as JSX.Element;
}
