import { FilterType } from "../../hooks";
import { Chip } from "@mui/material";
import { useEffect, useState } from "react";

type Props = {
  label: string;
  type: FilterType;
  onAdd: (type: FilterType) => void;
  onDelete: (type: FilterType) => void;
};

export const FilterChip = (props: Props): JSX.Element => {
  const { label, type, onAdd, onDelete } = props;

  const [toggled, setToggled] = useState(false);

  useEffect(() => {
    if (toggled) {
      onAdd(type);
    } else {
      onDelete(type);
    }
  }, [toggled]);

  return (
    <Chip
      variant={toggled ? "filled" : "outlined"}
      label={label}
      onClick={() => setToggled((state) => !state)}
    />
  );
};
