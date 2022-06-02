import { Badge, Box, styled, Typography } from "@mui/material";

const Circle = styled(Box)<{ d: number }>(({ d, theme }) => ({
  width: `${d}px`,
  height: `${d}px`,
  borderRadius: `${d / 2}px`,
  borderColor: theme.palette.primary.dark,

  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
}));

const CircleProgress = styled(Circle)<{ value: number }>(({ value, theme }) =>
  value > 50
    ? {
        backgroundColor: "#1e1e1e",
        backgroundImage: `
    linear-gradient(270deg, transparent 50%, ${
      theme.palette.primary.dark
    } 50%), 
    linear-gradient(${90 + 3.6 * (value - 50)}deg, ${
          theme.palette.primary.dark
        } 50%, transparent 50%)
  `,
      }
    : {
        backgroundColor: theme.palette.primary.dark,
        backgroundImage: `
    linear-gradient(90deg, transparent 50%, #1e1e1e 50%), 
    linear-gradient(${90 + 3.6 * value}deg, #1e1e1e 50%, transparent 50%)
  `,
      }
);

const ItemValue = styled(Badge)(({}) => ({
  "& .MuiBadge-badge": {
    right: 8,
    top: 8,
    borderColor: "#1e1e1e",
    borderWidth: "3px",
    borderStyle: "solid",
    fontSize: "15px",
    padding: "15px 8px",
  },
}));

type Props = {
  value: number | string;
  label: string;
};

export const NumberAttribute = (props: Props): JSX.Element => {
  const { value, label } = props;
  return (
    <ItemValue badgeContent={label} color={"info"}>
      <Circle d={80} sx={{ borderWidth: "2px", borderStyle: "solid" }}>
        <Circle d={70} sx={{ backgroundColor: "primary.light" }}>
          <Typography variant={"h6"} color={"warning.dark"}>
            <b>{value}</b>
          </Typography>
        </Circle>
      </Circle>
    </ItemValue>
  );
};

export const BoostPercentageAttribute = (props: Props): JSX.Element => {
  const { value, label } = props;
  return (
    <ItemValue badgeContent={label} color={"info"}>
      <CircleProgress d={82} value={Math.min(Number(value), 100)}>
        <Circle d={70} sx={{ backgroundColor: "primary.light" }}>
          <Typography variant={"h6"} color={"warning.dark"}>
            <b>{value}%</b>
          </Typography>
        </Circle>
      </CircleProgress>
    </ItemValue>
  );
};

export const BoostNumberAttribute = (props: Props): JSX.Element => {
  const { value, label } = props;
  return (
    <ItemValue badgeContent={label} color={"info"}>
      <Circle d={82} sx={{ backgroundColor: "primary.dark" }}>
        <Circle d={70} sx={{ backgroundColor: "primary.light" }}>
          <Typography variant={"h6"} color={"warning.dark"}>
            <b>{value}</b>
          </Typography>
        </Circle>
      </Circle>
    </ItemValue>
  );
};
