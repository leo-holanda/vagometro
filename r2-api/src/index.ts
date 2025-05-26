/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.jsonc`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export interface Env {
	vagometroBucket: R2Bucket;
	APP_URL: string;
}

export default {
	async fetch(request, env, ctx): Promise<Response> {
		const url = new URL(request.url);
		const key = url.pathname.slice(1);
		if (!key) return new Response('Job Data ID Not Provided', { status: 400 });

		const data = await env.vagometroBucket.get(key);
		if (data === null || data === undefined) return new Response('Data Not Found', { status: 404 });

		const headers = new Headers();
		data.writeHttpMetadata(headers);
		headers.set('etag', data.httpEtag);
		headers.set('Access-Control-Allow-Origin', env.APP_URL);
		headers.set('Access-Control-Allow-Methods', 'GET');

		return new Response(data.body, { headers });
	},
} satisfies ExportedHandler<Env>;
