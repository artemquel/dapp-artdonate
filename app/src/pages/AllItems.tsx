import { FilterChip, ItemCard, Layout } from "../components";
import { Grid, Stack, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { donate, selectAllItems } from "../store/contractReducer";
import { useMoralis } from "react-moralis";
import { FilterType, useItemFilter } from "../hooks";

export const AllItems = (): JSX.Element => {
  const items = useAppSelector(selectAllItems);
  const { account } = useMoralis();
  const dispatch = useAppDispatch();

  const {
    addFilter,
    deleteFilter,
    items: filteredItems,
  } = useItemFilter(items);

  return (
    <Layout>
      <Typography variant={"h4"} mb={2}>
        All items
      </Typography>
      <Grid container>
        <Grid item xs={1} />
        <Grid item xs={10}>
          <Stack direction={"row"} spacing={1} mb={1}>
            <FilterChip
              label={"My items"}
              type={FilterType.My}
              onAdd={addFilter}
              onDelete={deleteFilter}
            />
            <FilterChip
              label={"Earned less than 20 ARTD"}
              type={FilterType.DonationsLessThan20}
              onAdd={addFilter}
              onDelete={deleteFilter}
            />
            <FilterChip
              label={"Community items"}
              type={FilterType.CommunityItems}
              onAdd={addFilter}
              onDelete={deleteFilter}
            />
          </Stack>
          <Stack spacing={1}>
            {filteredItems.map(({ owner, uri, id, earned }) => (
              <ItemCard
                key={id}
                owner={owner}
                uri={uri}
                id={id}
                earned={earned}
                donateAvailable={
                  !(account?.toLowerCase() === owner.toLowerCase())
                }
                onDonate={(amount) => dispatch(donate({ itemId: id, amount }))}
              />
            ))}
          </Stack>
        </Grid>
        <Grid item xs={2} />
      </Grid>
    </Layout>
  );
};
