import { Theme } from "@mui/material";
import { Variant } from "@mui/material/styles/createTypography";

export const getHeightPx = (type: Variant, theme: Theme) => {
  const remSize = theme.typography[type].fontSize;
  if (remSize) {
    return (
      Number(remSize.toString().replace("rem", "")) *
      theme.typography.htmlFontSize
    );
  }
  return theme.typography.htmlFontSize;
};
