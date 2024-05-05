import { useSelector } from "react-redux";
import { calculatePercentDownloaded, numberToPercentString, secondsToHms } from "../../helpers/converters";
import { useEffect, useState } from "react";
import {
	SyncStage,
	selectSnapshotDownloadStatusesForNode,
	selectSnapshotIndexStatusesForNode,
	selectSyncStagesForNode
} from "../store/syncStagesSlice";

enum SnapshotSyncStage {
	WaitingForMetadata,
	Downloading,
	Indexing,
	Finished
}

export const SyncPerformanceTable = () => {
	const snapDownloadStatus = useSelector(selectSnapshotDownloadStatusesForNode);
	const snapIndexStatus = useSelector(selectSnapshotIndexStatusesForNode);
	const syncStage = useSelector(selectSyncStagesForNode);

	const extendedItems = syncStage.stages.flatMap((item: SyncStage) =>
		item.subStage ? [item, { ...item, name: item.name, subStage: false }] : [item]
	);

	const [stages, setStages] = useState(SnapshotSyncStage.WaitingForMetadata);

	useEffect(() => {
		if (snapDownloadStatus.torrentMetadataReady < snapDownloadStatus.files) setStages(SnapshotSyncStage.WaitingForMetadata);
		else if (!snapDownloadStatus.downloadFinished) setStages(SnapshotSyncStage.Downloading);
		else if (snapDownloadStatus.indexed < 100) setStages(SnapshotSyncStage.Indexing);
		else setStages(SnapshotSyncStage.Finished);
	}, []);

	const stageNumber = (stage: SyncStage) => {
		let idx = findIndex(stage);
		return idx + "/" + syncStage.stages.length;
	};

	const findIndex = (stage: SyncStage) => {
		for (let i = 0; i < syncStage.stages.length; i++) {
			if (syncStage.stages[i].name === stage.name) {
				return i + 1;
			}
		}

		return 0;
	};

	const state = (stage: SyncStage) => {
		if (stage.name === "Snapshots") {
			if (stage.subStage) {
				if (snapDownloadStatus.downloadFinished) {
					return "Finished";
				} else if (snapDownloadStatus.torrentMetadataReady < snapDownloadStatus.files) {
					return "Waiting for metadata";
				} else if (!snapDownloadStatus.downloadFinished) {
					return "In progress";
				} else {
					return "Finished";
				}
			} else {
				if (!snapDownloadStatus.downloadFinished) {
					return "Waiting";
				} else if (snapIndexStatus.progress < 100) {
					return "In progress";
				} else {
					return "Finished";
				}
			}
		}

		return "Waiting";
	};

	const stageName = (stage: SyncStage) => {
		if (stage.name === "Snapshots") {
			if (stage.subStage) {
				return "Snapshots (Downloading)";
			} else {
				return "Snapshots (Indexing)";
			}
		}

		return stage.name;
	};

	const progress = (stage: SyncStage) => {
		if (stage.name === "Snapshots") {
			if (stage.subStage) {
				return calculatePercentDownloaded(snapDownloadStatus.downloaded, snapDownloadStatus.total);
			} else {
				return numberToPercentString(snapIndexStatus.progress);
			}
		} else {
			return "0%";
		}
	};

	const totalTime = (stage: SyncStage) => {
		if (stage.name === "Snapshots") {
			if (stage.subStage) {
				let ttime = 0;
				snapDownloadStatus.totalTime.forEach((time) => {
					ttime += time;
				});
				return secondsToHms(ttime);
			} else {
				let ttime = 0;
				snapIndexStatus.totalTime.forEach((time) => {
					ttime += time;
				});
				return secondsToHms(ttime);
			}
		} else {
			return "0s";
		}
	};

	return (
		<div>
			<table className="table-auto w-fit border-0 rounded-lg shadow-lg relative bg-white outline-none focus:outline-none mb-4">
				<thead>
					<tr className="border-b">
						<th className="px-4 py-2">Stage</th>
						<th className="px-4 py-2">Name</th>
						<th className="px-4 py-2">State</th>
						<th className="px-4 py-2">Progress</th>
						<th className="px-4 py-2">Total Time</th>
					</tr>
				</thead>
				<tbody>
					{extendedItems.map((stage) => {
						return (
							<tr>
								<td className="px-4 py-2">{stageNumber(stage)}</td>
								<td className="px-4 py-2">{stageName(stage)}</td>
								<td className="px-4 py-2">{state(stage)}</td>
								<td className="px-4 py-2">{progress(stage)}</td>
								<td className="px-4 py-2">{totalTime(stage)}</td>
							</tr>
						);
					})}
				</tbody>
			</table>
		</div>
	);
};
