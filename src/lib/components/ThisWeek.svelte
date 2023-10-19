<script>
  import { page } from '$app/stores';

  import dayjs from 'dayjs';
  import relativeTime from 'dayjs/plugin/relativeTime';
  import isoWeek from 'dayjs/plugin/isoWeek';
  import utc from 'dayjs/plugin/utc';
  import timezone from 'dayjs/plugin/timezone';

  dayjs.extend(relativeTime);
  dayjs.extend(isoWeek);
  dayjs.extend(utc);
  dayjs.extend(timezone);
  
  const { calendar } = /** @type {{ calendar: App.CalEntry[] }} */ ($page.data);
  export let date = new Date();
</script>

<h2 class="h5 font-bold">This Week (W{dayjs().isoWeek()})</h2>
{#each [1, 2, 3, 4, 5, 6] as days}
  {@const day = dayjs(date).add(days, 'days')}
  {@const events = calendar
    .filter((el) => {
      return day.isSame(dayjs(el.start), 'day');
    })
    .sort((a, b) => {
      return dayjs.utc(a.start).unix() > dayjs.utc(b.start).unix() ? 1 : -1;
    })}
  {#if events.length}
    <div>
      <hgroup class="leading-tight">
        <h3 class="h6 font-semibold">{day.format('ddd DD-MMM-YYYY')}</h3>
      </hgroup>
      <ul class="text-sm">
        {#each events as event}
          <li>
            {#if !event.allDay}
              {dayjs.utc(event.start).format('HH:mm')}{#if event.end}-{dayjs.utc(event.end).format(
                  'HH:mm'
                )}{/if} -
            {/if}{event.summary}
          </li>
        {/each}
      </ul>
    </div>
  {/if}
{/each}
