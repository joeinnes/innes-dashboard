<script>
  import dayjs from 'dayjs';
  /** @typedef {import('dayjs').Dayjs} Dayjs */
  /** @type Omit<App.CalEntry, 'start' | 'end'> & { start: Dayjs, end: Dayjs} */
  export let event;
  export let dayHeight = 0;
  let startPx = 0;
  let endPx = 0;

  $: {
    startPx = dayjs(event.start).diff(dayjs().startOf('day'), 'day', true) * dayHeight;
    endPx = dayjs(event.end).diff(dayjs().startOf('day'), 'day', true) * dayHeight;
  }
</script>

<div
  class="inline-block overflow-y-auto p-1 rounded bg-secondary-200 text-secondary-900 text-sm {event.allDay
    ? 'w-full'
    : 'absolute inline-block w-[95%] left-[5%]'}"
  style={event.allDay ? '' : `top: ${startPx}px; height: ${endPx - startPx}px;`}
>
  <p class="font-semibold">{event.summary}</p>
  <p>{event.location ?? ''}</p>
</div>
