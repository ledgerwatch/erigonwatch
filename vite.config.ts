import react from "@vitejs/plugin-react";
//import { defineConfig } from "vite";
import { defineConfig } from "vitest/config";
import type { Plugin } from "vite";
import fs from "fs";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react(), reactVirtualized()],
	test: {
		globals: true,
		environment: "jsdom",
		setupFiles: ["./tests/setup.ts"]
	},
	build: {
		outDir: "./build"
	}
});

const WRONG_CODE = `import { bpfrpt_proptype_WindowScroller } from "../WindowScroller.js";`;
export function reactVirtualized(): Plugin {
	return {
		name: "flat:react-virtualized",
		// Note: we cannot use the `transform` hook here
		//       because libraries are pre-bundled in vite directly,
		//       plugins aren't able to hack that step currently.
		//       so instead we manually edit the file in node_modules.
		//       all we need is to find the timing before pre-bundling.
		configResolved() {
			const file = require
				.resolve("react-virtualized")
				.replace(path.join("dist", "commonjs", "index.js"), path.join("dist", "es", "WindowScroller", "utils", "onScroll.js"));
			const code = fs.readFileSync(file, "utf-8");
			const modified = code.replace(WRONG_CODE, "");
			fs.writeFileSync(file, modified);
		}
	};
}
