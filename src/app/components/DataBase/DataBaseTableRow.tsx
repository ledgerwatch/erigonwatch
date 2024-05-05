import { multipleBytes } from "../../../helpers/converters";
import { DataBase } from "../../store/appSlice";

interface DataBaseTableRowProps {
	db: DataBase;
	selected: boolean;
	onDbSelected: (dbName: string) => void;
}

export const DataBaseTableRow = ({ db, selected, onDbSelected }: DataBaseTableRowProps) => {
	return (
		<tr
			key={db.path}
			className="border-b border-gray-200 hover:bg-gray-100 cursor-pointer"
			style={{ backgroundColor: selected ? "lightblue" : "white" }}
			onClick={() => onDbSelected(db.path)}
		>
			<td className="px-4 py-2">{db.path}</td>
			<td className="px-4 py-2">{db.keysCount}</td>
			<td className="px-4 py-2">{multipleBytes(db.size)}</td>
		</tr>
	);
};
