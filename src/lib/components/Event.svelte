<script>
	import dayjs from 'dayjs';
	/** @type {{ summary: string; location: string, start: Date, end: Date, allDay: boolean }} */
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
	class="inline-block p-1 rounded bg-secondary-200 text-secondary-900 text-sm {event.allDay
		? 'w-full'
		: 'absolute inline-block w-[95%] left-[5%]'}"
	style={event.allDay ? '' : `top: ${startPx}px; height: ${endPx - startPx}px;`}
>
	<p class="font-semibold">{event.summary}</p>
	<p>{event.location ?? ''}</p>
</div>
