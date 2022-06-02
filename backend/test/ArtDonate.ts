import { ethers } from "hardhat";
import { expect } from "chai";
import { ArtDonate } from "../typechain";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

describe("ArtDonate", () => {
  let artDonate: ArtDonate;
  let contractOwner: SignerWithAddress;
  let signer1: SignerWithAddress;
  let signer2: SignerWithAddress;

  beforeEach(async () => {
    const ArtDonate = await ethers.getContractFactory("ArtDonate");
    artDonate = await ArtDonate.deploy();
    await artDonate.deployed();
    [contractOwner, signer1, signer2] = await ethers.getSigners();
  });

  it("Test mint coins by address 1", async function () {
    const initialBalance = await signer1.getBalance();

    const tx = await artDonate
      .connect(signer1)
      .mintCoins({ from: signer1.address, value: 10000 });

    const receipt = await tx.wait();
    const gasUsed = receipt.gasUsed.mul(receipt.effectiveGasPrice);

    expect(await artDonate.coinBalance(signer1.address)).to.equal(10000);
    expect(await signer1.getBalance()).to.equal(
      initialBalance.sub(10000).sub(gasUsed)
    );
  });

  it("Test sell coins by address 1", async function () {
    const initialBalance = await signer1.getBalance();

    const tx1 = await artDonate
      .connect(signer1)
      .mintCoins({ from: signer1.address, value: 10000 });

    const receipt1 = await tx1.wait();
    const gasUsed1 = receipt1.gasUsed.mul(receipt1.effectiveGasPrice);

    expect(await artDonate.coinBalance(signer1.address)).to.equal(10000);
    expect(await signer1.getBalance()).to.equal(
      initialBalance.sub(10000).sub(gasUsed1)
    );

    const tx2 = await artDonate.connect(signer1).sellCoins(10000);
    const receipt2 = await tx2.wait();
    const gasUsed2 = receipt2.gasUsed.mul(receipt2.effectiveGasPrice);

    expect(await signer1.getBalance()).to.equal(
      initialBalance.sub(gasUsed1).sub(gasUsed2)
    );
  });

  it("Test mint item by address 1", async function () {
    await artDonate.connect(signer1).mintItem("test");
    expect(await artDonate.ownerOf(1)).to.equal(signer1.address);
    expect(await artDonate.uri(1)).to.equal("https://ipfs.io/ipfs/test");
  });

  it("Test transfer coins from address 1 to address 2", async function () {
    await artDonate
      .connect(signer1)
      .mintCoins({ from: signer1.address, value: 10000 });
    expect(await artDonate.coinBalance(signer1.address)).to.equal(10000);

    await artDonate.connect(signer1).transferCoins(signer2.address, 2000);
    expect(await artDonate.coinBalance(signer2.address)).to.equal(2000);
  });

  it("Test transfer item from address 1 to address 2", async function () {
    await artDonate.connect(signer1).mintItem("test");
    await artDonate.connect(signer1).transferItem(signer2.address, 1);
    expect(await artDonate.ownerOf(1)).to.equal(signer2.address);
  });

  it("Test donate coins from address 2 to address 1", async function () {
    await artDonate.connect(signer1).mintItem("test");

    await artDonate
      .connect(signer2)
      .mintCoins({ from: signer2.address, value: 10000 });

    await artDonate.connect(signer2).donate(1, 3000);
    expect(await artDonate.coinBalance(signer1.address)).to.equal(3000);
  });
});
