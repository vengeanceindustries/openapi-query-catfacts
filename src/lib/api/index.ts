import createFetchClient, { type Middleware } from "openapi-fetch";
import createClient from "openapi-react-query";
import type { paths } from "./v1";

const baseUrl = "https://catfact.ninja/";

const throwOnError: Middleware = {
	async onResponse({ response }) {
		if (response.status >= 400) {
			const body = response.headers.get("content-type")?.includes("json")
				? await response.clone().json()
				: await response.clone().text();
			throw new Error(body);
		}
		return undefined;
	},
};

const myMiddleware: Middleware = {
	// async onRequest({ request, options }) {
	// 	// set "foo" header
	// 	request.headers.set("foo", "bar");
	// 	return request;
	// },
	async onResponse({ request, response, options }) {
		const { body, ...resOptions } = response;
		// change status of response
		return new Response(body, { ...resOptions, status: 200 });
	},
	async onError({ error }) {
		// wrap errors thrown by fetch
		return new Error("Oops, fetch failed", { cause: error });
	},
};

export const client = createFetchClient<paths>({
	baseUrl,
});
client.use(myMiddleware);
// export default client;

// export const $api = createClient(client);
// export default $api;
