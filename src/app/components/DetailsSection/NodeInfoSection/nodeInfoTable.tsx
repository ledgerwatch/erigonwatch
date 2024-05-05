import { NodeInfo } from "../../../../entities";

interface NodeInfoTableProps {
	nodeInfo: NodeInfo;
	onRowClicked: (key: string, value: string) => void;
}

export const NodeInfoTable = ({ nodeInfo, onRowClicked }: NodeInfoTableProps) => {
	const DISPLAY_MAX_VALUE_LENGTH = 50;

	const renderField = (field: string, value: string | number) => (
		<tr
			className="border-b border-gray-200 hover:bg-gray-100"
			onClick={() => {
				onRowClicked(field, String(value));
			}}
		>
			<td className="px-4 py-2 font-bold">{field}:</td>
			<td className="px-4 py-2">
				{String(value).length > DISPLAY_MAX_VALUE_LENGTH ? `${String(value).substring(0, DISPLAY_MAX_VALUE_LENGTH)}...` : value}
			</td>
		</tr>
	);

	const renderObject = (object: any, name: string) => {
		if (!object) {
			return renderField(name, "null");
		}

		let keys = Object.keys(object);

		return (
			<tr className="border-b border-gray-200">
				{name.length > 0 ? <td className="px-4 py-2 font-bold">{name + ":"}</td> : null}
				{keys.map((key) => {
					if (typeof object[key] === "object") {
						return renderObject(object[key], key);
					} else {
						return renderField(key, object[key]);
					}
				})}
			</tr>
		);
	};

	return (
		<table
			className="table-auto rounded-lg bg-white text-left"
			data-testid="details_section_flags_table"
		>
			<tbody>{renderObject(nodeInfo, "")}</tbody>
		</table>
	);
};
