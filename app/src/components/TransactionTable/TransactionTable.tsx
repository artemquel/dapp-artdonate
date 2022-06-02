import { Grid, Typography } from "@mui/material";
import { TransactionRow, TransactionType } from "./TransactionRow";
import { TransferSingleEvent } from "../../typechain/ArtDonate";
import { ethers } from "ethers";
import { ethersToCoins } from "../../utils";

type Props = {
  transactions: TransferSingleEvent[];
  decimals: number;
};

export const TransactionTable = ({
  transactions,
  decimals,
}: Props): JSX.Element => (
  <Grid container spacing={2}>
    <Grid item xs={1}>
      <Typography variant={"body1"}>Type</Typography>
    </Grid>
    <Grid item xs={3}>
      <Typography variant={"body1"}>Amount</Typography>
    </Grid>
    <Grid item xs={3}>
      <Typography variant={"body1"}>Tx hash</Typography>
    </Grid>
    <Grid item xs={3} />
    <Grid item xs={2}>
      <Typography variant={"body1"}>Block</Typography>
    </Grid>
    {transactions
      .map(({ blockNumber, transactionHash, args: { from, value } }) => ({
        type:
          from === ethers.constants.AddressZero
            ? TransactionType.Mint
            : TransactionType.Sell,
        value: ethersToCoins(value, decimals),
        transactionHash,
        blockNumber,
      }))
      .sort((a, b) => (a.blockNumber >= b.blockNumber ? -1 : 1))
      .map(({ type, value, transactionHash, blockNumber }) => (
        <TransactionRow
          key={transactionHash}
          hash={transactionHash}
          type={type}
          value={value.toString()}
          block={blockNumber}
        />
      ))}
  </Grid>
);
