<script>
  import { weather_codes } from '$lib/weather_codes';

  export let weatherCode = 0;
  export let temp = 0;
  export let precip_prob = 0;
  /** @type {import('dayjs').Dayjs} */
  export let thisHour;
  /** @type { 'day' | 'night'} */
  export let isDay = 'day';
</script>

<div class="flex flex-col justify-center items-center relative">
  <div
    class="absolute left-0 top-0 w-full h-full z-0 rounded-b"
    style="background-image: linear-gradient(to top, var(--rain-colour)
    0%, var(--rain-colour)
    {precip_prob}%, transparent {precip_prob}%"
  />
  <div class="z-10 flex flex-col justify-center items-center relative">
    <span>{thisHour.format('HH')}h</span>
    <img
      src={weather_codes[weatherCode][isDay].image}
      alt={weather_codes[weatherCode][isDay].description}
    />
    <span>{Math.round(temp)}&deg;</span>
  </div>
</div>
