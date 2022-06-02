import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Chip,
  Typography,
} from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import { PropsWithChildren } from "react";
type Props = { id: number; earned: number };

export const ItemExpandable = (
  props: PropsWithChildren<Props>
): JSX.Element => {
  const { children, id, earned } = props;
  return (
    <Accordion sx={{ boxShadow: "none" }}>
      <AccordionSummary expandIcon={<ExpandMore />}>
        <Typography variant={"h6"} sx={{ flexGrow: 1 }}>
          Item #{id}
        </Typography>
        <Chip variant={"outlined"} label={`Earned ${earned} ARTD`} />
      </AccordionSummary>
      <AccordionDetails>{children}</AccordionDetails>
    </Accordion>
  );
};
