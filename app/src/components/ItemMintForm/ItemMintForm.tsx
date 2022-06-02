import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import { Dropzone } from "../Dropzone";
import { useState } from "react";
import { ItemAttribute } from "../../types";
import { ItemAttributes } from "./ItemAttributes";

export interface MintData {
  item: string;
  name: string;
  description: string;
  attributes?: ItemAttribute[];
}

type Props = {
  onSubmit: (data: MintData) => void;
};

export const ItemMintForm = (props: Props): JSX.Element => {
  const { onSubmit } = props;

  const [values, setValues] = useState<MintData>({
    item: "",
    name: "",
    description: "",
    attributes: [],
  });

  return (
    <Stack spacing={2}>
      <Box>
        <TextField
          helperText="Name of your item"
          label={"Name"}
          onChange={(e) =>
            setValues((state) => ({ ...state, name: e.target.value }))
          }
          fullWidth
        />
      </Box>

      <Box>
        <TextField
          helperText="Description of your item"
          label={"Desciption"}
          minRows={3}
          onChange={(e) =>
            setValues((state) => ({ ...state, description: e.target.value }))
          }
          multiline
          fullWidth
        />
      </Box>

      <Box>
        <Typography variant={"h6"} mb={1}>
          Item attributes
        </Typography>
        <ItemAttributes
          onChange={(attributes) =>
            setValues((state) => ({ ...state, attributes }))
          }
        />
      </Box>

      <Box>
        <Typography variant={"h6"} mb={1}>
          Item image
        </Typography>
        <Dropzone
          onChange={(item) => setValues((state) => ({ ...state, item }))}
        />
      </Box>

      <Box>
        <Button
          variant={"outlined"}
          disabled={!(values.item && values.item && values.description)}
          onClick={() => onSubmit(values)}
        >
          Mint item
        </Button>
      </Box>
    </Stack>
  );
};
