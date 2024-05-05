import { PayloadAction, createSelector, createSlice } from "@reduxjs/toolkit";
import { RootState } from "./store";
import { selectActiveNodeId } from "./appSlice";

export interface NodeHeaders {
	nodeId: string;
	headers: Headers;
}

export interface Headers {
	canonicalMarker: HeaderCanonicalMarker;
	waitingForHeaders: number;
	processed: HeaderProcessed;
	write: HeaderWrite;
}

export interface HeaderCanonicalMarker {
	ancestorHash: string;
	ancestorHeight: number;
}

export interface HeaderProcessed {
	age: number;
	blkPerSec: number;
	headers: number;
	highest: number;
	in: number;
}

export interface HeaderWrite {
	alloc: number;
	blockNumber: number;
	invalidHeaders: number;
	previousBlockNumber: number;
	rejectedBadHeaders: number;
	speed: number;
	sys: number;
}

export interface HeadersState {
	nodeHeaders: NodeHeaders[];
}

const initialState: HeadersState = {
	nodeHeaders: []
};

export const headersSlice = createSlice({
	name: "headers",
	initialState,
	reducers: {
		addOrUpdateHeaders: (state, action: PayloadAction<{ headers: Headers; nodeId: string }>) => {
			let nodeIdx = state.nodeHeaders.findIndex((nodeHeader) => nodeHeader.nodeId === action.payload.nodeId);
			if (nodeIdx !== -1) {
				state.nodeHeaders[nodeIdx].headers = action.payload.headers;
			} else {
				state.nodeHeaders.push({ nodeId: action.payload.nodeId, headers: action.payload.headers });
			}
		},
		resetHeadersState: () => initialState
	}
});

export const { addOrUpdateHeaders, resetHeadersState } = headersSlice.actions;

export const selectHeaders = (state: RootState): NodeHeaders[] => state.headers.nodeHeaders;
export const selectHeadersForActiveNode = createSelector([selectHeaders, selectActiveNodeId], (headers, activeNodeId) =>
	headers.find((header) => header.nodeId === activeNodeId)
);

export default headersSlice.reducer;
