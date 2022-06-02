import { useEffect, useState } from "react";
import {
  Box,
  Button,
  IconButton,
  MenuItem,
  Stack,
  TextField,
} from "@mui/material";
import { Clear } from "@mui/icons-material";
import _ from "lodash";
import { DisplayType, ItemAttribute } from "../../types";

interface ItemWithId extends ItemAttribute {
  id: number;
}

type Props = {
  onChange: (items: ItemAttribute[]) => void;
  max?: number;
};

const getMaxId = (items: any[]) =>
  items.reduce((acc, curr) => (curr?.id > acc ? curr?.id : acc), 0);

export const ItemAttributes = (props: Props): JSX.Element => {
  const { onChange, max = 5 } = props;

  const [items, setItems] = useState<ItemWithId[]>([]);

  const addItem = () => {
    if (items.length < max) {
      setItems((curItems) => [
        ...curItems,
        {
          trait_type: "",
          display_type: DisplayType.Number,
          value: "",
          id: getMaxId(curItems) + 1,
        },
      ]);
    }
  };

  const updateItem = (id: number, fields: Partial<ItemAttribute>) => {
    setItems((curItems) => {
      const itemToUpdateKey = curItems.findIndex((item) => item.id === id);
      if (itemToUpdateKey !== -1) {
        const newItems = [...curItems];
        newItems[itemToUpdateKey] = {
          ...curItems[itemToUpdateKey],
          ...fields,
          id,
        };
        return newItems;
      }
      return curItems;
    });
  };

  const removeItem = (id: number) => {
    if (items.length > 1) {
      setItems((curItems) => curItems.filter((item) => item.id !== id));
    }
  };

  useEffect(() => {
    addItem();
  }, []);

  useEffect(() => {
    onChange(
      items
        .filter((item) => item.value && item.trait_type)
        .map((item) => _.omit(item, "id"))
    );
  }, [items]);

  return (
    <Box>
      <Stack spacing={1.5} mb={1}>
        {items.map(({ id }) => (
          <Box key={id}>
            <Stack direction={"row"} spacing={1} alignItems={"center"}>
              <TextField
                label={"Type"}
                size={"small"}
                onChange={(e) => updateItem(id, { trait_type: e.target.value })}
              />
              <TextField
                label={"Value"}
                size={"small"}
                inputProps={{
                  type: "number",
                }}
                onChange={(e) => updateItem(id, { value: e.target.value })}
              />
              <TextField
                label={"Display as"}
                defaultValue={DisplayType.Number}
                size={"small"}
                onChange={(e) =>
                  updateItem(id, {
                    display_type: e.target.value as DisplayType,
                  })
                }
                select
              >
                <MenuItem value={DisplayType.Number}>Number</MenuItem>
                <MenuItem value={DisplayType.BoostPercentage}>
                  Boost percentage
                </MenuItem>
                <MenuItem value={DisplayType.BoostNumber}>
                  Boost number
                </MenuItem>
              </TextField>
              {items.length > 1 ? (
                <IconButton onClick={() => removeItem(id)}>
                  <Clear />
                </IconButton>
              ) : null}
            </Stack>
          </Box>
        ))}
      </Stack>
      {items.length < max ? (
        <Button variant={"outlined"} size={"small"} onClick={() => addItem()}>
          Add
        </Button>
      ) : null}
    </Box>
  );
};
