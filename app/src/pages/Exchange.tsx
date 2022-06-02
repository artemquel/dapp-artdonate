import {
  ExchangeData,
  ExchangeDirection,
  Exchanger,
  Layout,
  TransactionTable,
} from "../components";
import { Grid, Paper, Stack, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  mintCoins,
  selectAddressExchangeEvents,
  selectDecimals,
  sellCoins,
} from "../store/contractReducer";
import { BigNumber, ethers } from "ethers";
import { useMoralis } from "react-moralis";

export const Exchange = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const decimals = useAppSelector(selectDecimals);
  const { account } = useMoralis();

  const transactions = useAppSelector(selectAddressExchangeEvents(account));

  const onExchange = async ({ direction, value }: ExchangeData) => {
    switch (direction) {
      case ExchangeDirection.FromToken:
        dispatch(sellCoins(value));
        break;
      case ExchangeDirection.ToToken:
        dispatch(mintCoins(value));
        break;
    }
  };

  return (
    <Layout>
      <Stack spacing={2}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant={"h4"}>Exchange</Typography>
          </Grid>
          <Grid item xs={12}>
            <Exchanger
              exchangeRate={
                1 /
                ethers.utils
                  .parseEther("1")
                  .div(BigNumber.from("10").pow(BigNumber.from(decimals)))
                  .toNumber()
              }
              onExchangeClick={onExchange}
            />
          </Grid>
        </Grid>

        {transactions.length ? (
          <>
            <Typography variant={"h4"}>History</Typography>
            <Paper sx={{ p: 2 }}>
              <TransactionTable
                transactions={transactions}
                decimals={decimals}
              />
            </Paper>
          </>
        ) : null}
      </Stack>
    </Layout>
  );
};
