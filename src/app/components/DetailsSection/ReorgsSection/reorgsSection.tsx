import { Reorg } from "../../../store/appSlice";

export interface ReorgsSectionProps {
	reorg?: Reorg;
}

export const ReorgsSection = ({ reorg }: ReorgsSectionProps) => {
	if (reorg === undefined) {
		return null;
	}

	return (
		<div className="flex flex-col">
			<span className="font-bold">Blocks scanned:</span>
			<span>{reorg.totalBlocks}</span>
			<span className="font-bold">Time took:</span>
			<span>{reorg.timeTook}</span>
			<span className="font-bold">Wrong blocks:</span>
			{reorg.wrongBlocks.length === 0 ? (
				<span>None</span>
			) : (
				<table className="table-auto rounded-lg bg-white text-left">
					<tbody>
						{reorg.wrongBlocks.map((wrongBlock) => {
							return (
								<tr
									className="border-b border-gray-200 hover:bg-gray-100"
									key={wrongBlock}
								>
									<td className="px-4 py-2">{wrongBlock}</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			)}
		</div>
	);
};
