import { detect } from "../src/index.js";
import { expect } from "chai";

describe("TORN detector test", () => {
  it("return empty array if no suspicious attacker address is available", async function () {
    const blockNumber = 14576841;
    const result = await detect(blockNumber);
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    expect(result).to.be.an("array").that.is.empty;
  });

  it("return C.R.E.A.M. Finance flash loan attacker address", async function () {
    const blockNumber = 13499638;
    const attackerAddress = "0x24354D31bC9D90F62FE5f2454709C32049cf866b";
    const result = await detect(blockNumber);
    expect(result[0]).to.equal(attackerAddress);
  });

  it("return Eminence attacker address", async function () {
    const blockNumber = 10954419;
    const attackerAddress = "0x223034EDbe95823c1160C16F26E3000315171cA9";
    const result = await detect(blockNumber);
    expect(result[0]).to.equal(attackerAddress);
  });
});
