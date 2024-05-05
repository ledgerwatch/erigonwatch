export interface Version {
	nodeVersion: string;
	supportVersion: string;
	codeVersion: string;
	gitCommit: string;
}

export interface Flag {
	flag: string;
	default: boolean;
	usage: string;
	value: boolean | string | number | string[] | number[];
}

export interface NodeInfo {
	id: string;
	name: string;
	protocols: Protocols;
	enodes: Enode[];
}

export interface Protocols {
	eth: Eth;
}

export interface Eth {
	network: number;
	difficulty: number;
	genesis: string;
	config: any;
}

export interface Enode {
	enode: string;
	enr: string;
	ports: Ports;
	listener_addr: string;
}

export interface Ports {
	discovery: number;
	listener: number;
}
