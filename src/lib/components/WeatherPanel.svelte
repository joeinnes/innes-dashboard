<script>
  export let precip_prob = 0;
  /** @type number */
  export let day;
  /** @type {'na' | number} */
  export let temp_min = 'na';
  export let temp_max = 0;
  export let weather_image = '';
  export let weather_desc = '';
  export let windspeed = 0;
  export let wind_direction = 0;
</script>

<div class="card relative p-1 flex flex-col justify-center items-center text-sm w-full h-full">
  <div
    class="absolute left-0 top-0 w-full h-full z-10 rounded-b"
    style="background-image: linear-gradient(to top, var(--rain-colour)
    0%, var(--rain-colour)
    {precip_prob}%, transparent {precip_prob}%;"
  />
  <div class="relative z-20 flex flex-col items-center justify-center h-full">
    <p>
      {#if day > 0}
        {new Date(day * 1000).toLocaleString('en-GB', {
          weekday: 'short',
          day: '2-digit',
          month: 'short'
        })}{/if}
    </p>

    <p>
      {#if temp_min !== 'na'}{temp_min}-{/if}{temp_max}&deg;C
    </p>

    <img width="50px" src={weather_image} alt={weather_desc} />
    <p>
      {weather_desc}
    </p>
    <div style="display: flex; justify-content: space-between; gap: 0.5rem;">
      {windspeed}km/h
      <span style="transform: rotate({wind_direction - 90}deg); display:inline-block">&#x279C;</span
      >
    </div>
  </div>
</div>
