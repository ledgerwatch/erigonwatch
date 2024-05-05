import { Headers } from "../app/store/headersSlice";

export const headersFromJson = (json: any): Headers => {
	return {
		canonicalMarker: {
			ancestorHash: json?.canonicalMarker?.ancestorHash || "",
			ancestorHeight: json?.canonicalMarker?.ancestorHeight || 0
		},
		waitingForHeaders: json?.waitingForHeaders || 0,
		processed: {
			age: json?.processed?.age || 0,
			blkPerSec: json?.processed?.blkPerSec || 0,
			headers: json?.processed?.headers || 0,
			highest: json?.processed?.highest || 0,
			in: json?.processed?.in || 0
		},
		write: {
			alloc: json?.writeHeaders?.alloc || 0,
			blockNumber: json?.writeHeaders?.blockNumber || 0,
			invalidHeaders: json?.writeHeaders?.invalidHeaders || 0,
			previousBlockNumber: json?.writeHeaders?.previousBlockNumber || 0,
			rejectedBadHeaders: json?.writeHeaders?.rejectedBadHeaders || 0,
			speed: json?.writeHeaders?.speed || 0,
			sys: json?.writeHeaders?.sys || 0
		}
	};
};
