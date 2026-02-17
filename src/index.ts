import * as dotenv from "dotenv";
import { JsonRpcProvider, getAddress } from "ethers";
import { RequestInfo } from "node-fetch";
import * as fs from "fs";

import {
  TORN_ADDRESS_100ETH,
  TORN_ADDRESS_10ETH,
  TORN_ADDRESS_1ETH,
  TORN_ADDRESS_01ETH,
} from "./addresses.js";

dotenv.config({ quiet: true });

const baseUrl =
  "https://api.etherscan.io/v2/api?chainid=1&module=account&action=txlistinternal&address=";

const provider = new JsonRpcProvider(process.env.ETH_MAINNET_URL);

const dir = "./out";

export async function detect(blockNumber?: number) {
  // Determine which block to analyse.
  const selectedBlockNumber =
    blockNumber && blockNumber >= 0
      ? blockNumber
      : await provider.getBlockNumber();

  // Fetch the block transactions.
  const block = await provider.getBlock(selectedBlockNumber, true);
  if (!block) {
    console.error(`Block ${selectedBlockNumber} not found`);
    return [];
  }

  const blockPayload = block.prefetchedTransactions || [];

  // Collect all deployer addresses from contract creation transactions.
  const initTransactions = blockPayload
    .filter((tx) => tx.to === null)
    .map((tx) => tx.from);

  const susAddresses: string[] = [];

  // For each deployer, check the internal transactions via the Etherscan API.
  for (let i = 0; i < initTransactions.length; i++) {
    const deployer = initTransactions[i];
    const fetch = (url: RequestInfo) =>
      import("node-fetch").then(({ default: fetch }) => fetch(url));
    const response = (await fetch(
      `${baseUrl}${deployer}&startblock=0&endblock=${selectedBlockNumber}&sort=asc&apikey=${process.env.ETHERSCAN_API_KEY}`,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    )) as any;

    const res = await response.json();
    if (!res.result) continue;

    // Check if any internal transaction came from a Tornado Cash address.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const isSuspicious = res.result.some((tx: any) => {
      const checksummedAddress = getAddress(tx.from);
      return [
        TORN_ADDRESS_100ETH,
        TORN_ADDRESS_10ETH,
        TORN_ADDRESS_1ETH,
        TORN_ADDRESS_01ETH,
      ].includes(checksummedAddress);
    });

    if (isSuspicious) {
      susAddresses.push(deployer);
    }
  }

  // Ensure output directory exists.
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  // Write output JSON once.
  fs.writeFileSync(
    `${dir}/suspicious_address_block_number_${selectedBlockNumber}.json`,
    JSON.stringify(susAddresses, null, 2),
  );

  // Print results with the Etherscan links.
  if (susAddresses.length > 0) {
    console.log(
      `\nThe following addresses deployed a contract at block number ${selectedBlockNumber} via funds retrieved through Tornado.Cash:\n`,
    );
    susAddresses.forEach((addr) => {
      console.log(`- https://etherscan.io/address/${addr}\n`);
    });
  } else {
    console.log(
      `\nNo suspicious deployers found in block ${selectedBlockNumber}.`,
    );
  }

  return susAddresses;
}
