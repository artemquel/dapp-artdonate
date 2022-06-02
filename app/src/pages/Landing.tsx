import { Box, Button, IconButton, Stack, Typography } from "@mui/material";
import React from "react";
import { GitHub } from "@mui/icons-material";
import { Particles } from "../components";
import { useMoralis } from "react-moralis";

export const Landing = () => {
  const { authenticate } = useMoralis();
  const { provider } = useMoralis();
  return (
    <Stack sx={{ height: "100vh" }} p={2}>
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button
          variant={"contained"}
          size={"large"}
          disabled={!provider}
          onClick={() => authenticate()}
        >
          Connect MetaMask
        </Button>
      </Box>
      <Box flex={1}>
        <Particles />
      </Box>
      <Box>
        <Typography variant={"h1"} color={"primary"}>
          ArtDonate
        </Typography>
      </Box>
      <Box>
        <Typography variant={"h5"} color={"secondary"}>
          Receive donations for your creativity in <b>ARTD</b> token and convert
          them into ethers at any time
        </Typography>
      </Box>
      <Box>
        <IconButton
          component={"a"}
          target={"_blank"}
          href={"https://github.com/artemquel/artdonate"}
          size={"large"}
        >
          <GitHub fontSize={"large"} />
        </IconButton>
      </Box>
    </Stack>
  );
};
