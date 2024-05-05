import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LogFile, selectActiveNodeId, selectLogFilesForNode, setLogWithNameSelected } from "../store/appSlice";
import { getLogs } from "../../Network/APIGateway";
import { LazyLog } from "react-lazylog";
import { LogList } from "../components/logList";

enum DisplayPart {
	Head = "Head",
	Tail = "Tail",
	All = "All"
}

export const LogsPage = () => {
	const dispatch = useDispatch();
	const activeNodeId = useSelector(selectActiveNodeId);
	const logFiles = useSelector(selectLogFilesForNode);

	const [url, setUrl] = useState("");
	const [displayPart, setDisplayPart] = useState(DisplayPart.Head);

	useEffect(() => {
		logFiles.forEach((logFile) => {
			if (logFile.selected) {
				const size = Math.round(logFile.size / 10);
				let val = logFile.url;
				if (displayPart === DisplayPart.Head) {
					val = logFile.url + "?offset=0&limit=" + size;
				} else if (displayPart === DisplayPart.Tail) {
					val = logFile.url + "?offset=" + (logFile.size - size) + "&limit=" + size;
				}

				setUrl(val);
			}
		});
	}, [displayPart, logFiles]);

	useEffect(() => {
		let isThereSelectedLogFile = false;
		logFiles.forEach((logFile) => {
			if (logFile.selected) {
				isThereSelectedLogFile = true;
			}
		});

		if (!isThereSelectedLogFile) {
			setUrl("");
		}
	}, [logFiles]);

	useEffect(() => {
		if (activeNodeId !== "") {
			getLogs();
		}
	}, [activeNodeId]);

	const downloadLogFile = (logFile: LogFile) => {
		fetch(logFile.url, {
			method: "GET",
			headers: {
				"Content-Type": "text/plain"
			}
		})
			.then((response) => response.blob())
			.then((blob) => {
				// Create blob link to download
				const url = window.URL.createObjectURL(new Blob([blob]));
				const link = document.createElement("a");
				link.href = url;
				link.setAttribute("download", logFile.name);

				// Append to html link element page
				document.body.appendChild(link);

				// Start download
				link.click();

				// Clean up and remove the link
				document.body.removeChild(link);
			});
	};

	const getStyle = (part: DisplayPart): string => {
		let style =
			"px-4 py-2 mr-2 text-sm font-medium text-gray-900 bg-white-100 border-gray-900 hover:bg-gray-500 hover:text-white dark:border-white dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:bg-gray-700 border";
		const selected = "bg-gray-900 text-white";

		if (part === displayPart) {
			return style + " " + selected;
		}

		return style;
	};

	return (
		<div className="flex flex-col w-full pt-4 pb-4">
			<LogList
				logs={logFiles}
				onLogSelected={(name: string) => {
					dispatch(setLogWithNameSelected(name));
				}}
				onDownload={(logFile: LogFile) => {
					downloadLogFile(logFile);
				}}
			/>
			{url !== "" ? (
				<>
					<div className="flex flex-row pb-2 pt-2">
						<button
							className={getStyle(DisplayPart.Head)}
							onClick={() => setDisplayPart(DisplayPart.Head)}
						>
							Head
						</button>
						<button
							className={getStyle(DisplayPart.Tail)}
							onClick={() => setDisplayPart(DisplayPart.Tail)}
						>
							Tail
						</button>
						<button
							className={getStyle(DisplayPart.All)}
							onClick={() => setDisplayPart(DisplayPart.All)}
						>
							All
						</button>
					</div>
					<LazyLog
						extraLines={1}
						enableSearch
						caseInsensitive
						url={url}
						height={window.innerHeight * 0.7}
						width={"auto"}
					/>
				</>
			) : null}
		</div>
	);
};
