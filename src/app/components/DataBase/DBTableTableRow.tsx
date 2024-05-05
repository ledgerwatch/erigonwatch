import { multipleBytes } from "../../../helpers/converters";
import { DataBase, DataBaseTable } from "../../store/appSlice";

interface DBTableTableRowProps {
	table: DataBaseTable;
}

export const DBTableTableRow = ({ table }: DBTableTableRowProps) => {
	return (
		<tr
			key={table.name}
			className="border-b border-gray-200 hover:bg-gray-100 cursor-pointer"
		>
			<td className="px-4 py-2">{table.name}</td>
			<td className="px-4 py-2">{table.count}</td>
			<td className="px-4 py-2">{multipleBytes(table.size)}</td>
		</tr>
	);
};
