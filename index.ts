import * as dotenv from "dotenv";
import { ethers } from "ethers";
import fetch from "node-fetch";
import * as fs from "fs";

import {
  TORN_ADDRESS_100ETH,
  TORN_ADDRESS_10ETH,
  TORN_ADDRESS_1ETH,
  TORN_ADDRESS_01ETH,
} from "./addresses";

dotenv.config();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const initTransactions: Array<any> = []; // Array to track all deployer addresses from contract creation transactions.

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const susAddresses: Array<any> = []; // Array to track all suspicious deployer addresses that deployed via funds retrieved through Tornado.Cash.

const baseUrl =
  "https://api.etherscan.io/api?module=account&action=txlistinternal&address="; // Etherscan API base URL for internal transactions retrievals.

let selectedBlockNumber: number; // Variable that defines the selected block number to be analysed.

// Connecting to the Ethereum mainnet RPC.
const provider = new ethers.providers.JsonRpcProvider(
  process.env.ETH_MAINNET_URL
);

export async function main(blockNumber?: number) {
  if (blockNumber && blockNumber >= 0) {
    selectedBlockNumber = blockNumber; // Use the user-defined block number.
  } else {
    selectedBlockNumber = await provider.getBlockNumber(); // Get the latest block number.
  }

  // Get the latest block from the network, where `blockPayload` is an array of `TransactionResponse` objects.
  const blockPayload = await provider.getBlockWithTransactions(
    selectedBlockNumber
  );

  // Get all contract deployment transactions and store the deployer address in a separate array.
  for (let i = 0; i < blockPayload.transactions.length; ++i) {
    if (blockPayload.transactions[i].to === null) {
      let j = 0;
      initTransactions[j] = blockPayload.transactions[i].from;
      ++j;
    }
  }

  // Get all internal transactions of each deployer address.
  // Remember: An internal transaction is an action that is occurring within, or between, one or multiple smart contracts.
  // All Tornado.Cash transactions are tracked as internal transactions.
  for (let i = 0; i < initTransactions.length; ++i) {
    // Retrieve all internal transactions via the Etherscan API.
    const response = await fetch(
      `${baseUrl}${initTransactions[i]}&startblock=0&endblock=${selectedBlockNumber}&sort=asc&apikey=${process.env.ETHERSCAN_API_KEY}`
    );
    const res = await response.json();
    // Check if the internal transactions have been conducted by one of the Tornado Cash contract addresses.
    for (let j = 0; j < res.result.length; ++j) {
      let z = 0;
      const checksummedAddress = ethers.utils.getAddress(res.result[j].from); // We use checksummed Ethereum addresses.
      if (
        checksummedAddress === TORN_ADDRESS_100ETH ||
        checksummedAddress === TORN_ADDRESS_10ETH ||
        checksummedAddress === TORN_ADDRESS_1ETH ||
        checksummedAddress === TORN_ADDRESS_01ETH
      ) {
        susAddresses[z] = initTransactions[i];
        ++z;
      }
    }

    // Save the output.
    fs.writeFileSync("out.json", JSON.stringify(susAddresses));

    // Print the result including Etherscan link.
    const len = susAddresses.length;
    console.log(
      `\nThe following addresses deployed a contract at block number ${selectedBlockNumber} via funds retrieved through Tornado.Cash:\n`
    );
    for (let i = 0; i < len; ++i) {
      console.log(`- https://etherscan.io/address/${susAddresses[i]}\n`);
    }
  }
}
