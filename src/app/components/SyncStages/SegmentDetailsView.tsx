import { useState } from "react";
import { calculatePercentDownloaded, multipleBps, multipleBytes, secondsToHms } from "../../../helpers/converters";
import { SegmentPeer, SnapshotSegmentDownloadStatus } from "../../store/syncStagesSlice";
import { SegmentPeersDataTable } from "./SegmentPeersDataTable";

export interface SegmentDetailsViewProps {
	segment: SnapshotSegmentDownloadStatus | null;
}

export const SegmentDetailsView = ({ segment }: SegmentDetailsViewProps) => {
	const isFileDownloaded = (segment: SnapshotSegmentDownloadStatus | null): boolean => {
		if (!segment) {
			return false;
		}

		return segment.downloadedBytes >= segment.totalBytes;
	};

	const [downloaded, setDownloaded] = useState(isFileDownloaded(segment));

	const rate = (peers: SegmentPeer[]): string => {
		let downloadRate = 0;
		peers.forEach((peer) => {
			downloadRate += peer.downloadRate;
		});

		return multipleBps(downloadRate);
	};

	const peersCount = (segment: SnapshotSegmentDownloadStatus): number => {
		return segment.peers.length || 0;
	};

	const peersRate = (segment: SnapshotSegmentDownloadStatus): number => {
		let downloadRate = 0;
		segment.peers.forEach((peer) => {
			downloadRate += peer.downloadRate;
		});

		return downloadRate;
	};

	const webseedsCount = (segment: SnapshotSegmentDownloadStatus): number => {
		return segment.webseeds.length || 0;
	};

	const webseedsRate = (segment: SnapshotSegmentDownloadStatus): number => {
		let downloadRate = 0;
		segment.webseeds.forEach((webseed) => {
			downloadRate += webseed.downloadRate;
		});

		return downloadRate;
	};

	const renderDownloadedFile = (segment: SnapshotSegmentDownloadStatus) => {
		return (
			<div className="flex flex-col justify-around">
				<table className="table-fixed text-left">
					<thead>
						<tr className="border-b">
							<th>Name</th>
							<th>Size</th>
							<th>Time Taken</th>
							<th>AverageRate</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td className="px-4 py-2">{segment.name}</td>
							<td className="px-4 py-2">{multipleBytes(segment.totalBytes)}</td>
							<td className="px-4 py-2">{secondsToHms(segment.downloadedStats?.timeTook || 0)}</td>
							<td className="px-4 py-2">{multipleBps(segment.downloadedStats?.averageRate || 0)}</td>
						</tr>
					</tbody>
				</table>
			</div>
		);
	};

	const renderDownloadingFileInProgress = (segment: SnapshotSegmentDownloadStatus) => {
		return (
			<div className="flex flex-col justify-around">
				<table className="table-fixed text-left">
					<thead>
						<tr className="border-b">
							<th>Name</th>
							<th>Progress</th>
							<th>Size</th>
							<th>Peers Count</th>
							<th>Peers Rate</th>
							<th>Webseeds Count</th>
							<th>Webseeds Rate</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td className="px-4 py-2">{segment.name}</td>
							<td className="px-4 py-2">{calculatePercentDownloaded(segment.downloadedBytes, segment.totalBytes)}</td>
							<td className="px-4 py-2">{multipleBytes(segment.totalBytes)}</td>
							<td className="px-4 py-2">{peersCount(segment)}</td>
							<td className="px-4 py-2">{multipleBps(peersRate(segment))}</td>
							<td className="px-4 py-2">{webseedsCount(segment)}</td>
							<td className="px-4 py-2">{multipleBps(webseedsRate(segment))}</td>
						</tr>
					</tbody>
				</table>

				<div className="flex flex-row justify-around mt-20">
					{segment.peers.length > 0 && (
						<div className="flex flex-col">
							<div className="flex flex-col shadow-lg rounded-md p-2 bg-white min-h-[40px] max-h-[45vh] w-full overflow-auto items-center">
								<p className="font-bold text-lg">{segment.peers.length + " peers"}</p>
								<p className="font-bold text-lg">{"Total speed: " + rate(segment.peers)}</p>
								<SegmentPeersDataTable peers={segment.peers} />
							</div>
						</div>
					)}
					{segment.webseeds.length > 0 && (
						<div className="flex flex-col">
							<div className="flex flex-col shadow-lg rounded-md p-2 bg-white min-h-[40px] max-h-[40vh] w-full overflow-auto items-center">
								<p className="font-bold text-lg">{segment.webseeds.length + " webseeds"}</p>
								<p className="font-bold text-lg">{"Total speed: " + rate(segment.webseeds)}</p>
								<SegmentPeersDataTable peers={segment.webseeds} />
							</div>
						</div>
					)}
				</div>
			</div>
		);
	};

	return (
		<div className="w-full h-full">
			{segment ? downloaded ? renderDownloadedFile(segment) : renderDownloadingFileInProgress(segment) : <div></div>}
		</div>
	);
};
