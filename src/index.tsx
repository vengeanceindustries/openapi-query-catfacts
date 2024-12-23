import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import { getBreeds, getFact, getFacts } from "./hooks/queries";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

function Fact() {
	const fact = getFact({
		params: {
			query: { max_length: 500 },
		},
	});
	// const facts = getFacts({
	// 	params: {
	// 		query: { limit: 30, max_length: 500 },
	// 	},
	// });
	const breeds = getBreeds({
		params: {
			query: { limit: 10 },
		},
	});

	let { data: breedList, ...pagination } = breeds.data ?? {};

	return (
		<div>
			{fact.isLoading && <div>Loading...</div>}
			{fact.error ? (
				<div>There was an error: {fact.error.message}</div>
			) : (
				<p>{fact.data?.fact}</p>
			)}
			<button type="button" onClick={() => fact.refetch()}>
				Another fact!
			</button>

			<hr />
			<h2>cat breeds</h2>
			{breeds.error ? (
				<div>There was an error: {breeds.error.message}</div>
			) : (
				<>
					<ul style={{ paddingLeft: 0 }}>
						{breedList?.map((info) => <li key={info.breed}>
							<code>{JSON.stringify(info, undefined, 2)}</code>
						</li>)}
					</ul>
					<pre>
						pagination: <code>{JSON.stringify(pagination, undefined, 2)}</code>
					</pre>
				</>
			)}

		</div>
	);
}

function App() {
	const [reactQueryClient] = useState(
		new QueryClient({
			defaultOptions: {
				queries: {
					networkMode: "offlineFirst", // keep caches as long as possible
					refetchOnWindowFocus: false, // don’t refetch on window focus
				},
			},
		})
	);
	return (
		<QueryClientProvider client={reactQueryClient}>
			<Fact />
		</QueryClientProvider>
	);
}

const domNode = document.getElementById("app");
if (domNode) {
	const root = createRoot(domNode);
	root.render(<App />);
}