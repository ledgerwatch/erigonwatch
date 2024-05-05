import { createSelector, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { Flag, NodeInfo, Version } from "../../entities";
import { RootState } from "./store";

export interface NodeForList {
	active: boolean;
	name: string;
	id: string;
	version: string;
	chain: string;
	block: number;
	address: string;
}

export interface Session {
	pin: string;
	name: string;
	is_active: boolean;
	nodes: NodeInfo[];
}

export interface SessionForList {
	pin: string;
	name: string;
	active: boolean;
}

export interface NodeVersion {
	nodeId: string;
	version: Version;
}

export interface NodeFlags {
	nodeId: string;
	flags: Flag[];
}

export interface CmdLineArgs {
	nodeId: string;
	args: string;
}

export interface NodeLogs {
	nodeId: string;
	logFiles: LogFile[];
}

export interface LogFile {
	url: string;
	size: number;
	name: string;
	selected: boolean;
}

export interface KeyValue {
	key: string;
	value: string;
}

export interface SyncStages {
	nodeId: string;
	syncStages: KeyValue[];
}

export interface DataBases {
	nodeId: string;
	dbs: DataBase[];
}

export interface DataBase {
	path: string;
	tables: DataBaseTable[];
	keysCount: number;
	size: number;
}

export interface DataBaseTablePayload {
	nodeId: string;
	path: string;
	tables: DataBaseTable[];
	keysCount: number;
	size: number;
}

export interface DataBaseTable {
	name: string;
	count: number;
	size: number;
}

export interface Reorg {
	nodeId: string;
	totalBlocks: number;
	wrongBlocks: number[];
	timeTook: string;
}

export interface AppState {
	sessions: Session[];
	activeSession: Session | null;
	activeSessionPin: string;
	activeNodeId: string;
	nodeVersions: NodeVersion[];
	flags: NodeFlags[];
	cmdLineArgs: CmdLineArgs[];
	nodeLogs: NodeLogs[];
	syncStages: SyncStages[];
	dbs: DataBases[];
	reorgs: Reorg[];
}

const initialState: AppState = {
	sessions: import.meta.env.VITE_SERVER_RESPONSE_TYPE === "MOCK" ? [{ pin: "1234", name: "Test session", is_active: true, nodes: [] }] : [],
	activeSession: null,
	activeSessionPin: import.meta.env.VITE_SERVER_RESPONSE_TYPE === "MOCK" ? "1234" : "",
	activeNodeId: "",
	nodeVersions: [],
	flags: [],
	cmdLineArgs: [],
	nodeLogs: [],
	syncStages: [],
	dbs: [],
	reorgs: []
};

export const appSlice = createSlice({
	name: "app",
	initialState,
	reducers: {
		addOrUpdateSession: (state, action: PayloadAction<Session>) => {
			let sessionIdx = state.sessions.findIndex((session) => session.pin === action.payload.pin);
			if (sessionIdx !== -1) {
				state.sessions[sessionIdx] = action.payload;
			} else {
				state.sessions.push(action.payload);
			}

			state.activeSessionPin = action.payload.pin;
		},
		updateNodesInfoInCurrentSession: (state, action: PayloadAction<NodeInfo[]>) => {
			let sessionIdx = state.sessions.findIndex((session) => session.pin === state.activeSessionPin);
			if (sessionIdx !== -1) {
				state.sessions[sessionIdx].nodes = action.payload;

				if (action.payload.length > 0) {
					state.activeNodeId = action.payload[0].id;
				}
			}
		},
		setActiveSessionPin: (state, action: PayloadAction<string>) => {
			state.activeSessionPin = action.payload;
			state.activeNodeId = "";
		},
		setActiveNodeId: (state, action: PayloadAction<string>) => {
			state.activeNodeId = action.payload;
		},
		addOrUpdateNodeVersion: (state, action: PayloadAction<NodeVersion>) => {
			let nodeIdx = state.nodeVersions.findIndex((node) => node.nodeId === action.payload.nodeId);
			if (nodeIdx !== -1) {
				state.nodeVersions[nodeIdx] = action.payload;
			} else {
				state.nodeVersions.push(action.payload);
			}
		},
		addOrUpdateNodeFlags: (state, action: PayloadAction<NodeFlags>) => {
			let nodeIdx = state.flags.findIndex((node) => node.nodeId === action.payload.nodeId);
			if (nodeIdx !== -1) {
				state.flags[nodeIdx] = action.payload;
			} else {
				state.flags.push(action.payload);
			}
		},
		addOrUpdateCmdLineArgs: (state, action: PayloadAction<CmdLineArgs>) => {
			let nodeIdx = state.cmdLineArgs.findIndex((node) => node.nodeId === action.payload.nodeId);
			if (nodeIdx !== -1) {
				state.cmdLineArgs[nodeIdx] = action.payload;
			} else {
				state.cmdLineArgs.push(action.payload);
			}
		},
		addOrUpdateNodeLogs: (state, action: PayloadAction<NodeLogs>) => {
			let nodeIdx = state.nodeLogs.findIndex((log) => log.nodeId === state.activeNodeId);
			if (nodeIdx !== -1) {
				state.nodeLogs[nodeIdx] = action.payload;
			} else {
				state.nodeLogs.push(action.payload);
			}
		},
		addOrUpdateSyncStages: (state, action: PayloadAction<SyncStages>) => {
			let nodeIdx = state.syncStages.findIndex((node) => node.nodeId === action.payload.nodeId);
			if (nodeIdx !== -1) {
				state.syncStages[nodeIdx] = action.payload;
			} else {
				state.syncStages.push(action.payload);
			}
		},
		setLogWithNameSelected: (state, action: PayloadAction<string>) => {
			let nodeIdx = state.nodeLogs.findIndex((log) => log.nodeId === state.activeNodeId);
			if (nodeIdx !== -1) {
				state.nodeLogs[nodeIdx].logFiles.forEach((logFile) => {
					logFile.selected = false;
				});

				let logIdx = state.nodeLogs[nodeIdx].logFiles.findIndex((logFile) => logFile.name === action.payload);
				if (logIdx !== -1) {
					state.nodeLogs[nodeIdx].logFiles[logIdx].selected = true;
				}
			}
		},
		addOrUpdateDBs: (state, action: PayloadAction<DataBases>) => {
			let nodeIdx = state.dbs.findIndex((node) => node.nodeId === action.payload.nodeId);
			if (nodeIdx !== -1) {
				state.dbs[nodeIdx] = action.payload;
			} else {
				state.dbs.push(action.payload);
			}
		},
		addOrUpdateDBTable: (state, action: PayloadAction<DataBaseTablePayload>) => {
			let nodeIdx = state.dbs.findIndex((node) => node.nodeId === action.payload.nodeId);
			if (nodeIdx !== -1) {
				let dbIdx = state.dbs[nodeIdx].dbs.findIndex((db) => db.path === action.payload.path);
				if (dbIdx !== -1) {
					state.dbs[nodeIdx].dbs[dbIdx].tables = action.payload.tables;
					state.dbs[nodeIdx].dbs[dbIdx].keysCount = action.payload.keysCount;
					state.dbs[nodeIdx].dbs[dbIdx].size = action.payload.size;
				} else {
					state.dbs[nodeIdx].dbs.push({
						path: action.payload.path,
						tables: action.payload.tables,
						keysCount: action.payload.keysCount,
						size: action.payload.size
					});
				}
			}
		},
		addOrUpdateReorg: (state, action: PayloadAction<Reorg>) => {
			let nodeIdx = state.reorgs.findIndex((reorg) => reorg.nodeId === action.payload.nodeId);
			if (nodeIdx !== -1) {
				state.reorgs[nodeIdx] = action.payload;
			} else {
				state.reorgs.push(action.payload);
			}
		},
		resetAppStateToMockState: (state) => {
			state.sessions =
				import.meta.env.VITE_SERVER_RESPONSE_TYPE === "MOCK" ? [{ pin: "1234", name: "Test session", is_active: true, nodes: [] }] : [];
			state.activeSession = null;
			state.activeSessionPin = import.meta.env.VITE_SERVER_RESPONSE_TYPE === "MOCK" ? "1234" : "";
			state.activeNodeId = "";
			state.nodeVersions = [];
			state.flags = [];
			state.cmdLineArgs = [];
			state.nodeLogs = [];
			state.syncStages = [];
			state.dbs = [];
			state.reorgs = [];
		}
	}
});

export const {
	addOrUpdateSession,
	updateNodesInfoInCurrentSession,
	setActiveSessionPin,
	setActiveNodeId,
	addOrUpdateNodeVersion,
	addOrUpdateNodeFlags,
	addOrUpdateCmdLineArgs,
	addOrUpdateNodeLogs,
	addOrUpdateSyncStages,
	setLogWithNameSelected,
	addOrUpdateDBs,
	addOrUpdateDBTable,
	addOrUpdateReorg,
	resetAppStateToMockState
} = appSlice.actions;

export const selectSessions = (state: RootState): Session[] => state.app.sessions;
export const selectActiveSessionPin = (state: RootState): string => state.app.activeSessionPin;
export const selectActiveNodeId = (state: RootState): string => state.app.activeNodeId;
export const selectNodeVersions = (state: RootState): NodeVersion[] => state.app.nodeVersions;
export const selectNodeFlags = (state: RootState): NodeFlags[] => state.app.flags;
export const selectCmdLineArgs = (state: RootState): CmdLineArgs[] => state.app.cmdLineArgs;
export const selectLogFiles = (state: RootState): NodeLogs[] => state.app.nodeLogs;
export const selectSyncStages = (state: RootState): SyncStages[] => state.app.syncStages;
export const selectDBs = (state: RootState): DataBases[] => state.app.dbs;
export const selectReorgs = (state: RootState): Reorg[] => state.app.reorgs;

export const selectActiveSession = createSelector([selectSessions, selectActiveSessionPin], (sessions, activeSessionPin): Session | null => {
	let result: Session | null = null;

	if (activeSessionPin != "") {
		sessions.forEach((session) => {
			if (session.pin === activeSessionPin) {
				result = session;
			}
		});
	}

	return result;
});

export const selectNodesForActiveSession = createSelector([selectActiveSession], (activeSession): NodeInfo[] => {
	let result: NodeInfo[] = [];

	if (activeSession != null) {
		result = activeSession.nodes;
	}

	return result;
});

export const selectSessionsForList = createSelector([selectSessions, selectActiveSessionPin], (sessions, activeSessionPin): SessionForList[] => {
	let result: SessionForList[] = [];

	if (activeSessionPin != "") {
		sessions.forEach((session) => {
			result.push({
				pin: session.pin,
				name: session.name,
				active: session.pin === activeSessionPin
			});
		});
	}

	return result;
});

export const selectNodeDetails = createSelector([selectNodesForActiveSession, selectActiveNodeId], (nodes, activeNodeId): NodeInfo | undefined => {
	let result: NodeInfo | undefined = undefined;
	nodes.forEach((node) => {
		if (node.id === activeNodeId) {
			result = node;
		}
	});

	return result;
});

export const selecctActiveNode = createSelector(
	[selectNodesForActiveSession, selectActiveNodeId, selectNodeVersions],
	(nodes, activeNodeId, nodeVersions): NodeForList | null => {
		let result: NodeForList | null = null;

		nodes.forEach((node) => {
			if (node.id === activeNodeId) {
				let version = "";
				nodeVersions.forEach((nodeVersion) => {
					if (nodeVersion.nodeId === node.id) {
						version = nodeVersion.version.nodeVersion;
					}
				});

				result = {
					active: true,
					name: node.name,
					id: node.id,
					version: version,
					chain: node.protocols.eth.config.ChainName,
					block: node.protocols.eth.config.londonBlock,
					address: ""
				};
			}
		});

		return result;
	}
);

export const selectNodesForList = createSelector(
	[selectNodesForActiveSession, selectActiveNodeId, selectNodeVersions],
	(nodes, activeNodeId, nodeVersions): NodeForList[] => {
		let result: NodeForList[] = [];

		nodes.forEach((node) => {
			let version = "";
			nodeVersions.forEach((nodeVersion) => {
				if (nodeVersion.nodeId === node.id) {
					version = nodeVersion.version.nodeVersion;
				}
			});

			result.push({
				active: node.id === activeNodeId,
				name: node.name,
				id: node.id,
				version: version,
				chain: node.protocols.eth.config.ChainName,
				block: node.protocols.eth.config.londonBlock,
				address: ""
			});
		});

		return result;
	}
);

export const selectFlagsForNode = createSelector([selectNodeFlags, selectActiveNodeId], (flags, activeNodeId): Flag[] => {
	let result: Flag[] = [];
	flags.forEach((flag) => {
		if (flag.nodeId === activeNodeId) {
			result = flag.flags;
		}
	});
	return result;
});

export const selectCmdLineArgsForNode = createSelector([selectCmdLineArgs, selectActiveNodeId], (cmdLineArgs, activeNodeId): string => {
	let result: string = "";
	cmdLineArgs.forEach((args) => {
		if (args.nodeId === activeNodeId) {
			result = args.args;
		}
	});
	return result;
});

export const selectLogFilesForNode = createSelector([selectLogFiles, selectActiveNodeId], (nodeLogs, activeNodeId): LogFile[] => {
	let result: LogFile[] = [];
	nodeLogs.forEach((nodeLog) => {
		if (nodeLog.nodeId === activeNodeId) {
			result = nodeLog.logFiles;
		}
	});
	return result;
});

export const selectSyncStagesForNode = createSelector([selectSyncStages, selectActiveNodeId], (syncStages, activeNodeId): KeyValue[] => {
	let result: KeyValue[] = [];
	syncStages.forEach((syncStage) => {
		if (syncStage.nodeId === activeNodeId) {
			result = syncStage.syncStages;
		}
	});
	return result;
});

export const selectDBsForNode = createSelector([selectDBs, selectActiveNodeId], (dbs, activeNodeId): DataBase[] => {
	let result: DataBase[] = [];
	dbs.forEach((db) => {
		if (db.nodeId === activeNodeId) {
			result = db.dbs;
		}
	});
	return result;
});

export const selectReorgForNode = createSelector([selectReorgs, selectActiveNodeId], (reorgs, activeNodeId): Reorg | undefined => {
	let result: Reorg | undefined = undefined;
	reorgs.forEach((reorg) => {
		if (reorg.nodeId === activeNodeId) {
			result = reorg;
		}
	});
	return result;
});

export const makeSelectDbByName = () =>
	createSelector([selectDBsForNode, (_, name: string) => name], (dbs, name) => {
		let result: DataBase = {
			path: name,
			tables: [],
			keysCount: 0,
			size: 0
		};

		dbs.forEach((db) => {
			if (db.path === name) {
				result = db;
			}
		});

		return result;
	});

export default appSlice.reducer;
