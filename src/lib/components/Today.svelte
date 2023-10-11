<script>
	import { page } from '$app/stores';
	import dayjs from 'dayjs';

	import Event from './Event.svelte';

	const { calendar } = $page.data;
	const events = calendar
		.filter((el) => dayjs().isSame(dayjs(el.start), 'day'))
		.map((el) => {
			return {
				...el,
				title: el.summary,
				start: dayjs(el.start),
				end: dayjs(el.end)
			};
		});

	export let date = new Date();

	let now = dayjs(date);
	let dayPerc = now.diff(dayjs().startOf('day'), 'day', true);
	let dayHeight = 0;
	/** @type HTMLDivElement */
	let nowEl;
	/** @type HTMLDivElement */
	let dayEl;
	let nowTop = 0;

	$: {
		now = dayjs(date);
		if (dayEl) {
			dayHeight = dayEl.scrollHeight;
			nowTop = dayHeight * dayPerc;

			dayEl.scrollTo({
				top: nowTop - 12,
				left: 0,
				behavior: 'smooth'
			});
		}
	}
</script>

<div class="h-full flex flex-col">
	<h2 class="h5 font-bold">{dayjs().format('DD-MMM-YYYY')}</h2>
	<div class="flex py-1">
		{#each events.filter((ev) => ev.allDay) as event}
			<Event {event} />
		{/each}
	</div>
	<div class="day flex-grow overflow-y-scroll relative" bind:this={dayEl}>
		<div class="bg-red-500 h-[2px] w-full absolute z-10" style="top: {nowTop}px" bind:this={nowEl}>
			<div
				class="absolute rounded-full px-1 -translate-y-1/2 right-0 bg-red-500 text-white text-xs"
			>
				{now.format('HH:mm')}
			</div>
		</div>
		{#each [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23] as hour}
			<div class="h-8 flex">
				<div class="label">{hour || ''}</div>
				<div
					class="content border-b border-r border-l border-gray-300 w-full {hour === 0 &&
						'border-t'}"
				/>
			</div>
		{/each}
		{#each events.filter((el) => !el.allDay) as event}
			<Event {event} {dayHeight} />
		{/each}
	</div>
</div>

<style lang="postcss">
	.label {
		@apply w-[5%] overflow-hidden;
		transform: translateY(-35%);
	}
</style>
