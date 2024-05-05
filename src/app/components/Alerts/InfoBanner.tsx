import { useDispatch, useSelector } from "react-redux";
import Alert from "@mui/material/Alert";
import { selectIsConnectedToInternet, selectIsConnectedToNode, setIsConnectedToInternet } from "../../store/connectionSlice";
import { useEffect } from "react";

export const InfoBanner = () => {
	const dispatch = useDispatch();

	const isInternetConnected = useSelector(selectIsConnectedToInternet);
	const isConnectedToNode = useSelector(selectIsConnectedToNode);

	useEffect(() => {
		function changeStatus() {
			fetchGoogle();
		}
		window.addEventListener("online", changeStatus);
		window.addEventListener("offline", changeStatus);
		return () => {
			window.removeEventListener("online", changeStatus);
			window.removeEventListener("offline", changeStatus);
		};
	}, []);

	const fetchGoogle = () => {
		fetch("https://www.google.com/", { mode: "no-cors" })
			.then(() => {
				dispatch(setIsConnectedToInternet(true));
			})
			.catch(() => {
				dispatch(setIsConnectedToInternet(false));
			});
	};

	const renderAlert = () => {
		return (
			<div className="justify-center items-center flex top-0 left-0 right-0 z-50 absolute">
				<div
					className="absolute top-[50px] flex items-center w-fit h-fit"
					role="alert"
				>
					{!isInternetConnected ? renderInternetAlert() : !isConnectedToNode ? renderNodeAlert() : null}
				</div>
			</div>
		);
	};

	const renderInternetAlert = () => {
		return (
			<Alert
				variant="filled"
				severity="warning"
			>
				Looks like we are offline - <strong>Chek your internet connection</strong>
			</Alert>
		);
	};

	const renderNodeAlert = () => {
		return (
			<Alert
				variant="filled"
				severity="warning"
			>
				Looks like we aren't connected to Erigon Node - <strong>Chek node connection and reload page</strong>
			</Alert>
		);
	};

	return <>{!isInternetConnected || !isConnectedToNode ? renderAlert() : null}</>;
};
