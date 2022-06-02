import { BigNumber } from "ethers";

export const ethersToCoins = (ethers: BigNumber, decimals: number): BigNumber =>
  ethers.div(BigNumber.from(10).pow(BigNumber.from(decimals)));

export const coinsToEthers = (coins: BigNumber, decimals: number): BigNumber =>
  coins.mul(BigNumber.from(10).pow(BigNumber.from(decimals)));
