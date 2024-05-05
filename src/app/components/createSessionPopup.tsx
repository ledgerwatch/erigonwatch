import React from "react";
import { Button } from "./Button/Button";
import { BUTTON_BULE, BUTTON_RED } from "../../helpers/colors";

interface CreateSessionPopupProps {
	onClose: () => void;
	onCreate: (sessionName: string) => void;
}

export const CreateSessionPopup = ({ onClose, onCreate, ...props }: CreateSessionPopupProps) => {
	const [sessionName, setSessionName] = React.useState("");

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSessionName(event.target.value);
	};

	return (
		<>
			<div className="justify-center items-center flex overflow-x-hidden overflow-y-auto inset-1 z-50 outline-none focus:outline-none">
				<div className="relative w-auto my-6 mx-auto max-w-3xl">
					{/*content*/}
					<div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none items-center">
						{/*header*/}
						<h3 className="text-3xl font-semibold mt-5">Create Session</h3>
						{/*body*/}
						<div className="flex flex-col relative p-6 flex-auto justify-center">
							<p className="my-4 text-slate-500 text-lg leading-relaxed">To create a new session, enter a name.</p>
							<input
								type="text"
								placeholder="Enter Session Name"
								className="border-2 border-slate-200 rounded-md p-2"
								value={sessionName}
								onChange={handleChange}
							/>
						</div>
						{/*footer*/}
						<div className="flex items-center justify-end p-6">
							<Button
								backgroundColor={BUTTON_RED}
								label="Close"
								onClick={() => onClose()}
								primary
							/>
							<div className="w-2" />
							<Button
								backgroundColor={BUTTON_BULE}
								label="Create"
								onClick={() => {
									onCreate(sessionName);
								}}
								primary
							/>
						</div>
					</div>
				</div>
			</div>
			<div className="opacity-25 inset-0 z-40 bg-black"></div>
		</>
	);
};
