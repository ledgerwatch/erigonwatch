import { createSelector, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";
import { selectActiveNodeId } from "./appSlice";

export interface NodeSnapshotDownloadStatus {
	nodeId: string;
	downloadStatus: SnapshotDownloadStatus;
}

export interface SnapshotDownloadStatus {
	downloaded: number;
	total: number;
	totalTime: number[];
	downloadRate: number;
	uploadRate: number;
	peers: number;
	files: number;
	connections: number;
	alloc: number;
	sys: number;
	downloadFinished: boolean;
	indexingFinished: boolean;
	segments: SnapshotSegmentDownloadStatus[];
	indexed: number;
	torrentMetadataReady: number;
}

export interface SnapshotSegmentDownloadStatus {
	name: string;
	totalBytes: number;
	downloadedBytes: number;
	webseeds: SegmentPeer[];
	peers: SegmentPeer[];
	indexed: number;
	downloadedStats: DownloadedStats | null;
}

export interface DownloadedStats {
	timeTook: number;
	averageRate: number;
}

export interface SegmentPeer {
	url: string;
	downloadRate: number;
}

export interface NodeSnapshotIndexStatus {
	nodeId: string;
	indexStatus: SnapshotIndexingStatus;
}

export interface SnapshotIndexingStatus {
	totalTime: number[];
	segments: SnapshotSegmentIndexStatus[];
	progress: number;
	alloc: number;
	sys: number;
}

export interface SnapshotSegmentIndexStatus {
	name: string;
	progress: number;
}

export interface NodeSyncStage {
	nodeId: string;
	stages: SyncStages;
}

export interface SyncStages {
	stages: SyncStage[];
	currentStage: number;
}

export interface SyncStage {
	name: string;
	subStage: boolean;
}

export interface NodeSnapshotFileList {
	nodeId: string;
	files: string[];
}

export interface NodeBlockExecution {
	nodeId: string;
	files: BlockExecution[];
}

export interface BlockExecution {
	from: number;
	to: number;
	blockNumber: number;
	blkPerSec: number;
	txPerSec: number;
	mgasPerSec: number;
	gasState: number;
	batch: number;
	alloc: number;
	sys: number;
	timeElapsed: number;
}

export interface SyncStagesState {
	snapshotFilesList: NodeSnapshotFileList[];
	snapshotDownloadStatus: NodeSnapshotDownloadStatus[];
	snapshotIndexStatus: NodeSnapshotIndexStatus[];
	syncStages: NodeSyncStage[];
	testSnpSyncMsgIdx: number;
}

const initialState: SyncStagesState = {
	snapshotFilesList: [],
	snapshotDownloadStatus: [],
	snapshotIndexStatus: [],
	syncStages: [],
	//testSnpSyncMsgIdx: 439
	testSnpSyncMsgIdx: 0
};

export const syncStagesSlice = createSlice({
	name: "syncStages",
	initialState,
	reducers: {
		setSnapshotFilesList: (state, action: PayloadAction<NodeSnapshotFileList>) => {
			let nodeIdx = state.snapshotFilesList.findIndex((fileList) => fileList.nodeId === action.payload.nodeId);
			if (nodeIdx !== -1) {
				state.snapshotFilesList[nodeIdx].files = action.payload.files;
			} else {
				state.snapshotFilesList.push(action.payload);
			}
		},
		setSnapshotDownloadStatus: (state, action: PayloadAction<NodeSnapshotDownloadStatus>) => {
			let nodeIdx = state.snapshotDownloadStatus.findIndex((downloadStatus) => downloadStatus.nodeId === action.payload.nodeId);
			if (nodeIdx !== -1) {
				state.snapshotDownloadStatus[nodeIdx].downloadStatus = action.payload.downloadStatus;
			} else {
				state.snapshotDownloadStatus.push(action.payload);
			}
		},
		setSnapshotIndexStatus: (state, action: PayloadAction<NodeSnapshotIndexStatus>) => {
			let nodeIdx = state.snapshotIndexStatus.findIndex((indexStatus) => indexStatus.nodeId === action.payload.nodeId);
			if (nodeIdx !== -1) {
				state.snapshotIndexStatus[nodeIdx].indexStatus = action.payload.indexStatus;
			} else {
				state.snapshotIndexStatus.push(action.payload);
			}
		},
		setNodeSyncStages: (state, action: PayloadAction<NodeSyncStage>) => {
			let nodeIdx = state.syncStages.findIndex((syncStage) => syncStage.nodeId === action.payload.nodeId);
			if (nodeIdx !== -1) {
				state.syncStages[nodeIdx] = action.payload;
			} else {
				state.syncStages.push(action.payload);
			}
		},
		setTestSnpSyncMsgIdx: (state, action: PayloadAction<number>) => {
			state.testSnpSyncMsgIdx = action.payload;
		},
		resetSyncStagesState: () => initialState
	}
});

export const {
	setSnapshotFilesList,
	resetSyncStagesState,
	setSnapshotDownloadStatus,
	setSnapshotIndexStatus,
	setNodeSyncStages,
	setTestSnpSyncMsgIdx
} = syncStagesSlice.actions;

export const selectSnapshotDownloadStatus = (state: RootState): NodeSnapshotDownloadStatus[] => state.syncStages.snapshotDownloadStatus;
export const selectSnapshotDownloadStatusesForNode = createSelector(
	[selectSnapshotDownloadStatus, selectActiveNodeId],
	(downloadStatus, activeNodeId): SnapshotDownloadStatus => {
		let result: SnapshotDownloadStatus = {} as SnapshotDownloadStatus;
		downloadStatus.forEach((status) => {
			if (status.nodeId === activeNodeId) {
				result = status.downloadStatus;
			}
		});

		return result;
	}
);

export const selectSnapshotIndexStatus = (state: RootState): NodeSnapshotIndexStatus[] => state.syncStages.snapshotIndexStatus;
export const selectSnapshotIndexStatusesForNode = createSelector(
	[selectSnapshotIndexStatus, selectActiveNodeId],
	(indexStatus, activeNodeId): SnapshotIndexingStatus => {
		let result: SnapshotIndexingStatus = {} as SnapshotIndexingStatus;
		indexStatus.forEach((status) => {
			if (status.nodeId === activeNodeId) {
				result = status.indexStatus;
			}
		});

		return result;
	}
);
export const selectSyncStages = (state: RootState): NodeSyncStage[] => state.syncStages.syncStages;
export const selectSyncStagesForNode = createSelector([selectSyncStages, selectActiveNodeId], (syncStages, activeNodeId): SyncStages => {
	let result: SyncStages = {
		stages: [],
		currentStage: 0
	} as SyncStages;
	syncStages.forEach((stage) => {
		if (stage.nodeId === activeNodeId) {
			result = stage.stages;
		}
	});

	return result;
});

export const selectSnapshotFileList = (state: RootState): NodeSnapshotFileList[] => state.syncStages.snapshotFilesList;
export const selectSnapshotFileListForActiveNode = createSelector(
	[selectSnapshotFileList, selectActiveNodeId],
	(snapshotFileList, activeNodeId): string[] => {
		let result: string[] = [];
		snapshotFileList.forEach((list) => {
			if (list.nodeId === activeNodeId) {
				result = list.files;
			}
		});
		return result;
	}
);

export const selectShouldFetchSnapshotFilesListForActiveNode = createSelector([selectSnapshotFileListForActiveNode], (snapshotFileList): boolean => {
	if (snapshotFileList?.length === 0) {
		return true;
	} else {
		return false;
	}
});

export default syncStagesSlice.reducer;
