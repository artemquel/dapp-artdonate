import { Chip, TextField, Tooltip } from "@mui/material";
import { ChangeEvent } from "react";

export enum CurrencyType {
  ARTD = "ARTD",
  ETH = "ETH",
}

type Props = {
  currency: CurrencyType;
  value: string;
  onChange: (value: string) => void;
  commissionValue?: number;
};

export const CurrencyInput = (props: Props): JSX.Element => {
  const { currency, value, onChange, commissionValue } = props;

  const _onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value: newValue },
    } = e;
    if (
      /^-?\d*\.?\d*$/.test(newValue) ||
      (!Number.isNaN(Number(newValue)) && Number(newValue) >= 0)
    ) {
      if (currency === CurrencyType.ETH) {
        onChange(newValue);
      } else {
        onChange(newValue);
      }
    }
  };

  return (
    <TextField
      variant={"outlined"}
      label={currency}
      name={currency}
      autoComplete={"off"}
      value={value}
      onChange={_onChange}
      InputProps={{
        endAdornment: commissionValue ? (
          <Tooltip title={"Withdrawal commission included"}>
            <Chip label={`- ${commissionValue} ${currency}`} />
          </Tooltip>
        ) : null,
      }}
    />
  );
};
