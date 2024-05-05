import { Issue, IssueType, addOrUpdateIssue, removeIssueWithId } from "../app/store/issuesSlice";
import { store } from "../app/store/store";
import { SnapshotDownloadStatus } from "../app/store/syncStagesSlice";

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

const getCurrentSnapshotFileList = (): string[] => {
	let nodeId = getNodeId();

	for (let snapshotFileList of store.getState().syncStages.snapshotFilesList) {
		if (snapshotFileList.nodeId === nodeId) {
			return snapshotFileList.files;
		}
	}

	return [];
};

const getCurrentIssuesList = (): Issue[] => {
	let nodeId = getNodeId();

	for (let nodeIssue of store.getState().issues.issues) {
		if (nodeIssue.nodeId === nodeId) {
			return nodeIssue.issues;
		}
	}

	return [];
};

export const checkForNoPeersForSnapshotSegment = () => {
	const dStatus = getCurrentSnapshotDownloadStatus();
	const fileList = getCurrentSnapshotFileList();
	if (dStatus) {
		if (dStatus.segments.length != fileList.length) {
			if (dStatus.segments.length < fileList.length) {
				let missingFiles = getListOfMissingFiles(fileList, dStatus);

				//remove solved issues
				let existingIssues = getCurrentIssuesList();
				let copyOfExistingIssues = [...existingIssues];

				existingIssues.forEach((issue) => {
					store.dispatch(removeIssueWithId({ nodeId: getNodeId(), issueId: issue.id }));
				});

				missingFiles.forEach((missingFile) => {
					let eIss = getExisstingIssueWithId(copyOfExistingIssues, missingFile);

					if (eIss !== undefined) {
						let timeDiff = Date.now() - eIss.timestamp;
						let timeString = new Date(timeDiff).toISOString().substr(11, 8);
						let msg = "No peers for segment: " + missingFile + " for " + timeString;

						store.dispatch(
							addOrUpdateIssue({
								issue: { type: IssueType.SnapshotSegmentMissingPeers, message: msg, id: missingFile, timestamp: eIss.timestamp },
								nodeId: getNodeId()
							})
						);
					} else {
						store.dispatch(
							addOrUpdateIssue({
								issue: {
									type: IssueType.SnapshotSegmentMissingPeers,
									message: "No peers for segment: " + missingFile,
									id: missingFile,
									timestamp: Date.now() - 20000
								},
								nodeId: getNodeId()
							})
						);
					}
				});
			} else {
				console.log("Error, more segments than files");
			}
		} else {
			//Everytning ok
		}
	}
};

const getListOfMissingFiles = (allFileList: string[], snapshotDownloadStatus: SnapshotDownloadStatus): string[] => {
	let missingFiles: string[] = [];
	allFileList.forEach((file) => {
		let found = false;
		for (let segment of snapshotDownloadStatus.segments) {
			if (segment.name === file) {
				found = true;
				break;
			}
		}

		if (!found) {
			missingFiles.push(file);
		}
	});

	return missingFiles;
};

const getExisstingIssueWithId = (existingIssues: Issue[], issueId: string): Issue | undefined => {
	let issue = existingIssues.find((issue) => issue.id === issueId);

	return issue;
};
