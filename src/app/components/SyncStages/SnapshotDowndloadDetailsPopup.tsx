import { useSelector } from "react-redux";
import { multipleBps } from "../../../helpers/converters";
import { useEffect, useState } from "react";
import { SnapshotSegmentDownloadStatus, selectSnapshotDownloadStatusesForNode } from "../../store/syncStagesSlice";
import { SegmentsTable } from "./SegmentsTable";
import { SegmentDetailsView } from "./SegmentDetailsView";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloseIcon from "@mui/icons-material/Close";

interface SnapshotDowndloadDetailsPopupProps {
	onClose: () => void;
}

export const SnapshotDowndloadDetailsPopup = ({ onClose }: SnapshotDowndloadDetailsPopupProps) => {
	const syncStatus = useSelector(selectSnapshotDownloadStatusesForNode);
	const [wss, setWss] = useState(0);
	const [pss, setPss] = useState(0);
	const [selectedSegment, setSelectedSegment] = useState<SnapshotSegmentDownloadStatus | null>(null);

	const handleKeyPress = (event: KeyboardEvent) => {
		if (event.key === "Escape") {
			if (selectedSegment) {
				setSelectedSegment(null);
			} else {
				onClose();
			}
		}
	};

	useEffect(() => {
		window.addEventListener("keydown", handleKeyPress);

		return () => {
			window.removeEventListener("keydown", handleKeyPress);
		};
	}, [selectedSegment]);

	useEffect(() => {
		let ws = 0;
		let ps = 0;
		syncStatus.segments.forEach((segment) => {
			ws += webseedsRate(segment);
			ps += peersRate(segment);
		});
		setWss(ws);
		setPss(ps);
	}, [syncStatus]);

	const peersRate = (segment: SnapshotSegmentDownloadStatus): number => {
		let downloadRate = 0;
		segment.peers.forEach((peer) => {
			downloadRate += peer.downloadRate;
		});

		return downloadRate;
	};

	const webseedsRate = (segment: SnapshotSegmentDownloadStatus): number => {
		let downloadRate = 0;
		segment.webseeds.forEach((webseed) => {
			downloadRate += webseed.downloadRate;
		});

		return downloadRate;
	};

	const renderHeader = () => {
		return (
			<div className="flex flex-row w-full pt-10 pr-10 pl-10">
				<div className="flex-[1]">
					{selectedSegment && (
						<ArrowBackIcon
							onClick={() => {
								setSelectedSegment(null);
							}}
							className="cursor-pointer"
						/>
					)}
				</div>
				<div className="flex flex-[2] justify-center">
					<h3 className="text-3xl font-semibold">{selectedSegment ? "Segment details" : "Segments List"} </h3>
				</div>
				<div className="flex flex-[1] justify-end">
					<CloseIcon
						onClick={() => onClose()}
						className="cursor-pointer"
					/>
				</div>
			</div>
		);
	};

	return (
		<>
			<div className="justify-center items-center flex overflow-x-hidden overflow-y-auto inset-0 z-50 outline-none focus:outline-none absolute bg-black/[.4]">
				<div className="relative w-auto my-6 mx-auto max-w-[100vw]">
					{/*content*/}
					<div className="border-0 rounded-lg shadow-lg relative flex flex-col w-fit bg-white outline-none focus:outline-none items-center">
						{/*header*/}
						{renderHeader()}
						{/*body*/}
						<div className="flex flex-col relative p-6 flex-auto justify-start items-center h-[75vh] overflow-scroll">
							<div className="flex flex-col shadow-lg rounded-md p-2 bg-white h-[90%]">
								<SegmentsTable
									segments={syncStatus.segments}
									segmentSelected={selectedSegment != null}
									onSegmentClicked={(segment) => setSelectedSegment(segment)}
								/>

								{selectedSegment && (
									<div className="absolute z-10 w-[95%] h-[80%] bg-white">
										<SegmentDetailsView segment={selectedSegment} />
									</div>
								)}
							</div>
							{!selectedSegment && (
								<>
									<div className="flex flex-row">
										<p className="font-bold">webseeds :</p>
										<p>{multipleBps(wss)}</p>
									</div>
									<div className="flex flex-row">
										<p className="font-bold">peers :</p>
										<p>{multipleBps(pss)}</p>
									</div>
								</>
							)}
						</div>
						{/*footer*/}
					</div>
				</div>
			</div>
			<div className="opacity-25 inset-0 z-40 bg-black"></div>
		</>
	);
};
