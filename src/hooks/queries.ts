import { useQuery } from "@tanstack/react-query";
import type { ParamsOption, RequestBodyOption } from "openapi-fetch";
import type { paths } from "../lib/api/v1";
import { client } from "../lib/api";

type UseQueryOptions<T> = ParamsOption<T> &
	RequestBodyOption<T> & {
		// add your custom options here
		reactQuery?: {
			enabled: boolean; // Note: React Query type’s inference is difficult to apply automatically, hence manual option passing here
			// add other React Query options as needed
		};
	};

// paths
const GET_FACT = "/fact";
const GET_FACTS = "/facts";
const GET_BREEDS = "/breeds";

export function getFact({
	params,
	body,
	reactQuery,
}: UseQueryOptions<paths[typeof GET_FACT]["get"]>) {
	return useQuery({
		...reactQuery,
		queryKey: [
			GET_FACT,
			// add any other hook dependencies here
		],
		queryFn: async ({ signal }) => {
			const { data } = await client.GET(GET_FACT, {
				params,
				// body - isn’t used for GET, but needed for other request types
				signal, // allows React Query to cancel request
			});
			return data;
			// Note: Error throwing handled automatically via middleware
		},
	});
}

export function getFacts({
	params,
	body,
	reactQuery,
}: UseQueryOptions<paths[typeof GET_FACTS]["get"]>) {
	return useQuery({
		...reactQuery,
		queryKey: [
			GET_FACTS,
			// add any other hook dependencies here
		],
		queryFn: async ({ signal }) => {
			const { data } = await client.GET(GET_FACTS, {
				params,
				// body - isn’t used for GET, but needed for other request types
				signal, // allows React Query to cancel request
			});
			return data as unknown as WithPagination<typeof data>;
			// Note: Error throwing handled automatically via middleware
		},
	});
}

export function getBreeds({
	params,
	body,
	reactQuery,
}: UseQueryOptions<paths[typeof GET_BREEDS]["get"]>) {
	return useQuery({
		...reactQuery,
		queryKey: [
			GET_BREEDS,
			// add any other hook dependencies here
		],
		queryFn: async ({ signal }) => {
			const { data, response } = await client.GET(GET_BREEDS, {
				params,
				// body - isn’t used for GET, but needed for other request types
				signal, // allows React Query to cancel request
			});
			return data as unknown as WithPagination<typeof data>;
		},
	});
}

// TYPES //

interface Pagination {
	current_page: number;
	first_page_url: string;
	from: number;
	last_page: number;
	last_page_url: string;
	links: {
		url: string | null;
		label: string;
		active: boolean;
	}[];
	next_page_url: string | null;
	path: string;
	per_page: number;
	prev_page_url: string | null;
	to: number;
	total: number;
}
interface WithPagination<D = any> extends Pagination {
	data: D;
}
