import { useEffect, useState } from "react";
import axios from "axios";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Chip,
  Divider,
  Grid,
  Paper,
  Skeleton,
  Stack,
  styled,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import Jazzicon, { jsNumberForAddress } from "react-jazzicon";
import { ExpandMore, ImageNotSupportedOutlined } from "@mui/icons-material";
import {
  BoostNumberAttribute,
  BoostPercentageAttribute,
  NumberAttribute,
} from "./AttributeTypes";
import { getHeightPx } from "../../utils";
import { DisplayType, ItemMetadata, ItemWithFeatures } from "../../types";
import config from "../../config.json";
import { DonationDialog } from "./DonationDialog";

const ItemCardImage = styled(Box)<{ image: string }>(({ image }) => ({
  width: "100%",
  height: "350px",
  backgroundImage: `url(${image})`,
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  backgroundSize: "contain",
}));

type Props = ItemWithFeatures & {
  donateAvailable: boolean;
  onDonate: (amount: number) => void;
};

export const ItemCard = (props: Props): JSX.Element => {
  const theme = useTheme();

  const { uri, owner, donateAvailable, onDonate, earned } = props;
  const [metadata, setMetadata] = useState<ItemMetadata | null>(null);
  const [image, setImage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [loadError, setLoadError] = useState<boolean>(false);

  useEffect(() => {
    if (uri) {
      setLoading(true);
      axios
        .get<ItemMetadata>(uri)
        .then(({ data }) => setMetadata(data))
        .catch(() => {
          setLoading(false);
          setLoadError(true);
        });
    }
  }, [uri]);

  useEffect(() => {
    if (metadata?.image) {
      axios
        .get(metadata.image.replace("ipfs://", config.ipfsGateway), {
          responseType: "blob",
        })
        .then(({ data }) => {
          const reader = new FileReader();
          reader.readAsDataURL(data);
          reader.onload = () => setImage(String(reader.result));
        })
        .catch(() => setLoadError(true))
        .finally(() => setLoading(false));
    }
  }, [metadata]);

  return (
    <Paper sx={{ p: 2 }}>
      <Stack spacing={2}>
        <Stack direction={"row"} alignItems={"center"} spacing={2}>
          <Jazzicon diameter={30} seed={jsNumberForAddress(owner)} />
          <Typography variant={"body2"} color={"info"} sx={{ flexGrow: 1 }}>
            <b>{owner}</b>
          </Typography>
          <Tooltip title={"Total donations"}>
            <Chip label={`${earned} ARTD`} />
          </Tooltip>
          {donateAvailable ? <DonationDialog onDonate={onDonate} /> : null}
        </Stack>
        <Divider />
        {loading ? (
          <Skeleton variant={"rectangular"} width={"100%"} height={350} />
        ) : loadError ? (
          <Box
            sx={{
              width: "100%",
              height: 350,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ImageNotSupportedOutlined
              sx={{ fontSize: 60 }}
              color={"primary"}
            />
          </Box>
        ) : (
          <ItemCardImage image={image} />
        )}

        {loading ? (
          <>
            <Skeleton
              variant={"text"}
              width={"50%"}
              height={getHeightPx("h5", theme)}
            />
            <Skeleton variant={"text"} height={getHeightPx("body2", theme)} />
            <Divider />
            <Skeleton variant={"text"} height={getHeightPx("h6", theme)} />
          </>
        ) : (
          <>
            <Typography variant={"h5"}>{metadata?.name}</Typography>
            <Typography variant={"body2"}>{metadata?.description}</Typography>
          </>
        )}

        {!loading && metadata?.attributes.length ? (
          <Accordion sx={{ boxShadow: "none" }}>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant={"h6"}>Attributes</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={1}>
                {metadata.attributes.map(
                  ({ trait_type, display_type, value }, index) => (
                    <Grid key={index} item xs={2}>
                      {
                        {
                          [DisplayType.Number]: (
                            <NumberAttribute value={value} label={trait_type} />
                          ),
                          [DisplayType.BoostNumber]: (
                            <BoostNumberAttribute
                              value={value}
                              label={trait_type}
                            />
                          ),
                          [DisplayType.BoostPercentage]: (
                            <BoostPercentageAttribute
                              value={value}
                              label={trait_type}
                            />
                          ),
                          [DisplayType.Date]: null,
                        }[display_type]
                      }
                    </Grid>
                  )
                )}
              </Grid>
            </AccordionDetails>
          </Accordion>
        ) : null}
      </Stack>
    </Paper>
  );
};
