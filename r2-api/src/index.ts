/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export interface Env {
	jobsBucket: R2Bucket;
	APP_URL: string;
	FRONTEND_JOBS_FILE_NAME: string;
	BACKEND_JOBS_FILE_NAME: string;
	SOUJAVA_JOBS_FILE_NAME: string;
	REACT_BRASIL_JOBS_FILE_NAME: string;
}

export default {
	async fetch(request: Request, env: Env) {
		const url = new URL(request.url);
		const key = url.pathname.slice(1);

		if (!key) return new Response('Job Type Not Provided', { status: 400 });

		let object;
		if (key == 'frontend') object = await env.jobsBucket.get(env.FRONTEND_JOBS_FILE_NAME);
		if (key == 'backend') object = await env.jobsBucket.get(env.BACKEND_JOBS_FILE_NAME);
		if (key == 'soujava') object = await env.jobsBucket.get(env.SOUJAVA_JOBS_FILE_NAME);
		if (key == 'react-brasil') object = await env.jobsBucket.get(env.REACT_BRASIL_JOBS_FILE_NAME);
		if (object === null || object === undefined) return new Response('Object Not Found', { status: 404 });

		const headers = new Headers();
		object.writeHttpMetadata(headers);
		headers.set('etag', object.httpEtag);
		headers.set('Access-Control-Allow-Origin', env.APP_URL);
		headers.set('Access-Control-Allow-Methods', 'GET');

		return new Response(object.body, { headers });
	},
};
