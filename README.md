# TORN Detector

Detect if a contract has been deployed in the latest block from an address that was previously funded through Tornado.Cash.

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

## Testing

Run

```bash
npx ts-node run.ts
```

The output result will be the C.R.E.A.M. Finance flash loan attacker contract [`0x24354D31bC9D90F62FE5f2454709C32049cf866b`](https://etherscan.io/address/0x24354D31bC9D90F62FE5f2454709C32049cf866b).
