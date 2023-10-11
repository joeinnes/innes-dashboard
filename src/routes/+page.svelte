<script>
	import { onMount } from 'svelte';
	import { invalidateAll } from '$app/navigation';

	import dayjs from 'dayjs';
	import relativeTime from 'dayjs/plugin/relativeTime';
	import isoWeek from 'dayjs/plugin/isoWeek';

	import { weather_codes } from '$lib/weather_codes';
	import CurrentForecast from '$lib/components/CurrentForecast.svelte';
	import ThisWeek from '$lib/components/ThisWeek.svelte';
	import Today from '$lib/components/Today.svelte';
	import WeatherPanel from '$lib/components/WeatherPanel.svelte';

	dayjs.extend(relativeTime);
	dayjs.extend(isoWeek);

	let date = new Date();
	let greeting = 'Good morning!';
	export let data;
	const { weather } = data;
	let refreshCounter = 0;
	let blink = true;
	let toSkip = weather.hourly.time.findIndex((el) => el * 1000 > date.valueOf()) - 1;
	let lastUpdated = new Date().valueOf();

	onMount(() => {
		const interval = setInterval(() => {
			date = new Date();
			toSkip = weather.hourly.time.findIndex((el) => el * 1000 > date.valueOf()) - 1;
			blink = !blink;
			refreshCounter++;
			if (refreshCounter > 5 * 60) {
				refreshCounter = 0;
				lastUpdated = new Date().valueOf();
				invalidateAll();
			}
		}, 1000);
		return () => clearInterval(interval);
	});

	$: {
		const hours = date.getHours();
		if (hours < 6) {
			greeting = `It's the middle of the night!`;
		} else if (hours < 12) {
			greeting = `Good morning!`;
		} else if (hours < 17) {
			greeting = `Good afternoon!`;
		} else if (hours < 23) {
			greeting = `Good evening!`;
		} else {
			greeting = `Good night!`;
		}
	}
</script>

<svelte:head>
	<title>Innes Home</title>
</svelte:head>
<main class="p-2 overflow-hidden flex flex-col h-screen">
	<header>
		<div class="flex gap-2">
			<div class="flex items-stretch w-full gap-2">
				<hgroup class="flex flex-col justify-center">
					<h1 class="h2">Innes Home</h1>
					<p>
						{@html date
							.toLocaleString('en-GB', {
								day: '2-digit',
								month: 'short',
								year: 'numeric',
								hour: '2-digit',
								minute: '2-digit'
							})
							.replace(':', blink ? '<span>:</span>' : '<span class="invisible">:</span>')}
					</p>
					<p class="text-sm">{greeting}</p>
				</hgroup>
				<div>
					<WeatherPanel
						day={0}
						temp_max={Math.round(weather.current_weather.temperature)}
						temp_min="na"
						precip_prob={weather.hourly.precipitation_probability[toSkip]}
						weather_image={weather.current_weather.is_day
							? weather_codes[weather.current_weather.weathercode].day.image
							: weather_codes[weather.current_weather.weathercode].night.image}
						weather_desc={weather.current_weather.is_day
							? weather_codes[weather.current_weather.weathercode].day.description
							: weather_codes[weather.current_weather.weathercode].night.description}
						windspeed={weather.current_weather.windspeed}
						wind_direction={weather.current_weather.winddirection}
					/>
				</div>

				<CurrentForecast {date} />
			</div>
		</div>
	</header>

	<div class="flex gap-2 justify-between py-2">
		{#each weather.daily.time as day, i}
			<WeatherPanel
				temp_min={Math.round(weather.daily.temperature_2m_min[i])}
				temp_max={Math.round(weather.daily.temperature_2m_max[i])}
				precip_prob={weather.daily.precipitation_probability_max[i]}
				{day}
				weather_image={weather_codes[weather.daily.weathercode[i]].day.image}
				weather_desc={weather_codes[weather.daily.weathercode[i]].day.description}
				windspeed={weather.daily.windspeed_10m_max[i]}
				wind_direction={weather.daily.winddirection_10m_dominant[i]}
			/>
		{/each}
	</div>

	<div class="flex h-full gap-2 relative overflow-hidden">
		<div class="w-[57.1%] flex flex-col h-full relative overflow-hidden card p-2">
			<Today {date} />
		</div>
		<div class="card p-2 w-[42.9%]">
			<ThisWeek {date} />
		</div>
	</div>
</main>
