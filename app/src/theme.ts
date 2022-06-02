import { createTheme } from "@mui/material";
import {
  cyan,
  green,
  indigo,
  lightBlue,
  purple,
  teal,
} from "@mui/material/colors";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: teal[300],
    },
    secondary: {
      main: cyan[300],
    },
    error: {
      main: purple[300],
    },
    warning: {
      main: indigo[300],
    },
    info: {
      main: lightBlue[300],
    },
    success: {
      main: green[300],
    },
  },
});

export default theme;
