import { DonationHistory, ItemExpandable, Layout } from "../components";
import { Grid, Typography } from "@mui/material";
import { useAppSelector } from "../app/hooks";
import {
  selectAddressItems,
  selectDecimals,
  selectItemDonations,
} from "../store/contractReducer";
import { useMoralis } from "react-moralis";
import { BigNumber } from "ethers";

export const MyItems = (): JSX.Element => {
  const { account } = useMoralis();
  const items = useAppSelector(selectAddressItems(account));
  const donations = useAppSelector(selectItemDonations);
  const decimals = useAppSelector(selectDecimals);
  return (
    <Layout>
      <Typography variant={"h4"} mb={2}>
        My items
      </Typography>
      <Grid container spacing={2}>
        {items.map(({ id, earned }) => (
          <Grid key={id} item xs={6}>
            <ItemExpandable id={id} earned={earned}>
              <DonationHistory
                events={donations.filter((item) =>
                  item.args.itemId.eq(BigNumber.from(id))
                )}
                decimals={decimals}
              />
            </ItemExpandable>
          </Grid>
        ))}
      </Grid>
    </Layout>
  );
};
