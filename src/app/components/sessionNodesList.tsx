
import CheckIcon from "@mui/icons-material/Check";
import { useDispatch, useSelector } from "react-redux";
import { selectNodesForList, setActiveNodeId } from "../store/appSlice";
interface SessionNodesListProps {
	onNodeSelected: () => void;
}

export const SessionNodesList = ({ onNodeSelected, ...props }: SessionNodesListProps) => {
	const dispatch = useDispatch();
	const nodes = useSelector(selectNodesForList);

	const onNodeClicked = (nodeId: string) => {
		dispatch(setActiveNodeId(nodeId));
		onNodeSelected();
	};


	const renderSessionsTable = () => {
		return (
			<table className="table-auto w-fit border-0 rounded-lg shadow-lg relative bg-white outline-none focus:outline-none mb-4">
				<thead>
					<tr className="border-b">
						<th />
						<th className="px-4 py-2">Name</th>
						<th className="px-4 py-2">Version</th>
						<th className="px-4 py-2">Chain</th>
						<th className="px-4 py-2">Block</th>
						<th className="px-4 py-2">Address</th>
					</tr>
				</thead>
				<tbody>
					{nodes.map((node, index) => {
						return (
							<tr
								className="border-b border-gray-200 hover:bg-gray-100 cursor-pointer"
								key={index}
								onClick={() => onNodeClicked(node.id)}
							>
								<td className="pl-2">{node.active && <CheckIcon />}</td>
								<td className="px-4 py-2">{node.name}</td>
								<td className="px-4 py-2">{node.version}</td>
								<td className="px-4 py-2">{node.chain}</td>
								<td className="px-4 py-2">{node.block}</td>
								<td className="px-4 py-2">{node.address}</td>
							</tr>
						);
					})}
				</tbody>
			</table>
		);
	};

	return <>{nodes.length > 0 && renderSessionsTable()}</>;
};
