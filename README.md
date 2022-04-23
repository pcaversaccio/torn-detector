# 🕵️‍♂️ TORN Detector

[![Test TORN detector](https://github.com/pcaversaccio/torn-detector/actions/workflows/test.yml/badge.svg)](https://github.com/pcaversaccio/torn-detector/actions/workflows/test.yml)
[![License: WTFPL](https://img.shields.io/badge/License-WTFPL-brightgreen.svg)](http://www.wtfpl.net/about)

Detect if a contract has been deployed in the latest (or predefined) block from an address that was previously funded through Tornado.Cash.

## Installation

It is recommended to install [Yarn](https://classic.yarnpkg.com) through the `npm` package manager, which comes bundled with [Node.js](https://nodejs.org) when you install it on your system. It is recommended to use a Node.js version `>= 16.0.0`.

Once you have `npm` installed, you can run the following both to install and upgrade Yarn:

```bash
npm install --global yarn
```

After having installed Yarn, simply run:

```bash
yarn install
```

## `.env` File

You must specify the RPC URL of your mainnet node as well as your Etherscan API key in the `.env` file:

```txt
ETH_MAINNET_URL=https://eth-mainnet.alchemyapi.io/v2/<your_api_key>
ETHERSCAN_API_KEY=6FECCD7C9B8C24...
```

## Testing

Simply run

```bash
yarn test
```
