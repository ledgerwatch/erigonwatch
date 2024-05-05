import { multipleBps, multipleBytes } from "../../../helpers/converters";
import { PeersStatisticsType } from "../../pages/PeerNetworkPage";
import { PeersStatistics } from "../../store/networkSlice";

export interface PeersStatisticsTableProps {
	selectedStatistics: PeersStatisticsType;
	statistics: PeersStatistics;
	onRowClicked: (type: PeersStatisticsType) => void;
}

export const PeersStatisticsTable = ({ selectedStatistics, statistics, onRowClicked }: PeersStatisticsTableProps) => {
	const getStyle = (type: PeersStatisticsType): string => {
		let style = "px-4 py-2 hover:bg-gray-100";
		const selected = "bg-gray-300";
		const notSelected = "bg-white text-black";

		if (type === PeersStatisticsType.Active || type === PeersStatisticsType.Static || type === PeersStatisticsType.Total) {
			style += " border-r";
		}

		if (type === selectedStatistics) {
			return style + " " + selected;
		} else {
			return style + " " + notSelected;
		}
	};

	return (
		<div className="flex flex-row">
			<div className="shadow-lg rounded-md bg-white overflow-auto mr-5">
				<table className="table-fixed text-center">
					<tbody>
						<tr>
							<td
								className={getStyle(PeersStatisticsType.Active)}
								onClick={() => onRowClicked(PeersStatisticsType.Active)}
							>
								<span>Active:</span>
								<br />
								<span className="font-bold">{statistics.activePeers}</span>
							</td>

							<td
								className={getStyle(PeersStatisticsType.Static)}
								onClick={() => onRowClicked(PeersStatisticsType.Static)}
							>
								<span>Static:</span>
								<br />
								<span className="font-bold">{statistics.staticPeers}</span>
							</td>

							<td
								className={getStyle(PeersStatisticsType.Total)}
								onClick={() => onRowClicked(PeersStatisticsType.Total)}
							>
								<span>Total Seen:</span>
								<br />
								<span className="font-bold">{statistics.totalPeers}</span>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
			<div className="shadow-lg rounded-md bg-white overflow-auto">
				<table className="table-fixed text-center">
					<tbody>
						<tr>
							<td className="px-4 py-2">
								<span>In Rate:</span>
								<br />
								<span className="font-bold">{multipleBps(statistics.totalInRate)}</span>
							</td>
							<td className="px-4 py-2">
								<span>Network In:</span>
								<br />
								<span className="font-bold">{multipleBytes(statistics.totalInBytes)}</span>
							</td>
							<td className="px-4 py-2">
								<span>Out Rate:</span>
								<br />
								<span className="font-bold">{multipleBps(statistics.totalOutRate)}</span>
							</td>
							<td className="px-4 py-2">
								<span>Network Out:</span>
								<br />
								<span className="font-bold">{multipleBytes(statistics.totalOutBytes)}</span>
							</td>
							<td className="px-4 py-2">
								<span>Total Network:</span>
								<br />
								<span className="font-bold">{multipleBytes(statistics.totalInBytes + statistics.totalOutBytes)}</span>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	);
};
