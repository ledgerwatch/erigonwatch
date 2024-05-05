import { useEffect, useState } from "react";
import { Flag } from "../../../../entities";
import { FlagsTable } from "./flagsTable";

export interface FlagsSectionProps {
	flags?: Flag[];
}

export const FlagsSection = ({ flags }: FlagsSectionProps) => {
	const [data, setData] = useState<Flag[]>([]);

	useEffect(() => {
		if (flags !== undefined) {
			setData(flags);
		}
	}, [flags]);

	return (
		<div className="flex flex-col">
			<input
				type="text"
				className="border-2 border-gray-300 rounded-lg p-2 mb-2"
				placeholder="Search"
				onChange={(e) => {
					const filteredFlag = flags?.filter((flag) => {
						return flag.flag.toLowerCase().includes(e.target.value.toLowerCase());
					});

					const filteredUsage = flags?.filter((flag) => {
						return flag.usage.toLowerCase().includes(e.target.value.toLowerCase());
					});

					setData([...filteredFlag!, ...filteredUsage!]);
				}}
			/>
			<FlagsTable flags={data} />
		</div>
	);
};
