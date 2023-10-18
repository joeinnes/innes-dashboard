import dayjs from 'dayjs';
import { createDAVClient } from 'tsdav';
import ical from 'ical';
import { error } from '@sveltejs/kit';

import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

/** @type {import('./$types').PageServerLoad} */
export async function load({ fetch, cookies }) {
	try {
		const creds = cookies.get('apple_creds');
		if (!creds) throw new Error('Invalid credentials');
		const { email, password } = JSON.parse(creds);
		// TODO: Get latitude and longitude from the request, create an interface for that on the client end
		const resW = await fetch(
			'https://api.open-meteo.com/v1/forecast?latitude=47.49015328480057&longitude=19.05607796773393&hourly=temperature_2m,precipitation_probability,precipitation,weathercode&daily=weathercode,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_sum,precipitation_hours,precipitation_probability_max,windspeed_10m_max,winddirection_10m_dominant&current_weather=true&timeformat=unixtime&timezone=auto'
		);

		const weather = await resW.json();
		const client = await createDAVClient({
			serverUrl: 'https://caldav.icloud.com',
			credentials: {
				username: email,
				password: password
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

		const calendar = events.map((el) => {
			const data = ical.parseICS(el.data);
			const keys = Object.keys(data);
			const event = data[keys[0]];
			return {
				summary: event.summary,
				start: dayjs.tz(event.start, event?.start?.tz).toISOString(),
				end: dayjs.tz(event.end, event?.end?.tz).toISOString(),
				location: event.location,
				rrule: event.rrule,
				allDay: !!event.start?.dateOnly
			};
		});
		return { weather, calendar };
	} catch (e) {
		if (e?.message === 'Invalid credentials') {
			throw error(401, {
				message: 'No credentials were supplied or credentials were incorrect.',
				code: 'BAD_CREDS'
			});
		}
		throw error(500);
	}
}
