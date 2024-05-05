/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_SERVER_RESPONSE_TYPE: string;
	// more env variables...
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
