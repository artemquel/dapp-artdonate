import { Stack, Divider, Typography, Button } from "@mui/material";
import { PropsWithChildren, useEffect, useState } from "react";
import Jazzicon, { jsNumberForAddress } from "react-jazzicon";
import { CompareArrows } from "@mui/icons-material";
import { Link } from "react-router-dom";
type Props = {
  address: string | null;
  balance: number;
  exchangeRoute: string;
};

export const Sidebar = (props: PropsWithChildren<Props>): JSX.Element => {
  const { address, balance, exchangeRoute, children } = props;
  const [shortAddress, setShortAddress] = useState("");

  useEffect(() => {
    if (address) {
      const arAddress = Array.from(address);
      arAddress.splice(4, arAddress.length - 8, "...");
      setShortAddress(arAddress.join(""));
    }
  }, [address]);

  return (
    <Stack spacing={1}>
      <Stack alignItems={"center"}>
        <Jazzicon diameter={50} seed={jsNumberForAddress(address || "")} />
        <Typography variant={"caption"}>{shortAddress}</Typography>
        <Stack direction={"row"} alignItems={"center"} mt={2}>
          <Typography variant={"body2"} mr={1}>
            {balance} ARTD
          </Typography>
          <Button
            variant={"outlined"}
            size={"small"}
            sx={{ p: 0 }}
            component={Link}
            to={exchangeRoute}
          >
            <CompareArrows />
          </Button>
        </Stack>
      </Stack>
      <Divider />
      <Stack spacing={1}>{children}</Stack>
    </Stack>
  );
};
