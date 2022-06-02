import { TransferSingleEvent } from "../typechain/ArtDonate";

export const isTxExist = (
  transactions: TransferSingleEvent[],
  transaction: TransferSingleEvent
) =>
  !!transactions.find(
    ({ transactionHash }) => transactionHash === transaction.transactionHash
  );
