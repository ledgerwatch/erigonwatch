import { useSelector } from "react-redux";
import { selectIssuesForActiveNode } from "../store/issuesSlice";
import { Alert } from "@mui/material";

export const IssuesPage = () => {
	const issues = useSelector(selectIssuesForActiveNode);

	const renderTable = () => {
		return (
			<div>
				<table className="table-auto w-fit border-0 rounded-lg shadow-lg relative bg-white outline-none focus:outline-none mb-4">
					<tbody>
						{issues.map((issue) => {
							return (
								<tr>
									<div className="p-1">
										<Alert
											variant="filled"
											severity="warning"
										>
											{issue.message}
										</Alert>
									</div>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
		);
	};

	return (
		<div className="flex flex-col">{issues.length > 0 ? renderTable() : <h3 className="py-2 text-xl font-semibold">No issues detected</h3>}</div>
	);
};
