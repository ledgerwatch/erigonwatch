import "./button.css";

interface ButtonProps {
	primary?: boolean;
	backgroundColor?: string;
	size?: "small" | "medium" | "large";
	label: string;
	onClick?: () => void;
	disabled?: boolean;
}

export const Button = ({ primary = false, size = "medium", backgroundColor, disabled = false, label, ...props }: ButtonProps) => {
	const mode = primary ? "storybook-button--primary" : "storybook-button--secondary";
	const bc = disabled ? "gray" : backgroundColor;
	return (
		<button
			type="button"
			className={["storybook-button", `storybook-button--${size}`, mode].join(" ")}
			style={{ backgroundColor: bc }}
			disabled={disabled}
			{...props}
		>
			{label}
		</button>
	);
};
