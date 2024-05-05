import { BUTTON_RED } from "../../helpers/colors";
import { Button } from "./Button/Button";
import { SessionsList } from "./sessionsList";
export interface SessionsModalProps {
	open: boolean;
	onClose: () => void;
}

export const SessionsModal = ({ open, onClose, ...props }: SessionsModalProps) => {
	return (
		<dialog
			className="fixed z-10 inset-0 overflow-y-auto"
			open={open}
			onClose={() => {
				onClose();
			}}
		>
			<div
				className="fixed inset-0 bg-gray-500 bg-opacity-75"
				aria-hidden="true"
			/>
			<div className="flex items-center justify-center">
				<div className="flex flex-col items-center relative bg-white rounded-lg p-4">
					<h3 className="pb-4 text-xl font-semibold">Sessions List</h3>
					<SessionsList
						onSessionSelected={() => {
							onClose();
						}}
					/>
					<Button
						backgroundColor={BUTTON_RED}
						label="Close"
						onClick={onClose}
						primary
					/>
				</div>
			</div>
		</dialog>
	);
};
