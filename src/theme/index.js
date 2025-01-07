import { extendTheme, defineStyle, defineStyleConfig } from "@chakra-ui/react";
import { tooltipTheme } from "./tooltip";
import { inputTheme } from "./input";

const breakpoints = {
  sm: "1366px",
  md: "1440px",
  lg: "1600px",
  xl: "1920px",
  "2xl": "2560px",
};

export const theme = extendTheme({
  breakpoints,
  components: {
    Tooltip: tooltipTheme,
    Input: inputTheme,
  },
});
