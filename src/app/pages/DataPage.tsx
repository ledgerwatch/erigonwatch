import { useSelector } from "react-redux";
import { makeSelectDbByName, selectDBsForNode } from "../store/appSlice";
import { useEffect, useState } from "react";
import { Button } from "../components/Button/Button";
import { BUTTON_BULE } from "../../helpers/colors";
import { DataBaseTable } from "../components/DataBase/DataBaseTable";
import { store } from "../store/store";
import { DBTableTable } from "../components/DataBase/DBTableTable";
import { CSVLink } from "react-csv";
import { multipleBytes } from "../../helpers/converters";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

interface CSVDB {
	tName: string;
	KC: number;
	size: string;
}

export const DataPage = () => {
	const dbs = useSelector(selectDBsForNode);
	const [selectedDBPath, setSelectedDB] = useState("");
	const selectItemById = makeSelectDbByName();
	const selectedDB = selectItemById(store.getState(), selectedDBPath);
	const [csvData, setCsvData] = useState<CSVDB[]>([]);

	const headersCSV = [
		{ label: "Table Name", key: "tName" },
		{ label: "Keys Count", key: "KC" },
		{ label: "Size", key: "size" }
	];

	const handleKeyPress = (event: KeyboardEvent) => {
		if (event.key === "Escape") {
			setSelectedDB("");
		}
	};

	useEffect(() => {
		window.addEventListener("keydown", handleKeyPress);

		return () => {
			window.removeEventListener("keydown", handleKeyPress);
		};
	}, []);

	useEffect(() => {
		if (selectedDBPath.length > 0) {
			setCsvData(
				selectedDB.tables.map((table) => ({
					tName: table.name,
					KC: table.count,
					size: multipleBytes(table.size)
				}))
			);
		}
	}, [selectedDBPath]);

	const getCSVHeaders = () => {
		if (selectedDBPath.length > 0) {
			return [
				{ label: "Table Name", key: "tName" },
				{ label: "Keys Count", key: "KC" },
				{ label: "Size", key: "size" }
			];
		} else {
			return [
				{ label: "DB Name", key: "dbName" },
				{ label: "Keys Count", key: "KC" },
				{ label: "Size", key: "size" }
			];
		}
	};

	const getCSVData = () => {
		if (selectedDBPath.length > 0) {
			return selectedDB.tables.map((table) => ({
				tName: table.name,
				KC: table.count,
				size: multipleBytes(table.size)
			}));
		} else {
			return dbs.map((db) => ({
				dbName: db.path,
				KC: db.keysCount,
				size: multipleBytes(db.size)
			}));
		}
	};

	return (
		<div className="flex flex-col w-full py-4">
			<CSVLink
				headers={getCSVHeaders()}
				data={getCSVData()}
				filename={selectedDBPath.length > 0 ? selectedDBPath + ".csv" : "dbs.csv"}
				className="btn btn-primary"
				target="_blank"
			>
				<Button
					backgroundColor={BUTTON_BULE}
					label="Export to CSV"
					onClick={() => {}}
					primary
				/>
			</CSVLink>

			{selectedDBPath.length <= 0 ? (
				<div className="w-full h-[90vh] overflow-y-auto mt-10 flex flex-col items-center">
					<span className="mb-5 font-bold text-lg">Data Bases</span>
					<DataBaseTable
						dbs={dbs}
						onDbSelected={(dbName) => setSelectedDB(dbName)}
					/>
				</div>
			) : (
				<div className="w-full h-[90vh] overflow-y-auto mt-10 flex flex-col items-center">
					<div className="mb-5 flex flex-row space-between w-full">
						<div className="flex-[1]">
							<ArrowBackIcon
								onClick={() => {
									setSelectedDB("");
								}}
								className="cursor-pointer"
							/>
						</div>
						<div className="contents flex-[1]">
							<span className="font-bold text-lg">{selectedDBPath}</span>
						</div>
						<div className="flex-[1]" />
					</div>

					<DBTableTable tables={selectedDB.tables} />
				</div>
			)}
		</div>
	);
};
