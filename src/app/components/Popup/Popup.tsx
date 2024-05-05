import { Button } from "../Button/Button";
import { BUTTON_BULE, BUTTON_RED } from "../../../helpers/colors";
import CloseIcon from "@mui/icons-material/Close";

interface PopupProps {
	title?: string;
	body?: string;
	positiveButton?: string;
	negativeButton?: string;
	onClose: () => void;
	onPositiveClick?: () => void;
	onNegativeClick?: () => void;
}

export const Popup = ({
	title = "",
	body = "",
	positiveButton = "",
	negativeButton = "",
	onClose = () => {},
	onNegativeClick = () => {},
	onPositiveClick = () => {}
}: PopupProps) => {
	const renderButtons = () => {
		if (positiveButton !== "" && negativeButton !== "") {
			return (
				<>
					{renderButton(true, positiveButton)}
					<div className="w-2" />
					{renderButton(false, negativeButton)}
				</>
			);
		}

		if (positiveButton !== "") {
			return <>{renderButton(true, positiveButton)}</>;
		} else if (negativeButton !== "") {
			return <>{renderButton(false, negativeButton)}</>;
		} else {
			return null;
		}
	};

	const renderButton = (isPositive: boolean, title: string) => {
		return (
			<Button
				backgroundColor={isPositive ? BUTTON_RED : BUTTON_BULE}
				label={title}
				onClick={isPositive ? onPositiveClick : onNegativeClick}
				primary
			/>
		);
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
								<h3 className="text-3xl font-semibold">{title}</h3>
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
							<p className="my-4 text-slate-500 text-lg leading-relaxed">{body}</p>
						</div>
						{/*footer*/}
						<div className="flex items-center justify-end p-6">{renderButtons()}</div>
					</div>
				</div>
			</div>
			<div className="opacity-25 inset-0 z-40 bg-black" />
		</>
	);
};
