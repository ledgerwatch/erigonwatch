import { PayloadAction, createSelector, createSlice } from "@reduxjs/toolkit";
import { RootState } from "./store";
import { selectActiveNodeId } from "./appSlice";

const initialState: SystemInfoState = {
	networkSpeed: []
};

export interface SystemInfoState {
	networkSpeed: NodeNetworkSpeed[];
}

export interface NodeNetworkSpeed {
	nodeId: string;
	networkSpeed: NetworkSpeed;
}

export interface NetworkSpeed {
	latency: number;
	downloadSpeed: number;
	uploadSpeed: number;
}

export const systemInfoSlice = createSlice({
	name: "systemInfo",
	initialState,
	reducers: {
		addOrUpdateNetworkSpeed: (state, action: PayloadAction<{ networkSpeed: NetworkSpeed; nodeId: string }>) => {
			let nodeIdx = state.networkSpeed.findIndex((issue) => issue.nodeId === action.payload.nodeId);
			if (nodeIdx !== -1) {
				state.networkSpeed[nodeIdx].networkSpeed = action.payload.networkSpeed;
			} else {
				state.networkSpeed.push({ nodeId: action.payload.nodeId, networkSpeed: action.payload.networkSpeed });
			}
		},
		resetSystemInfoState: () => initialState
	}
});

export const { addOrUpdateNetworkSpeed } = systemInfoSlice.actions;

export const selectNodesNetworkSpeed = (state: RootState): NodeNetworkSpeed[] => state.sysInfo.networkSpeed;
export const selectNetworkSpeedForActiveNode = createSelector(
	[selectNodesNetworkSpeed, selectActiveNodeId],
	(nodeIssues, activeNodeId): NetworkSpeed => {
		let result: NetworkSpeed = {} as NetworkSpeed;
		nodeIssues.forEach((issue) => {
			if (issue.nodeId === activeNodeId) {
				result = issue.networkSpeed;
			}
		});
		return result;
	}
);

export default systemInfoSlice.reducer;
