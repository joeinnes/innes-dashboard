import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export const session = writable(
	(browser && JSON.parse(localStorage.getItem('session') || '')) || {}
);
session.subscribe((val) => {
	if (browser) return localStorage.setItem('session', JSON.stringify(val));
});
