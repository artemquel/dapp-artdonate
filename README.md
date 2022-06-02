# ArtDonate
[View screens in Figma](https://www.figma.com/file/lsnideZpFtkrluwO7GXuIa/ArtDonate-screens?node-id=1:2)


An dApp that allows you to mint NFT and receive donations

## Backend

Uses the standard ERC-1155 token as a backend (because we need both fungible and non- fungible tokens), with additional methods for the simplify working with frontend. For internal payments we use ARTD service token.

### Hardhat

Hardhat is used to develop and debug a smart contract.

`npm run test` - run smart contract unit tests
`npm run deploy:local` - deploy smart contract to hardhat network, this will also update the smart contract address in the frontend config file
`npx hardhat copy-typings` - copy typechain typings to the application directory
`npx hardhat node` - start local hardhat network

### NFT tokens

The description of the metadata of the token is generated in accordance with the OpenSea specification, supports a link to the file, name, description and attributes of different types

### Service token ARTD

Needed for payments in the application, exchanged for ethers at the rate of 1 to 10000, based on the decimals (same as ERC-20 decimals) value of the smart contract (default 14)

## Frontend

Technologies used:

- Ethers.js for interaction with blockchain
- Moralis for authorization and uploading to IPFS
- MUI as component library
- Redux-toolkit for state management
- Typescript as language

### Configuration
`/app/src/config.json` example
```json
{
  "moralisServerUrl":"", // server url from Moralis dashboard  
  "moralisAppId":"" // app id from Moralis dashboard,  
  "contractAddress":"0x5FbDB2315678afecb367f032d93F642f64180aa3" // deployed contract address,  
  "ipfsGateway":"https://ipfs.io/ipfs/" // url of gateway for access to IPFS
}
```