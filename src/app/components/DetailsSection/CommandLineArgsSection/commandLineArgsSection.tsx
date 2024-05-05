export interface CommandLineArgsSectionProps {
	cmdLine?: string;
}

export const CommandLineArgsSection = ({ cmdLine }: CommandLineArgsSectionProps) => {
	if (cmdLine === undefined) {
		return null;
	}

	return (
		<div className="flex flex-col">
			<span className="mb-2">{cmdLine}</span>
		</div>
	);
};
