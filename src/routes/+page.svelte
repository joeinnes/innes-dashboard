<script>
	import { onMount } from 'svelte';

	import dayjs from 'dayjs';
	import relativeTime from 'dayjs/plugin/relativeTime';

	import { weather_codes } from '$lib/weather_codes';
	import WeatherPanel from '$lib/components/WeatherPanel.svelte';
	import { session } from '$lib/stores/session';

	dayjs.extend(relativeTime);

	let date = new Date();
	let greeting = 'Good morning!';
	let weather;
	onMount(() => {
		const interval = setInterval(() => {
			date = new Date();
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
	const getWeather = async () => {
		const res = await fetch(
			'https://api.open-meteo.com/v1/forecast?latitude=47.49015328480057&longitude=19.05607796773393&hourly=temperature_2m,precipitation_probability,precipitation,weathercode&daily=weathercode,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_sum,precipitation_hours,precipitation_probability_max,windspeed_10m_max,winddirection_10m_dominant&current_weather=true&timeformat=unixtime&timezone=auto'
		);
		const data = await res.json();
		return data;
	};
	getWeather().then((r) => (weather = r));

	if (!Object.keys($session).length) {
	}
</script>

<main class="p-2 overflow-hidden">
	<header>
		<div class="flex gap-2">
			<div class="flex justify-between items-center w-full gap-2">
				<hgroup>
					<h1 class="font-bold text-3xl">Innes Home</h1>
					<p>
						{date.toLocaleString('en-GB', {
							day: '2-digit',
							month: 'short',
							year: 'numeric',
							hour: '2-digit',
							minute: '2-digit'
						})}
					</p>
					<p class="text-sm">{greeting}</p>
				</hgroup>
				<div class="flex flex-1 p-2 bg-neutral-200 rounded h-full">
					<div class="flex flex-col">
						<div>
							{#if weather?.hourly.precipitation_probability.findIndex((el) => el > 0) > -1}
								Rain next expected {dayjs()
									.add(
										weather?.hourly.precipitation_probability.findIndex((el) => el > 0),
										'hour'
									)
									.fromNow()}
							{:else}
								No rain forecast in the next week
							{/if}
						</div>
						<div>
							{#if weather?.hourly}
								{@const now = dayjs()}
								{@const startHour =
									weather.hourly.time.findIndex((el) => dayjs(el * 1000).isAfter(now)) - 1}
								<div class="text-sm flex gap-1">
									{#each weather.hourly.time.splice(startHour, 12) as hour, i}
										{@const thisHour = dayjs(hour)}
										{@const isDay =
											thisHour.isBefore(weather.daily.sunrise[0]) ||
											thisHour.isAfter(weather.daily.sunset[0])
												? 'night'
												: 'day'}
										<div class="flex flex-col justify-center items-center">
											<span>{dayjs(hour * 1000).format('HH')}h</span>
											<img
												src={weather_codes[weather.hourly.weathercode[i + startHour]][isDay].image}
												alt={weather_codes[weather.hourly.weathercode[i + startHour]][isDay]
													.description}
											/>
											<span>{Math.round(weather.hourly.temperature_2m[i + startHour])}&deg;</span>
										</div>
									{/each}
								</div>
							{/if}
						</div>
					</div>
				</div>
			</div>
			<div>
				{#if weather?.current_weather}
					<WeatherPanel
						day={0}
						temp_max={Math.round(weather.current_weather.temperature)}
						temp_min="na"
						precip_prob={weather.hourly.precipitation_probability[0]}
						weather_image={weather.current_weather.is_day
							? weather_codes[weather.current_weather.weathercode].day.image
							: weather_codes[weather.current_weather.weathercode].night.image}
						weather_desc={weather.current_weather.is_day
							? weather_codes[weather.current_weather.weathercode].day.description
							: weather_codes[weather.current_weather.weathercode].night.description}
						windspeed={weather.current_weather.windspeed}
						wind_direction={weather.current_weather.winddirection}
					/>
				{/if}
			</div>
		</div>
	</header>

	<div class="grid grid-cols-7 gap-2 justify-between py-2">
		{#if weather?.daily}
			{#each weather?.daily.time as day, i}
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
		{/if}
	</div>
	<div>
		{#if !Object.keys($session).length}
			No session
		{/if}
	</div>
	<div><button on:click={async () => (weather = await getWeather())}>Get Weather</button></div>
</main>
