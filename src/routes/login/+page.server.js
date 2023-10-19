import { redirect } from '@sveltejs/kit';

/** @type {import('./$types').Actions} */
export const actions = {
  default: async ({ request, cookies }) => {
    const data = await request.formData();
    const email = /** @type string */ (data.get('email'));
    const password = /** @type string */ (data.get('password'));
    // TODO: don't store the creds, store a session, but I don't have a backend for this now to store sessions, and want to host this serverlessly.
    cookies.set('apple_creds', JSON.stringify({ email, password }));
    throw redirect(301, '/');
  }
};
