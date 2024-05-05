import statsjson from "./../../syncStats.json";

export const getSyncData = (idx: number): any => {
	if (Array.isArray(statsjson)) {
		return statsjson[idx];
	} else {
		return null;
	}
};
