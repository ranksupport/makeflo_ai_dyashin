import styled from "@emotion/styled";
import { Box, Button } from "@chakra-ui/react";

export const Flex = styled(Box)`
  display: flex;
`;

export const AppWrapper = styled(Box)`
  display: flex;
  width: 100%;
  height: 100vh;
  margin: 0px;
  overflow: hidden;
`;

export const VisualBuilderWrapper = styled(Box)`
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
  background-color: rgb(243, 247, 255);
  margin: 0px;
`;

export const EventWrapper = styled(Box)`
  display: ${(props) => (props.visibility ? "flex" : "none")};
  flex-direction: column;
  gap: 10px;
  margin-bottom: ${(props) => (props.last === "true" ? "10px" : "0px")};
  padding-right: ${(props) => (props.child === "true" ? "0px" : "16px")};
  padding-left: ${(props) => (props.child === "true" ? "0px" : "16px")};
`;

export const NodeOuter = styled(Box)`
  display: flex;
  cursor: default;
  background-color: #fff;
  border-radius: 6px;
  box-shadow: ${(props) =>
    props.selected
      ? "0px 0px 14px 0px rgb(81, 142, 248, 0.55)"
      : "0px 0px 3px 0px rgb(81, 142, 248, 0.35)"};
  border: 1px solid rgb(0, 0, 0, 0.15);
  position: relative;
  width: 360px;
  flex-direction: column;
  gap: 20px;
  padding-bottom: 16px;
  // min-height: 250px;
  &:hover {
    box-shadow: 0px 0px 14px 0px rgb(81, 142, 248, 0.55);
  }
`;

export const CaptureButton = styled(Button)`
  background-color: rgb(247, 197, 68);
  color: #fff;
  padding-top: 10px;
  padding-bottom: 10px;
  font-size: 16px;
  &:hover {
    background-color: rgb(340, 214, 0);
  }
`;
