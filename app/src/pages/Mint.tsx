import { ItemMintForm, Layout, MintData } from "../components";
import { Stack, Typography } from "@mui/material";
import { useAppDispatch } from "../app/hooks";
import { useMoralisFile } from "react-moralis";
import { mintItem } from "../store/contractReducer";

export const Mint = (): JSX.Element => {
  const dispatch = useAppDispatch();

  const { saveFile } = useMoralisFile();

  const onSubmit = async ({
    item,
    name,
    description,
    attributes,
  }: MintData) => {
    // use unknown type for access hash method of Moralis.File
    const itemHash = (
      (await saveFile(
        "image",
        { base64: item },
        { type: "base64", saveIPFS: true }
      )) as unknown as { hash: () => string }
    ).hash();

    const metadataHash = (
      (await saveFile(
        "image",
        {
          base64: btoa(
            JSON.stringify({
              attributes,
              description,
              name,
              image: `ipfs://${itemHash}`,
            })
          ),
        },
        { type: "base64", saveIPFS: true }
      )) as unknown as { hash: () => string }
    ).hash();

    dispatch(mintItem(metadataHash));
  };

  return (
    <Layout>
      <Stack spacing={2}>
        <Typography variant={"h4"}>Create new item</Typography>
        <ItemMintForm onSubmit={onSubmit} />
      </Stack>
    </Layout>
  );
};
