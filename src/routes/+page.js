/** @type {import('./$types').PageLoad} */
export async function load({ fetch }) {
	const resW = await fetch(
		'https://api.open-meteo.com/v1/forecast?latitude=47.49015328480057&longitude=19.05607796773393&hourly=temperature_2m,precipitation_probability,precipitation,weathercode&daily=weathercode,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_sum,precipitation_hours,precipitation_probability_max,windspeed_10m_max,winddirection_10m_dominant&current_weather=true&timeformat=unixtime&timezone=auto'
	);
	const resC = await fetch('/calendar');
	const weather = await resW.json();
	const calendar = await resC.json();
	return { weather, calendar };
}
