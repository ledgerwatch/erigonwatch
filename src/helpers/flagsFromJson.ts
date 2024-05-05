import { Flag } from "../entities";

const supportedValueTypes = ["boolean", "string", "number"];

export const flagsFromJson = (json: any): Flag[] => {
	let flags: Flag[] = [];
	for (let key in json) {
		flags.push(jsonToFlag(key, json[key]));
	}
	return flags;
};

const jsonToFlag = (key: string, json: any): Flag => {
	return {
		flag: key,
		default: json.default,
		usage: json.usage,
		value: valueToSupportedType(json.value)
	};
};

const valueToSupportedType = (value: any): boolean | string | number | string[] | number[] => {
	let type = typeof value;
	if (supportedValueTypes.includes(type) || isArrayOfStrings(value) || isArrayOfNumbers(value)) {
		return value;
	} else {
		return "";
	}
};

function isArrayOfStrings(value: any): value is string[] {
	return Array.isArray(value) && value.every((element) => typeof element === "string");
}

function isArrayOfNumbers(value: any): value is number[] {
	return Array.isArray(value) && value.every((element) => typeof element === "number");
}
