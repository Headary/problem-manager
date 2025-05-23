import { WebStorageStateStore } from 'oidc-client-ts';
import { AuthProvider } from 'react-oidc-context';
import {
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	isRouteErrorResponse,
} from 'react-router';

import logoFullWhite from '@client/assets/logoFullWhite.png';

import type { Route } from './+types/root';
import stylesheet from './app.css?url';
import { Loader } from './components/ui/loader';
import { Toaster } from './components/ui/sonner';
import { config } from './config';
import { ThemeProvider } from './hooks/themeProvider';

export const links: Route.LinksFunction = () => [
	{ rel: 'preconnect', href: 'https://fonts.googleapis.com' },
	{
		rel: 'preconnect',
		href: 'https://fonts.gstatic.com',
		crossOrigin: 'anonymous',
	},
	{
		rel: 'stylesheet',
		href: 'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap',
	},
	{ rel: 'stylesheet', href: stylesheet },
];

export function meta() {
	return [
		{ title: 'Problem manager' },
		{ property: 'og:title', content: 'Problem manager' },
		{ property: 'og:image', content: config?.ROOT_URL + logoFullWhite },
	];
}

export function HydrateFallback() {
	return (
		<div className="w-full h-screen flex items-center justify-center">
			<Loader className="block" />
		</div>
	);
}

export function Layout({ children }: { children: React.ReactNode }) {
	return (
		<ThemeProvider defaultTheme="system">
			<html lang="cs" className="h-full">
				<head>
					<meta charSet="utf-8" />
					<meta
						name="viewport"
						content="width=device-width, initial-scale=1"
					/>
					<link href="/favicon.ico" rel="icon" />
					<link
						href="/favicon.ico"
						rel="icon"
						media="(prefers-color-scheme: light)"
					/>
					<link
						href="/faviconWhite.ico"
						rel="icon"
						media="(prefers-color-scheme: dark)"
					/>
					<Meta />
					<Links />
				</head>
				<body className="min-h-screen flex flex-col">
					{children}
					<Toaster />
					<ScrollRestoration />
					<Scripts />
				</body>
			</html>
		</ThemeProvider>
	);
}

export default function App() {
	const oidcConfig = {
		authority: config.OIDC_AUTHORITY_URL,
		client_id: config.OIDC_CLIENT_ID,
		redirect_uri: config.ROOT_URL + '/login',
		onSigninCallback: (): void => {
			window.history.replaceState(
				{},
				document.title,
				window.location.pathname
			);
		},
		onSignoutCallback: (): void => {
			window.location.pathname = '/login';
		},
		userStore: new WebStorageStateStore({ store: window.localStorage }),
	};

	return (
		<AuthProvider {...oidcConfig}>
			<Outlet />
		</AuthProvider>
	);
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
	let message = 'Oops!';
	let details = 'An unexpected error occurred.';
	let stack: string | undefined;

	if (isRouteErrorResponse(error)) {
		message = error.status === 404 ? '404' : 'Error';
		details =
			error.status === 404
				? 'The requested page could not be found.'
				: error.statusText || details;
	} else if (import.meta.env.DEV && error && error instanceof Error) {
		details = error.message;
		stack = error.stack;
	}

	return (
		<main className="pt-16 p-4 container mx-auto">
			<h1>{message}</h1>
			<p>{details}</p>
			{stack && (
				<pre className="w-full p-4 overflow-x-auto">
					<code>{stack}</code>
				</pre>
			)}
		</main>
	);
}
