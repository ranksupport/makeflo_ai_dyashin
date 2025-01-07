import { defineStyle, defineStyleConfig } from "@chakra-ui/react";

const baseStyle = {
  fontSize: 12,
  borderRadius: "4px",
  bgColor: "rgb(0,0,0,0.8)",
  py: "4px",
};
export const tooltipTheme = defineStyleConfig({ baseStyle });
