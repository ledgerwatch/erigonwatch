import { Enode, Eth, Protocols, NodeInfo } from "../entities";

export const nodeInfoFromJsonLocal = (json: any): NodeInfo => {
	let parsedJSON = {
		eth: {
			network: 0,
			difficulty: 0,
			genesis: "",
			config: {}
		}
	};
	if (json.protocols) {
		const decodedString = atob(json.protocols);

		// Parse the decoded JSON
		parsedJSON = JSON.parse(decodedString);
	}

	let enodes: Enode[] = [];
	enodes.push({
		enode: json.enode || "",
		enr: json.enr || "",
		ports: {
			discovery: json.ports.discovery || 0,
			listener: json.ports.listener || 0
		},
		listener_addr: json.listener_addr || ""
	});

	return {
		id: json.id,
		name: json.name,
		protocols: jsonToProtocols(parsedJSON),
		enodes: jsonToEnodes(enodes)
	};
};

export const nodeInfoFromJson = (json: any): NodeInfo => {
	return {
		id: json.id,
		name: json.name,
		protocols: jsonToProtocols(json.protocols),
		enodes: jsonToEnodes(json.enodes)
	};
};

const jsonToProtocols = (json: any): Protocols => {
	return {
		eth: jsonToEth(json.eth)
	};
};

const jsonToEth = (json: any): Eth => {
	return {
		network: json.network,
		difficulty: json.difficulty,
		genesis: json.genesis,
		config: json.config
	};
};

const jsonToEnodes = (json: any): Enode[] => {
	let result: Enode[] = [];
	json.forEach((enode: any) => {
		result.push({
			enode: enode.enode,
			enr: enode.enr,
			ports: enode.ports,
			listener_addr: enode.listener_addr
		});
	});
	return result;
};
