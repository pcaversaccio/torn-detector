import { main } from "./index";

// Cream Finance exploiter contract
main(13499638).catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

// Use current block number
// main().catch((error) => {
//   console.error(error);
//   process.exitCode = 1;
// });
