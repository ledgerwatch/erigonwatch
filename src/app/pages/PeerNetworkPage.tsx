import { useSelector } from "react-redux";
import { useState } from "react";
import {
	Peer,
	PeersStatistics,
	selectSentinelActivePeersForNode,
	selectSentinelPeersForNode,
	selectSentinelPeersStatistics,
	selectSentinelStaticPeersForNode,
	selectSentryActivePeersForNode,
	selectSentryPeersForNode,
	selectSentryPeersStatistics,
	selectSentryStaticPeersForNode
} from "../store/networkSlice";
import { PeersStatisticsTable } from "../components/PeersStatistics/PeersStatisticsTable";
import { PeersDetailsTable } from "../components/PeersStatistics/PeerDetailsTable";
import { PeerDetailsPopup } from "../components/PeersStatistics/PeerDetailsPopup";

export enum PeersStatisticsType {
	Active = "active",
	Static = "static",
	Total = "total",
	Errors = "errors",
	Network = "network",
	None = "none"
}

export interface PeerNetworkPageProps {
	type: string;
}

export const PeerNetworkPage = ({ type }: PeerNetworkPageProps) => {
	let peers: Peer[] = [];
	let statistics: PeersStatistics = {
		activePeers: 0,
		totalPeers: 0,
		staticPeers: 0,
		totalErrors: 0,
		totalInBytes: 0,
		totalOutBytes: 0,
		totalInRate: 0,
		totalOutRate: 0
	};
	let activePeers: Peer[] = [];
	let staticPeers: Peer[] = [];
	if (type === "sentry") {
		peers = useSelector(selectSentryPeersForNode);
		statistics = useSelector(selectSentryPeersStatistics);
		activePeers = useSelector(selectSentryActivePeersForNode);
		staticPeers = useSelector(selectSentryStaticPeersForNode);
	} else {
		peers = useSelector(selectSentinelPeersForNode);
		statistics = useSelector(selectSentinelPeersStatistics);
		activePeers = useSelector(selectSentinelActivePeersForNode);
		staticPeers = useSelector(selectSentinelStaticPeersForNode);
	}

	const [selectedPeer, setSelectedPeer] = useState<string | null>(null);

	const [selectedStatistic, setSelectedStatistic] = useState<PeersStatisticsType>(PeersStatisticsType.None);

	const renderPeersErrorsTable = () => {
		return (
			<table className="table-fixed rounded-lg shadow-lg bg-white text-left mb-4 w-full h-fit">
				<thead>
					<tr className="border-b">
						<th className="px-4 py-2">Error</th>
					</tr>
				</thead>
				<tbody></tbody>
			</table>
		);
	};

	return (
		<div className="flex items-center flex-col">
			<div className="flex justify-center items-center flex-row mb-5">
				<p className="mb-2 font-bold text-2xl">{type === "sentry" ? "eth/6x P2P" : "Beacon chain P2P"}</p>
				<div className="w-5" />
				<PeersStatisticsTable
					statistics={statistics}
					selectedStatistics={selectedStatistic}
					onRowClicked={(statistic: PeersStatisticsType) => {
						setSelectedStatistic(statistic);
					}}
				/>
			</div>
			{selectedStatistic === PeersStatisticsType.Active && (
				<PeersDetailsTable
					peers={activePeers}
					onPeerClicked={(peer: string) => {
						setSelectedPeer(peer);
					}}
				/>
			)}
			{selectedStatistic === PeersStatisticsType.Static && (
				<PeersDetailsTable
					peers={staticPeers}
					onPeerClicked={(peer: string) => {
						setSelectedPeer(peer);
					}}
				/>
			)}
			{selectedStatistic === PeersStatisticsType.Total && (
				<PeersDetailsTable
					peers={peers}
					onPeerClicked={(peer: string) => {
						setSelectedPeer(peer);
					}}
				/>
			)}
			{selectedStatistic === PeersStatisticsType.Errors && renderPeersErrorsTable()}

			{selectedPeer && (
				<PeerDetailsPopup
					peerId={selectedPeer}
					onClose={() => {
						setSelectedPeer(null);
					}}
				/>
			)}
		</div>
	);
};
