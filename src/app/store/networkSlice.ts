import { createSelector, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";
import { selectActiveNodeId } from "./appSlice";
import { Time } from "../../helpers/time";

export interface NodeBootnode {
	nodeId: string;
	bootnodes: string[];
}

export interface NodePeers {
	nodeId: string;
	peers: Peer[];
}

export interface Peer {
	enr: string;
	enode: string;
	id: string;
	name: string;
	caps: string[];
	network: Network;
	protocols: any;
	active: boolean;
	type: string;
	lastUpdateTime: number;
}

export interface Network {
	localAddress: string;
	remoteAddress: string;
	inbound: boolean;
	trusted: boolean;
	static: boolean;
	bootnode: boolean;
	bytesIn: number;
	bytesOut: number;
	sCountedBytesIn: number;
	sCountedBytesOut: number;
	inRate: number;
	outRate: number;
	capBytesIn: any;
	capBytesOut: any;
	typeBytesIn: any;
	typeBytesOut: any;
}

export interface PeersStatistics {
	activePeers: number;
	totalPeers: number;
	staticPeers: number;
	totalErrors: number;
	totalInBytes: number;
	totalOutBytes: number;
	totalInRate: number;
	totalOutRate: number;
}

export interface NetworkState {
	peers: NodePeers[];
	bootnodes: NodeBootnode[];
}

const initialState: NetworkState = {
	peers: [],
	bootnodes: []
};

export const networkSlice = createSlice({
	name: "network",
	initialState,
	reducers: {
		updatePeersState: (state, action: PayloadAction<{ activeNodeId: string; countInterval: number }>) => {
			const nodeIdx = state.peers.findIndex((peer) => peer.nodeId === action.payload.activeNodeId);
			if (nodeIdx !== -1) {
				state.peers[nodeIdx].peers.forEach((peer) => {
					if (peer.lastUpdateTime < Date.now() - 30 * Time.second) {
						peer.active = false;
						peer.network.inRate = 0;
						peer.network.outRate = 0;
						peer.network.sCountedBytesIn = peer.network.bytesIn;
						peer.network.sCountedBytesOut = peer.network.bytesOut;
					} else {
						let bytesInTransferedInLast30Seconds = peer.network.bytesIn - peer.network.sCountedBytesIn;
						let bytesOutTransferedInLast30Seconds = peer.network.bytesOut - peer.network.sCountedBytesOut;

						let inRate = 0;
						if (bytesInTransferedInLast30Seconds > 0) {
							inRate = bytesInTransferedInLast30Seconds / action.payload.countInterval;
						}

						let outRate = 0;
						if (bytesOutTransferedInLast30Seconds > 0) {
							outRate = bytesOutTransferedInLast30Seconds / action.payload.countInterval;
						}

						let newCalcBytesIn = peer.network.bytesIn;
						let newCalcBytesOut = peer.network.bytesOut;

						peer.network.inRate = inRate * 8;
						peer.network.outRate = outRate * 8;
						peer.network.sCountedBytesIn = newCalcBytesIn;
						peer.network.sCountedBytesOut = newCalcBytesOut;
					}
				});
			}
		},
		addOrUpdatePeer: (state, action: PayloadAction<{ peer: Peer; nodeId: string }>) => {
			const activeNodeId = action.payload.nodeId;
			let peerToAdd = action.payload.peer;
			peerToAdd.lastUpdateTime = Date.now();

			let nodeIdx = state.peers.findIndex((peer) => peer.nodeId === activeNodeId);
			if (nodeIdx !== -1) {
				let peerIdx = state.peers[nodeIdx].peers.findIndex((peer) => peer.id === peerToAdd.id);
				if (peerIdx !== -1) {
					peerToAdd.network.inRate = state.peers[nodeIdx].peers[peerIdx].network.inRate;
					peerToAdd.network.outRate = state.peers[nodeIdx].peers[peerIdx].network.outRate;
					peerToAdd.network.sCountedBytesIn = state.peers[nodeIdx].peers[peerIdx].network.sCountedBytesIn;
					peerToAdd.network.sCountedBytesOut = state.peers[nodeIdx].peers[peerIdx].network.sCountedBytesOut;
					peerToAdd.network.bytesIn += state.peers[nodeIdx].peers[peerIdx].network.bytesIn;
					peerToAdd.network.bytesOut += state.peers[nodeIdx].peers[peerIdx].network.bytesOut;

					mergeObjValue(state.peers[nodeIdx].peers[peerIdx].network, peerToAdd.network, "capBytesIn");
					mergeObjValue(state.peers[nodeIdx].peers[peerIdx].network, peerToAdd.network, "capBytesOut");
					mergeObjValue(state.peers[nodeIdx].peers[peerIdx].network, peerToAdd.network, "typeBytesIn");
					mergeObjValue(state.peers[nodeIdx].peers[peerIdx].network, peerToAdd.network, "typeBytesOut");

					state.peers[nodeIdx].peers[peerIdx] = peerToAdd;
				} else {
					state.peers[nodeIdx].peers.push(peerToAdd);
				}
			} else {
				state.peers.push({ nodeId: activeNodeId, peers: [peerToAdd] });
			}
		},
		addOrUpdateBootnodes: (state, action: PayloadAction<NodeBootnode>) => {
			let nodeIdx = state.bootnodes.findIndex((bootnode) => bootnode.nodeId === action.payload.nodeId);
			if (nodeIdx !== -1) {
				state.bootnodes[nodeIdx] = action.payload;
			} else {
				state.bootnodes.push(action.payload);
			}
		},
		resetNetworkStateToMockState: () => initialState
	}
});

const mergeObjValue = (existingObject: any, newObject: any, valueKey: string): void => {
	let obj = existingObject[valueKey];
	let keys = Object.keys(obj);

	if (keys.length > 0) {
		keys.forEach((key) => {
			let val = 0;
			if (typeof obj[key] === "number") {
				let existingVal = existingObject[valueKey][key] || 0;
				val = newObject[valueKey][key] || 0;

				newObject[valueKey][key] = val + existingVal;
			}
		});
	}
};

export const { resetNetworkStateToMockState, addOrUpdatePeer, addOrUpdateBootnodes, updatePeersState } = networkSlice.actions;

export const selectPeers = (state: RootState): NodePeers[] => state.network.peers;
export const selectBootnodes = (state: RootState): NodeBootnode[] => state.network.bootnodes;

export const selectPeersForActiveNode = createSelector([selectPeers, selectActiveNodeId], (peers, activeNodeId): Peer[] => {
	let result: Peer[] = [];
	peers.forEach((peer) => {
		if (peer.nodeId === activeNodeId) {
			result = peer.peers;
		}
	});
	return result;
});

export const makeSelectItemById = () =>
	createSelector([selectPeersForActiveNode, (_, peerId: string) => peerId], (peers, peerId) => {
		let result: Peer = {} as Peer;
		peers.forEach((p) => {
			if (p.id === peerId) {
				result = p;
			}
		});
		return result;
	});

export const selectSentryPeersForNode = createSelector([selectPeersForActiveNode, selectActiveNodeId], (peers, activeNodeId): Peer[] => {
	return selectPeersByType(activeNodeId, "Sentry", peers);
});

export const selectSentinelPeersForNode = createSelector([selectPeersForActiveNode, selectActiveNodeId], (peers, activeNodeId): Peer[] => {
	return selectPeersByType(activeNodeId, "Sentinel", peers);
});

const selectPeersByType = (activeNodeId: string, type: string, peers: Peer[]): Peer[] => {
	let result: Peer[] = [];
	peers.forEach((p) => {
		if (p.type.toLowerCase() === type.toLowerCase()) {
			result.push(p);
		}
	});

	return result;
};

export const selectSentryActivePeersForNode = createSelector([selectSentryPeersForNode], (peers): Peer[] => {
	return selectActivePeers(peers);
});

export const selectSentinelActivePeersForNode = createSelector([selectSentinelPeersForNode], (peers): Peer[] => {
	return selectActivePeers(peers);
});

const selectActivePeers = (peers: Peer[]): Peer[] => {
	let result: Peer[] = [];
	peers.forEach((peer) => {
		if (peer.active) {
			result.push(peer);
		}
	});
	return result;
};

export const selectSentryStaticPeersForNode = createSelector([selectSentryPeersForNode], (peers): Peer[] => {
	return selectStaticPeers(peers);
});

export const selectSentinelStaticPeersForNode = createSelector([selectSentinelPeersForNode], (peers): Peer[] => {
	return selectStaticPeers(peers);
});

const selectStaticPeers = (peers: Peer[]): Peer[] => {
	let result: Peer[] = [];
	peers.forEach((peer) => {
		if (peer.network.static) {
			result.push(peer);
		}
	});
	return result;
};

export const selectSentryPeersStatistics = createSelector([selectSentryPeersForNode], (peers): PeersStatistics => {
	return selectPeersStatistics(peers);
});

export const selectSentinelPeersStatistics = createSelector([selectSentinelPeersForNode], (peers): PeersStatistics => {
	return selectPeersStatistics(peers);
});

const selectPeersStatistics = (peers: Peer[]): PeersStatistics => {
	let result: PeersStatistics = {
		activePeers: 0,
		totalPeers: peers.length,
		staticPeers: 0,
		totalErrors: 0,
		totalInBytes: 0,
		totalOutBytes: 0,
		totalInRate: 0,
		totalOutRate: 0
	};

	peers.forEach((peer) => {
		result.totalInBytes += peer.network.bytesIn;
		result.totalOutBytes += peer.network.bytesOut;
		result.totalInRate += peer.network.inRate;
		result.totalOutRate += peer.network.outRate;

		if (peer.active) {
			result.activePeers++;
		}

		if (peer.network.static) {
			result.staticPeers++;
		}
	});

	return result;
};

export default networkSlice.reducer;
