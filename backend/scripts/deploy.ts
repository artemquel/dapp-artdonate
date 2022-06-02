// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";
import hre from "hardhat";
import * as fs from "fs-extra";

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  await hre.run("compile");

  // We get the contract to deploy
  const ArtDonate = await ethers.getContractFactory("ArtDonate");
  const artDonate = await ArtDonate.deploy();

  await artDonate.deployed();

  const config = await fs.readFile("../app/src/config.json", "utf8");

  await fs.writeFile(
    "../app/src/config.json",
    JSON.stringify({
      ...JSON.parse(config),
      contractAddress: artDonate.address,
    })
  );

  console.log("ArtDonate deployed to:", artDonate.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
