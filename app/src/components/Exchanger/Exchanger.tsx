import {
  Box,
  Button,
  Grid,
  Paper,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import { CurrencyInput, CurrencyType } from "./CurrencyInput";
import { Cached, InfoOutlined } from "@mui/icons-material";
import { grey } from "@mui/material/colors";
import { BigNumber, ethers } from "ethers";

export enum ExchangeDirection {
  ToToken,
  FromToken,
}

const directionToOrder = {
  [ExchangeDirection.ToToken]: [CurrencyType.ETH, CurrencyType.ARTD],
  [ExchangeDirection.FromToken]: [CurrencyType.ARTD, CurrencyType.ETH],
};

type Values = {
  [CurrencyType.ETH]: string | number;
  [CurrencyType.ARTD]: string | number;
};

export type ExchangeData = {
  direction: ExchangeDirection;
  value: BigNumber;
};

type Props = {
  exchangeRate: number;
  onExchangeClick: (result: ExchangeData) => void;
};

export const Exchanger = (props: Props): JSX.Element => {
  const theme = useTheme();

  const { onExchangeClick, exchangeRate } = props;

  const [direction, setDirection] = useState<ExchangeDirection>(
    ExchangeDirection.ToToken
  );

  const [fieldOrder, setFieldOrder] = useState<CurrencyType[]>(
    directionToOrder[ExchangeDirection.ToToken]
  );

  const [values, setValues] = useState<Values>({
    [CurrencyType.ETH]: 0,
    [CurrencyType.ARTD]: 0,
  });

  const onChange = (currency: CurrencyType) => (value: string) => {
    const numberValue = Number(value);

    let newValues: Values = {
      [CurrencyType.ETH]: 0,
      [CurrencyType.ARTD]: 0,
    };

    if (currency === CurrencyType.ARTD) {
      newValues = {
        [CurrencyType.ARTD]: value,
        [CurrencyType.ETH]: numberValue * exchangeRate,
      };
      setValues(newValues);
    } else if (currency === CurrencyType.ETH) {
      newValues = {
        [CurrencyType.ETH]: value,
        [CurrencyType.ARTD]: numberValue / exchangeRate,
      };
      setValues(newValues);
    }
  };

  const flipDirection = () => {
    direction === ExchangeDirection.ToToken
      ? setDirection(ExchangeDirection.FromToken)
      : setDirection(ExchangeDirection.ToToken);
  };

  const onClick = () => {
    onExchangeClick({
      direction,
      value: ethers.utils.parseEther(
        Number(values[CurrencyType.ETH]).toString()
      ),
    });
  };

  useEffect(() => {
    setFieldOrder(directionToOrder[direction]);
  }, [direction]);

  return (
    <Grid container spacing={2}>
      <Grid item xs={8}>
        <Stack spacing={-2}>
          <CurrencyInput
            onChange={onChange(fieldOrder[0])}
            value={values[fieldOrder[0]].toString()}
            currency={fieldOrder[0]}
          />
          <Box display={"flex"} justifyContent={"center"} zIndex={2}>
            <Button
              size={"large"}
              variant={"outlined"}
              style={{
                borderRadius: "50%",
                padding: "15px 15px",
                borderWidth: "2px",
                borderColor: theme.palette.primary.main,
                background: grey[800],
              }}
              onClick={flipDirection}
            >
              <Cached fontSize={"large"} color={"action"} />
            </Button>
          </Box>
          <CurrencyInput
            onChange={onChange(fieldOrder[1])}
            value={values[fieldOrder[1]].toString()}
            currency={fieldOrder[1]}
          />
        </Stack>
      </Grid>
      <Grid item xs={4}>
        <Paper sx={{ p: 2 }}>
          <InfoOutlined fontSize={"large"} />
          <Typography variant={"body2"}>
            Exchange rate: 1 ARTD = {exchangeRate} ETH
          </Typography>
        </Paper>
      </Grid>
      <Grid item xs={12}>
        <Button variant={"outlined"} size={"large"} onClick={onClick}>
          Exchange
        </Button>
      </Grid>
    </Grid>
  );
};
