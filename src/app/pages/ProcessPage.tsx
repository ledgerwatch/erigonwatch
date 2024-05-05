import { useSelector } from "react-redux";
import { selectActiveNodeId, selectCmdLineArgsForNode, selectFlagsForNode, selectNodeDetails, selectReorgForNode, selectSyncStagesForNode } from "../store/appSlice";
import { DetailsSection } from "../components/DetailsSection/detailsSection";

export const ProcessPage = () => {
	const activeNodeId = useSelector(selectActiveNodeId);
	const flags = useSelector(selectFlagsForNode);
	const cmdLineArgs = useSelector(selectCmdLineArgsForNode);
	const nodeDetails = useSelector(selectNodeDetails);
	const syncStages = useSelector(selectSyncStagesForNode);
	const reorgs = useSelector(selectReorgForNode);

	return (
		<div className="mt-4">
			{activeNodeId !== "" && (
				<DetailsSection
					cmdLine={cmdLineArgs}
					flags={flags}
					nodeDetails={nodeDetails}
					syncStages={syncStages}
					reorgs={reorgs}
				/>
			)}
		</div>
	);
};
