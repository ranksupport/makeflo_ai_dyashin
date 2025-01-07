import { Flex, Icon } from "@chakra-ui/react";
import React from "react";
import { FaArrowDownShortWide } from "react-icons/fa6";
import { useDispatch } from "react-redux";
import {
  onCollapseEventConfig,
  setApiData,
} from "../../../store/slices/flowSlice";
import ReactSelect from "react-select";
import { selectStyle } from "./configuration";

export const ApiConfig = ({
  selectedEvent,
  selectedValue,
  collapseConfiguration,
  nodeOuter,
  node_id,
}) => {
  const dispatch = useDispatch();
  return (
    <Flex
      sx={{
        justifyContent: "space-between",
        borderRadius: "12px",
        gap: "20px",
        width: "100%",
        border: "1px solid #BDBDDA",
        p: "20px",
        flexDir: "column",
      }}
    >
      <Flex
        justifyContent="space-between"
        onClick={() =>
          dispatch(
            onCollapseEventConfig({
              node_id: node_id,
              status: !collapseConfiguration,
            })
          )
        }
        sx={{
          width: "100%",
          cursor: "pointer",
          "&:hover": {
            "#icon": {
              color: "#34454E",
            },
          },
        }}
      >
        <Flex>Configuration</Flex>
        <Icon
          as={FaArrowDownShortWide}
          id="icon"
          boxSize={"20px"}
          sx={{
            m: "auto 0px auto 0px",

            color: collapseConfiguration ? "#34454E" : "#ABB6C8",
            transform: collapseConfiguration ? "rotate(-180deg)" : "none",
            transition: "transform 0.3s",
          }}
        />
      </Flex>
      {!collapseConfiguration ? (
        <>
          <Flex
            onMouseDownCapture={() => (nodeOuter.current.id = "")}
            onMouseEnter={() => nodeOuter?.current.classList.add("nopan")}
            onMouseLeave={() => nodeOuter?.current.classList.remove("nopan")}
            width="100%"
          >
            <ReactSelect
              openMenuOnFocus
              blurInputOnSelect
              styles={selectStyle}
              value={selectedValue?.wrap_in_array || null}
              onBlur={() => (nodeOuter.current.id = "drag")}
              placeholder={"Wrap Request in Array"}
              options={[
                { id: 1, value: 1, label: "NO", name: "NO", selected: false },
                { id: 2, value: 2, label: "YES", name: "YES", selected: false },
              ]}
              onChange={(selected) => {
                dispatch(
                  setApiData({ value: selected, id: "Wrap", node_id: node_id })
                );
              }}
            />
          </Flex>
          <Flex
            onMouseDownCapture={() => (nodeOuter.current.id = "")}
            onMouseEnter={() => nodeOuter?.current.classList.add("nopan")}
            onMouseLeave={() => nodeOuter?.current.classList.remove("nopan")}
            width="100%"
          >
            <ReactSelect
              openMenuOnFocus
              blurInputOnSelect
              styles={selectStyle}
              value={selectedValue?.payload_type || null}
              onBlur={() => (nodeOuter.current.id = "drag")}
              placeholder={"Payload Type"}
              options={[
                {
                  id: 1,
                  value: 1,
                  label: "JSON",
                  name: "JSON",
                  selected: false,
                },
              ]}
              onChange={(selected) => {
                dispatch(
                  setApiData({
                    value: selected,
                    id: "Payload",
                    node_id: node_id,
                  })
                );
              }}
            />
          </Flex>
        </>
      ) : null}
    </Flex>
  );
};