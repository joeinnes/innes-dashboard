import { APPLE_ID, APPLE_PASS } from '$env/static/private';
import { createDAVClient } from 'tsdav';

/** @type {import('./$types').RequestHandler} */
export async function GET() {
	const client = await createDAVClient({
		serverUrl: 'https://contacts.icloud.com',
		credentials: {
			username: APPLE_ID,
			password: APPLE_PASS
		},
		authMethod: 'Basic',
		defaultAccountType: 'caldav'
	});
	const calendars = await client.fetchCalendars();
	console.log(calendars);

	return new Response(JSON.stringify({}));
}
