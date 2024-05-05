import React from "react";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CloseIcon from "@mui/icons-material/Close";
import { InfoAlert } from "../Alerts/InfoAlert";

export interface NodeInfoValuePopupProps {
	key: string;
	value: string;
}

interface NodeInfoPopupProps {
	value: NodeInfoValuePopupProps;
	onClose: () => void;
}

export const NodeInfoPopup = ({ value, onClose }: NodeInfoPopupProps) => {
	const [copied, setCopied] = React.useState(false);

	const copyToClipboard = () => {
		setCopied(true);
		setTimeout(() => {
			setCopied(false);
		}, 1500);
		navigator.clipboard.writeText(value.value);
	};

	return (
		<>
			<div className="justify-center items-center flex overflow-x-hidden overflow-y-auto inset-0 z-50 outline-none focus:outline-none absolute bg-black/[.4]">
				<div className="relative w-auto my-6 mx-auto max-w-3xl">
					{/*content*/}
					<div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none items-center p-4 min-w-[20vw]">
						{/*header*/}
						<div className="flex flex-row w-full">
							<div className="flex-[1]"></div>
							<div className="flex flex-[2] justify-center">
								<h3 className="text-3xl font-semibold">{value.key}</h3>
							</div>
							<div className="flex flex-[1] justify-end">
								<CloseIcon
									onClick={() => onClose()}
									className="cursor-pointer"
								/>
							</div>
						</div>
						{/*body*/}
						<div className="inline-block relative p-6 flex-auto justify-center items-center w-full break-all max-h-[80vh] overflow-scroll">
							<p className="my-4 text-slate-500 text-lg leading-relaxed">{value.value}</p>
						</div>
						{/*footer*/}
						<div className="flex items-center justify-end p-6">
							<ContentCopyIcon
								onClick={() => copyToClipboard()}
								className="cursor-pointer"
							/>
						</div>
					</div>
				</div>
				{copied && <InfoAlert />}
			</div>

			<div className="opacity-25 inset-0 z-40 bg-black"></div>
		</>
	);
};
