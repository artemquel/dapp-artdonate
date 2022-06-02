import { DonateEvent } from "../../typechain/ArtDonate";
import { Box, Chip, Stack, Typography } from "@mui/material";
import { ethersToCoins } from "../../utils";

type Props = {
  events?: DonateEvent[];
  decimals?: number;
};

export const DonationHistory = (props: Props): JSX.Element => {
  const { events = [], decimals = 18 } = props;
  if (!events.length) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Typography color={"primary"} variant={"overline"}>
          No donations
        </Typography>
      </Box>
    );
  }
  return (
    <Stack spacing={1}>
      {events.map((event) => (
        <Stack
          spacing={2}
          alignItems={"center"}
          key={event.transactionHash}
          direction={"row"}
        >
          <Chip
            variant={"outlined"}
            label={`+ ${ethersToCoins(event.args.amount, decimals)} ARTD`}
          />
          <Typography variant={"body2"} noWrap>
            From: ${event.args.donator}
          </Typography>
        </Stack>
      ))}
    </Stack>
  );
};
