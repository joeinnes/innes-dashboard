<script>
  import { page } from '$app/stores';

  import dayjs from 'dayjs';
  import relativeTime from 'dayjs/plugin/relativeTime';
  import isoWeek from 'dayjs/plugin/isoWeek';

  dayjs.extend(relativeTime);
  dayjs.extend(isoWeek);

  import MiniWeather from './MiniWeather.svelte';

  /** @type Date */
  export let date = new Date();
  const { weather } = $page.data;
  const { hourly } = weather;
  let toSkip = hourly.time.findIndex((/** @type {number} */ el) => el * 1000 > date.valueOf()) - 1;
  let next12Hours = hourly.time.slice(toSkip, toSkip + 12);
  // TODO: Make probability of rain warning threshold configurable?
  let nextRainIndex = hourly.precipitation_probability.findIndex(
    (/** @type {number} */ el, /** @type {number} */ i) => i > toSkip && el > 10
  );
  let nextRainTime = nextRainIndex > -1 ? hourly.time[nextRainIndex] : null;
  let nextRainDayJs = nextRainTime ? dayjs(nextRainTime * 1000) : null;

  /** @param {number} weatherCode */
  function isRain(weatherCode) {
    const rainCodes = [
      51, // Light drizzle
      53, // Drizzle
      55, // Heavy drizzle
      56, // Light freezing drizzle
      57, // Freezing drizzle
      61, // Light rain
      63, // Rain
      65, // Heavy Rain
      66, // Light freezing rain
      67, // Freezing rain
      80, // Light showers
      81, // Showers
      82, // Heavy showers
      95 // Thunderstorm
    ];
    if (rainCodes.includes(weatherCode)) {
      return true;
    }
    return false;
  }

  $: {
    toSkip = hourly.time.findIndex((/** @type {number} */ el) => el * 1000 > date.valueOf()) - 1;
    next12Hours = hourly.time.slice(toSkip, toSkip + 12);
    // TODO: Make probability of rain warning threshold configurable?
    nextRainIndex = hourly.precipitation_probability.findIndex(
      (/** @type {number} */ el, /** @type {number} */ i) => i > toSkip && el > 10
    );
    nextRainTime = nextRainIndex > -1 ? hourly.time[nextRainIndex] : null;
    nextRainDayJs = nextRainTime ? dayjs(nextRainTime * 1000) : null;
  }
</script>

<div class="card flex flex-1 p-2 h-full">
  <div class="flex flex-col">
    <div>
      {#if nextRainDayJs}
        Rain {dayjs().diff(nextRainDayJs) > 0 ? 'forecast since' : 'expected'}
        {nextRainDayJs.fromNow()}
      {:else}
        No rain forecast in the next week
      {/if}
    </div>
    <div>
      <div class="text-sm flex gap-1">
        {#each next12Hours as hour, i (hour)}
          {@const thisHour = dayjs(hour * 1000)}
          <MiniWeather
            {thisHour}
            isDay={thisHour.isBefore(weather.daily.sunrise[0] * 1000) ||
            thisHour.isAfter(weather.daily.sunset[0] * 1000)
              ? 'night'
              : 'day'}
            weatherCode={hourly.weathercode[i + toSkip]}
            temp={hourly.temperature_2m[i + toSkip]}
            precip_prob={hourly.precipitation_probability[i + toSkip]}
          />
        {/each}
      </div>
    </div>
  </div>
</div>
