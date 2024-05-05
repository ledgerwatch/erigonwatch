import { KeyValue } from "../app/store/appSlice";

export const syncStagesFromJson = (json: any): KeyValue[] => {
	let keys = Object.keys(json);
	let array: KeyValue[] = [];
	keys.forEach((key) => {
		array.push({ key: key, value: json[key] });
	});
	return array;
};
