import { useSelector } from "react-redux";
import { SyncPerformanceTable } from "../components/SyncPerformanceTable";
import { secondsToHms } from "../../helpers/converters";
import {
	SyncStage,
	selectSnapshotDownloadStatusesForNode,
	selectSnapshotIndexStatusesForNode,
	selectSyncStagesForNode
} from "../store/syncStagesSlice";

export const PerformancePage = () => {
	const snapDownloadStatus = useSelector(selectSnapshotDownloadStatusesForNode);
	const snapIndexStatus = useSelector(selectSnapshotIndexStatusesForNode);
	const syncStage = useSelector(selectSyncStagesForNode);

	const totalTime = () => {
		let stage = getCurrentStage();

		if (stage?.name === undefined) {
			return "0s";
		}

		let ttime = 0;
		snapDownloadStatus.totalTime.forEach((time) => {
			ttime += time;
		});

		snapIndexStatus.totalTime.forEach((time) => {
			ttime += time;
		});
		return secondsToHms(ttime);
	};

	const getCurrentStage = (): SyncStage => {
		let csi = 0;
		if (syncStage.currentStage > 0 && syncStage.currentStage < syncStage.stages.length) {
			csi = syncStage.currentStage - 1;
		}
		return syncStage.stages[csi];
	};

	return (
		<div>
			<div>{"Total sync time: " + totalTime()}</div>
			<SyncPerformanceTable />
		</div>
	);
};
