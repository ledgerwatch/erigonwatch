import { Tab } from "./detailsSection";

export interface DetailsButtonProps {
	tab: Tab;
	selectedTab: Tab;
	testId: string;
	onButtonClicked: (tab: Tab) => void;
}

export const DetailsButton = ({ tab, selectedTab, testId, onButtonClicked }: DetailsButtonProps) => {
	const getStyle = (tab: Tab): string => {
		let style =
			"px-4 py-2 text-sm font-medium border-blue-600 hover:bg-blue-700 hover:text-white";
		const selected = "bg-blue-600 text-white";
		const notSelected = "bg-white text-blue-600 outline-top";
		const styleEdgeLeft = "border-l border-r border-t border-b rounded-tl-md rounded-bl-md";
		const styleEdgeRight = "border-r border-t border-b rounded-tr-md rounded-br-md";
		const styleCenter = "border-r border-t border-b";

		if (tab === Tab.Command) {
			style = style + " " + styleEdgeLeft;
		} else if (tab === Tab.NodeInfo) {
			style = style + " " + styleEdgeRight;
		} else {
			style = style + " " + styleCenter;
		}

		if (tab === selectedTab) {
			return style + " " + selected;
		} else {
			return style + " " + notSelected;
		}
	};

	return (
		<button
			className={getStyle(tab)}
			onClick={() => {
				onButtonClicked(tab);
			}}
			data-testid={testId}
		>
			{tab}
		</button>
	);
};
