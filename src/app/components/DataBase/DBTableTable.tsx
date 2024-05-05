import React, { useEffect } from "react";
import { DataBaseTable } from "../../store/appSlice";
import { TableHeader } from "../Table/TableHeader";
import { DBTableTableRow } from "./DBTableTableRow";

interface DataBaseTableSort {
	table: {
		sortDirection: "asc" | "desc";
		sortValue: boolean;
	};
	keysCount: {
		sortDirection: "asc" | "desc";
		sortValue: boolean;
	};
	size: {
		sortDirection: "asc" | "desc";
		sortValue: boolean;
	};
}

interface DBTableTableProps {
	tables: DataBaseTable[];
}

export const DBTableTable = ({ tables }: DBTableTableProps) => {
	const [visibleTables, setVisibleTables] = React.useState<DataBaseTable[]>(tables);
	const [nameFilter, setNameFilter] = React.useState<string>("");
	const [sortState, setSortState] = React.useState<DataBaseTableSort>({
		table: {
			sortDirection: "asc",
			sortValue: true
		},
		keysCount: {
			sortDirection: "asc",
			sortValue: false
		},
		size: {
			sortDirection: "asc",
			sortValue: false
		}
	});

	useEffect(() => {
		setVisibleTables(tables.filter((table) => table.name.toLowerCase().includes(nameFilter.toLowerCase())));
	}, [tables, nameFilter]);

	useEffect(() => {
		setVisibleTables(
			[...visibleTables].sort((a, b) => {
				if (sortState.table.sortValue) {
					if (sortState.table.sortDirection === "asc") {
						return a.name.localeCompare(b.name);
					} else {
						return b.name.localeCompare(a.name);
					}
				} else if (sortState.keysCount.sortValue) {
					if (sortState.keysCount.sortDirection === "asc") {
						return a.count - b.count;
					} else {
						return b.count - a.count;
					}
				} else if (sortState.size.sortValue) {
					if (sortState.size.sortDirection === "asc") {
						return a.size - b.size;
					} else {
						return b.size - a.size;
					}
				}
				return 0;
			})
		);
	}, [sortState]);

	return (
		<table
			className="table-auto rounded-lg bg-white text-left w-full"
			data-testid="details_section_flags_table"
		>
			<thead>
				<tr className="border-b">
					<TableHeader
						title="Table"
						filter
						sort
						onFilterChange={(value) => setNameFilter(value)}
						onSortChange={(value) => {
							setSortState({
								...sortState,
								table: {
									sortDirection: value as "asc" | "desc",
									sortValue: true
								},
								keysCount: {
									sortDirection: "asc",
									sortValue: false
								},
								size: {
									sortDirection: "asc",
									sortValue: false
								}
							});
						}}
					/>
					<TableHeader
						title="Keys Count"
						sort
						onSortChange={(value) => {
							setSortState({
								...sortState,
								table: {
									sortDirection: "asc",
									sortValue: false
								},
								keysCount: {
									sortDirection: value as "asc" | "desc",
									sortValue: true
								},
								size: {
									sortDirection: "asc",
									sortValue: false
								}
							});
						}}
					/>
					<TableHeader
						title="Size"
						sort
						onSortChange={(value) => {
							setSortState({
								...sortState,
								table: {
									sortDirection: "asc",
									sortValue: false
								},
								keysCount: {
									sortDirection: "asc",
									sortValue: false
								},
								size: {
									sortDirection: value as "asc" | "desc",
									sortValue: true
								}
							});
						}}
					/>
				</tr>
			</thead>
			<tbody>
				{visibleTables.map((table) => (
					<DBTableTableRow table={table} />
				))}
			</tbody>
		</table>
	);
};
