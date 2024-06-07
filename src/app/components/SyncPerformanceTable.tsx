import { useSelector } from "react-redux";
import { StageState, SyncStage, selectSyncStagesForNode } from "../store/syncStagesSlice";

export const SyncPerformanceTable = () => {
	const syncStages = useSelector(selectSyncStagesForNode);

	const stateToString = (state: StageState) => {
		switch (state) {
			case StageState.Queued:
				return "Queued";
			case StageState.Running:
				return "Running";
			case StageState.Completed:
				return "Completed";
			default:
				return "Unknown";
		}
	};

	const renderStage = (stage: SyncStage) => {
		return (
			<tr className="border-b">
				<td className="px-4 py-2">{stage.id}</td>
				<td className="px-4 py-2">{stateToString(stage.state)}</td>

				{stage.subStages.length === 0 ? null : (
					<table className="table-auto w-fit border-0 rounded-lg shadow-lg relative bg-white outline-none focus:outline-none mb-4">
						<thead>
							<tr className="border-b">
								<th className="px-4 py-2">SubStage</th>
								<th className="px-4 py-2">State</th>
							</tr>
						</thead>
						<tbody>
							{stage.subStages.map((subStage) => {
								return (
									<tr className="border-b">
										<td className="px-4 py-2">{subStage.id}</td>
										<td className="px-4 py-2">{stateToString(subStage.state)}</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				)}
			</tr>
		);
	};

	return (
		<div>
			<table className="table-auto w-fit border-0 rounded-lg shadow-lg relative bg-white outline-none focus:outline-none mb-4">
				<thead>
					<tr className="border-b">
						<th className="px-4 py-2">Stage</th>
						<th className="px-4 py-2">State</th>
					</tr>
				</thead>
				<tbody>
					{syncStages.map((stage) => {
						return renderStage(stage);
					})}
				</tbody>
			</table>
		</div>
	);
};
