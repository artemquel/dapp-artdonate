import { PropsWithChildren } from "react";
import { Button, Container, Divider, Grid, Paper } from "@mui/material";
import { Sidebar } from "../Sidebar";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { routes } from "../../constants";
import { grey } from "@mui/material/colors";
import { Link } from "react-router-dom";
import { clear } from "../../store/ethersReducer";
import { selectBalance } from "../../store/contractReducer";
import { useMoralis } from "react-moralis";

export const Layout = (props: PropsWithChildren<{}>): JSX.Element => {
  const dispatch = useAppDispatch();

  const { logout, account } = useMoralis();
  const balance = useAppSelector(selectBalance(account));

  const { children } = props;

  const onLogout = () => {
    logout().then(() => dispatch(clear()));
  };

  return (
    <Container>
      <Paper sx={{ my: 3, p: 3 }}>
        <Grid container spacing={4}>
          <Grid item xs={2}>
            <Sidebar
              address={account}
              balance={balance || 0}
              exchangeRoute={routes.exchange}
            >
              <Button component={Link} to={routes.allItems}>
                Items feed
              </Button>
              <Button component={Link} to={routes.myItems}>
                My items
              </Button>
              <Button component={Link} to={routes.mint}>
                Create item
              </Button>
              <Divider />
              <Button onClick={onLogout}>Disconnect</Button>
            </Sidebar>
          </Grid>
          <Grid item xs={10}>
            <Paper elevation={2} sx={{ p: 2, background: grey[800] }}>
              {children}
            </Paper>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};
