import { Box, Grid, IconButton, Tooltip, Typography } from "@mui/material";
import {
  ArrowCircleDown,
  ArrowCircleUp,
  ContentCopy,
} from "@mui/icons-material";
import copy from "copy-to-clipboard";

export enum TransactionType {
  Mint,
  Sell,
}

type Props = {
  hash: string;
  type: TransactionType;
  value: string;
  block: number;
};

export const TransactionRow = ({
  type,
  value,
  hash,
  block,
}: Props): JSX.Element => (
  <>
    <Grid item xs={1}>
      {type === TransactionType.Sell ? (
        <Tooltip title={"Sell"}>
          <ArrowCircleUp color={"warning"} />
        </Tooltip>
      ) : (
        <Tooltip title={"Purchase"}>
          <ArrowCircleDown color={"success"} />
        </Tooltip>
      )}
    </Grid>
    <Grid item xs={3} justifyContent={"center"}>
      <Box
        display={"flex"}
        alignItems={"center"}
        justifyContent={"space-between"}
      >
        <Typography component={"span"}>{value} ARTD </Typography>
      </Box>
    </Grid>
    <Grid item xs={3}>
      <Box display={"flex"} alignItems={"center"}>
        <IconButton size={"small"} onClick={() => copy(hash)}>
          <ContentCopy sx={{ fontSize: "12px" }} />
        </IconButton>
        <Typography noWrap>{hash}</Typography>
      </Box>
    </Grid>
    <Grid item xs={3} />
    <Grid item xs={2}>
      <Typography noWrap>{block}</Typography>
    </Grid>
  </>
);
