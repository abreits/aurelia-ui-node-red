/**
 * Tests for server
 * Created by Ab on 2015-09-16.
 */
import * as Chai from "chai";
const expect = Chai.expect;

import server from "./server";

describe("Test server module", () => {
    it("should pass a trivial test", () => {
        expect(server).to.exist;
    });
});
