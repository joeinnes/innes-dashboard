// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    // interface Locals {}
    // interface PageData {}
    // interface Platform {}
    interface CalEntry {
      summary: string;
      start: string;
      end: string;
      location: string;
      rrule: string;
      allDay: boolean;
    }
  }
}

export {};
