import React, { useEffect } from "react";
import { DataBase } from "../../store/appSlice";
import { DataBaseTableRow } from "./DataBaseTableRow";
import { TableHeader } from "../Table/TableHeader";

interface DataBaseTableSort {
	db: {
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

interface DataBaseTableProps {
	dbs: DataBase[];
	onDbSelected: (dbName: string) => void;
}

export const DataBaseTable = ({ dbs, onDbSelected }: DataBaseTableProps) => {
	const [selectedDB, setSelectedDB] = React.useState<string>("");
	const [visibleDbs, setVisibleDbs] = React.useState<DataBase[]>(dbs);
	const [nameFilter, setNameFilter] = React.useState<string>("");
	const [sortState, setSortState] = React.useState<DataBaseTableSort>({
		db: {
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
		setVisibleDbs(dbs.filter((db) => db.path.toLowerCase().includes(nameFilter.toLowerCase())));
	}, [dbs, nameFilter]);

	useEffect(() => {
		setVisibleDbs(
			[...visibleDbs].sort((a, b) => {
				if (sortState.db.sortValue) {
					if (sortState.db.sortDirection === "asc") {
						return a.path.localeCompare(b.path);
					} else {
						return b.path.localeCompare(a.path);
					}
				} else if (sortState.keysCount.sortValue) {
					if (sortState.keysCount.sortDirection === "asc") {
						return a.keysCount - b.keysCount;
					} else {
						return b.keysCount - a.keysCount;
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
						title="DB"
						filter
						sort
						onFilterChange={(value) => setNameFilter(value)}
						onSortChange={(value) => {
							setSortState({
								...sortState,
								db: {
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
								db: {
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
								db: {
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
				{visibleDbs.map((db) => (
					<DataBaseTableRow
						db={db}
						selected={selectedDB === db.path}
						onDbSelected={(dbName: string) => {
							setSelectedDB(dbName);
							onDbSelected(dbName);
						}}
					/>
				))}
			</tbody>
		</table>
	);
};
