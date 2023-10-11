import { APPLE_ID, APPLE_PASS } from '$env/static/private';
import dayjs from 'dayjs';
import { createDAVClient } from 'tsdav';
import ical from 'ical';

/** @type {import('./$types').RequestHandler} */
export async function GET() {
	const client = await createDAVClient({
		serverUrl: 'https://caldav.icloud.com',
		credentials: {
			username: APPLE_ID,
			password: APPLE_PASS
		},
		authMethod: 'Basic',
		defaultAccountType: 'caldav'
	});

	const events = await client.fetchCalendarObjects({
		calendar: {
			url: 'https://caldav.icloud.com/1938344474/calendars/87C45C59-6F85-439E-8ACE-415307EF36DB/'
		},
		expand: true,
		timeRange: {
			start: dayjs().startOf('week').toISOString(),
			end: dayjs().endOf('week').toISOString()
		}
	});

	const icalData = events.map((el) => {
		const data = ical.parseICS(el.data);
		const keys = Object.keys(data);
		const event = data[keys[0]];
		return {
			summary: event.summary,
			start: event.start,
			end: event.end,
			location: event.location,
			rrule: event.rrule,
			allDay: !!event.start?.dateOnly
		};
	});

	return new Response(JSON.stringify(icalData));
}
