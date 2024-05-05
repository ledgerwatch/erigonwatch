import { NetworkSpeed } from "../app/store/systemInfoSlice";
import { IssueType, addOrUpdateIssue } from "../app/store/issuesSlice";
import { store } from "../app/store/store";
import { SnapshotDownloadStatus } from "../app/store/syncStagesSlice";
import { Flag } from "./../entities";

const getNodeId = (): string => {
	return store.getState().app.activeNodeId;
};

const getCurrentSnapshotDownloadStatus = (): SnapshotDownloadStatus | undefined => {
	let nodeId = getNodeId();

	for (let snapshotStatus of store.getState().syncStages.snapshotDownloadStatus) {
		if (snapshotStatus.nodeId === nodeId) {
			return snapshotStatus.downloadStatus;
		}
	}

	return undefined;
};

const getNetworkSpeed = (): NetworkSpeed => {
	let nodeId = getNodeId();

	let ds = {
        latency: -1,
        downloadSpeed: -1,
        uploadSpeed: -1  
    }

	store.getState().sysInfo.networkSpeed.forEach((nodeSpeed) => {
		if (nodeSpeed.nodeId === nodeId) {
			ds = nodeSpeed.networkSpeed;
		}
	});

    return ds;
};

const getNodeFlags = (): Flag[] => {
	let nodeId = getNodeId();

	for (let nodeIssue of store.getState().app.flags) {
		if (nodeIssue.nodeId === nodeId) {
			return nodeIssue.flags;
		}
	}

	return [];
}

const getDownloaderLimitSpeed = (): number => {
	let nodeFlags = getNodeFlags();
	let flagVal: string = "";

	for (let flag of nodeFlags) {
		if (flag.flag === "torrent.download.rate") {
			flagVal = flag.value as string;
		}
	}

	let sub: string = flagVal.substring(0, flagVal.length - 2);
	
	return parseFloat(sub);
}

function bytesToMb(bytes: number): number {
	return bytes / 1024 / 1024; // 1 MB = 1024 * 1024 bytes
}

function speedNumberToString(speed: number): string {
	return speed.toFixed(2) + "mb";
}

export const checkForNetworkSpeedIssue = () => {
    const tolerance = 0.3;
	const dr = getCurrentSnapshotDownloadStatus()?.downloadRate || 0;
	const downloadSpeed = bytesToMb(dr);
	const networkSpeed = getNetworkSpeed().downloadSpeed;
	const downloadSpeedLimit = getDownloaderLimitSpeed();

	if (networkSpeed === -1) {
		return;
	}

	let msg = "";

	if((downloadSpeed + tolerance) < downloadSpeedLimit) { // Download speed less than speed limit
		if((downloadSpeed + tolerance) < networkSpeed) {
			msg = "Download speed (" + speedNumberToString(downloadSpeed) + ") is less than actual network speed (" + speedNumberToString(networkSpeed) + ") and speed limit (" + speedNumberToString(downloadSpeedLimit) + ") flag value, maybe an issue with peers";
		} else {
			msg = "Download speed (" + speedNumberToString(downloadSpeed) + ") has reached network speed (" + speedNumberToString(networkSpeed) + ").";
		}
	} else {
		msg = "Download speed (" + speedNumberToString(downloadSpeed) + ") has reached the speed limit (" + speedNumberToString(downloadSpeedLimit) + ") flag value. Speed can be increased by increasing the limit flag.";
	}

	if(msg !== "") {
		store.dispatch(
            addOrUpdateIssue({
                issue: { type: IssueType.NetworkSpeedIssue, message: msg, id: "networkSpeed", timestamp: Date.now() },
                nodeId: getNodeId()
            })
        );	
	}
};