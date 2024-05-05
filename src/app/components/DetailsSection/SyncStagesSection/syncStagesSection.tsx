import { KeyValue } from "../../../store/appSlice";

export interface SyncStagesSectionProps {
	syncStages?: KeyValue[];
}

export const SyncStagesSection = ({ syncStages }: SyncStagesSectionProps) => {
	if (syncStages === undefined) {
		return null;
	}

	return (
		<div className="flex flex-col">
			<table className="table-auto rounded-lg bg-white text-left">
				<tbody>
					{syncStages.map((item) => {
						return (
							<tr
								className="border-b border-gray-200 hover:bg-gray-100"
								key={item.key}
							>
								<td className="px-4 py-2">{item.key}</td>
								<td className="px-4 py-2">{item.value}</td>
							</tr>
						);
					})}
				</tbody>
			</table>
		</div>
	);
};
