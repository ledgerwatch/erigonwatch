import { NodeConnectionType } from "../app/store/connectionSlice";
import { store } from "../app/store/store";

export const isLocalVersion = (): boolean => {
	let connType = store.getState().connection.nodeConnectionType;
	return connType === NodeConnectionType.Local;
};
