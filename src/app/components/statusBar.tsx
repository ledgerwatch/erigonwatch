import { useSelector } from "react-redux";
import { selecctActiveNode, selectActiveSession } from "../store/appSlice";
import DeviceHubIcon from "@mui/icons-material/DeviceHub";
import HubIcon from "@mui/icons-material/Hub";

export interface StatusBarProps {
	onSessionClicked: () => void;
	onNodeClicked: () => void;
}

export const StatusBar = ({ onSessionClicked, onNodeClicked }: StatusBarProps) => {
	const activeSession = useSelector(selectActiveSession);
	const activeNode = useSelector(selecctActiveNode);

	return (
		<div className="flex flex-row h-10 bg-blue-500 absolute bottom-0 left-0 w-full z-10 px-5 py-1">
			<button
				className="text-white bg-blue-600 hover:bg-blue-700 px-2 rounded-md"
				onClick={() => {
					onSessionClicked();
				}}
			>
				<DeviceHubIcon />
				<span className="px-1" />
				{activeSession?.name || "No Session Selected"}
			</button>
			<span className="mx-4" />
			<button
				className="text-white bg-blue-600 hover:bg-blue-700 px-2 rounded-md"
				onClick={() => {
					onNodeClicked();
				}}
			>
				<HubIcon />
				<span className="px-1" />
				{activeNode?.name || "No Node Selected"}
			</button>
		</div>
	);
};
