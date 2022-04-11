import { detect } from "../index";

// Cream Finance exploiter contract
detect(13499638).catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

// Use current block number
// detect().catch((error) => {
//   console.error(error);
//   process.exitCode = 1;
// });
