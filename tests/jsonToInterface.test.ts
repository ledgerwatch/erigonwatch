import { describe, expect, test } from "vitest";
import { flagsFromJson } from "../src/helpers/flagsFromJson";
import { getFlagsResponseJsonMock } from "./mocks";

describe("jsonToInterface", () => {
	test("flags response parsing ", async () => {
		let result = flagsFromJson(getFlagsResponseJsonMock);
		expect(result).not.equal(undefined);

		expect(result[0].flag).equal("allow-insecure-unlock");
		expect(result[0].default).equal(true);
		expect(result[0].usage).equal("Allow insecure account unlocking when account-related RPCs are exposed by http");
		expect(result[0].value).toBeTypeOf("boolean");
		expect(result[0].value).equal(false);

		expect(result[1].flag).equal("authrpc.addr");
		expect(result[1].default).equal(true);
		expect(result[1].usage).equal("HTTP-RPC server listening interface for the Engine API");
		expect(result[1].value).toBeTypeOf("string");
		expect(result[1].value).equal("localhost");

		expect(result[3].flag).equal("authrpc.port");
		expect(result[3].default).equal(true);
		expect(result[3].usage).equal("HTTP-RPC server listening port for the Engine API");
		expect(result[3].value).toBeTypeOf("number");
		expect(result[3].value).equal(8551);

		// check if all values are of type boolean, string or number
		result.forEach((flag) => {
			expect(flag).not.equal(undefined);
			let type = typeof flag.value;
			expect(["boolean", "string", "number"]).include(type);
		});
	});
});
