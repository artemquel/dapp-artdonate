import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useState } from "react";

type Props = {
  onDonate: (amount: number) => void;
};

export const DonationDialog = (props: Props): JSX.Element => {
  const { onDonate } = props;

  const [opened, setOpened] = useState<boolean>(false);
  const [amount, setAmount] = useState<number>(0);

  const onDonateClick = () => {
    onDonate(amount);
    setOpened(false);
  };

  return (
    <>
      <Button
        variant={"contained"}
        size={"small"}
        color={"success"}
        onClick={() => setOpened(true)}
      >
        Donate
      </Button>
      <Dialog open={opened} onClose={() => setOpened(false)}>
        <DialogTitle>Donation</DialogTitle>
        <DialogContent>
          <DialogContentText mb={2}>
            Specify the number of tokens you want to donate to the NFT owner
          </DialogContentText>
          <TextField
            label={"Amount"}
            inputProps={{
              type: "number",
            }}
            onChange={(e) => setAmount(Number(e.target.value))}
            autoFocus
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpened(false)}>Cancel</Button>
          <Button
            onClick={onDonateClick}
            disabled={!amount}
            variant={"contained"}
            color={"success"}
          >
            Donate
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
