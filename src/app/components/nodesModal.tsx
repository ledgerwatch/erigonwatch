import { BUTTON_RED } from "../../helpers/colors";
import { Button } from "./Button/Button";
import { SessionNodesList } from "./sessionNodesList";

export interface NodesModalProps {
	open: boolean;
	onClose: () => void;
}

export const NodesModal = ({ open, onClose, ...props }: NodesModalProps) => {
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
					<h3 className="pb-4 text-xl font-semibold">Nodes List</h3>
					<SessionNodesList
						onNodeSelected={() => {
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
