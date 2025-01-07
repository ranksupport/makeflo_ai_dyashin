import React from "react";
import { Flex, Input,  Tooltip, Icon } from "@chakra-ui/react";
import { useDispatch } from "react-redux";
import styled from "@emotion/styled";
import { MentionInput } from "../../MentionInput";
import { TbInfoCircle, TbInfoCircleFilled } from "react-icons/tb";
import { handleToggle, onInputInMentionInput, resetConfig } from "../../../store/slices/flowSlice";
import { CustomHandleLeft, CustomHandleRight } from "./response";
export const InputContainerFormatter = ({
  result = [],
  nodeOuter,
  configResponses,
  data,
  options,
}) => {
  const dispatch = useDispatch();
  let selectOptions = options.flatMap((x, i) => {
    return x.options.map((opt) => {
      return {
        info: opt,
        display: opt.id,
        id: JSON.stringify(opt),
        appName: x.appName,
        index: i,
      };
    });
  });
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
      {configResponses?.map((c) => {
        if (c.visible === true && !c.additional) {
          return c.key_value_type === "input" ? (
            <>
              <Tooltip label={c.label} placement="top" hasArrow arrowSize={5}>
                <Flex>
                  <Icon
                    as={TbInfoCircleFilled}
                    id="icon"
                    boxSize={"20px"}
                    sx={{
                      m: "auto 0px auto 0px",
                      color: "##657279",
                    }}
                  />
                </Flex>
              </Tooltip>
              <Flex>
                <Input
                  width="100%"
                  onFocus={() => (nodeOuter.current.id = "")}
                  onBlur={() => (nodeOuter.current.id = "drag")}
                  placeholder={
                    c.label.includes("(")
                      ? c.label.slice(0, c.label.indexOf("("))
                      : c.label
                  }
                  onChange={(e) => {


                    dispatch(resetConfig({node_id:data.node_id,type:"Normal"}))
                    dispatch(
                      onInputInMentionInput({
                        input: e.target.value,
                        portInfo: c,
                      })
                    );
                    dispatch(handleToggle())
                  }}
                  value={XMLHttpRequestEventTarget?.value}
                />
              </Flex>
            </>
          ) : (
            <Flex
              width="100%"
              gap="5px"
              sx={{
                border: "1px solid #ABB6C8",
                borderRadius: "6px",
                pl: "5px",
                position: "relative",
              }}
            >
              <CustomHandleLeft
                type="target"
                id={c.port.target}
                targetLinked={c.targetLinked}
              />
              <Tooltip label={c.label} placement="top" hasArrow arrowSize={5}>
                <Flex>
                  <Icon
                    as={TbInfoCircle}
                    id="icon"
                    boxSize={"20px"}
                    sx={{
                      m: "9px 0px auto 0px",
                      color: "##657279",
                    }}
                  />
                </Flex>
              </Tooltip>
              <Flex width="100%">
                <MentionsInput
                  nodeOuter={nodeOuter}
                  onChange={(e) => {
                    dispatch(resetConfig({node_id:data.node_id,type:"Normal"}))
                    dispatch(
                      onInputInMentionInput({
                        input: e.target.value,
                        portInfo: c,
                      })
                    );
                    dispatch(handleToggle())

                  }}
                  placeholder={!c.dirty ? c.label : `${c.label}*`}
                  data={selectOptions ? selectOptions : []}
                  componentData={data}
                  value={c.value ? c.value : ""}
                />
              </Flex>
              <CustomHandleRight
                type="source"
                id={c.port.source}
                sourceLinked={c.sourceLinked}
              />
            </Flex>
          );
        }
      })}
    </Flex>
  );
};

export const MentionsInput = styled(MentionInput)`
  flex: 1;
  border: 0px;
  width: 100%;
  border-radius: 8px;
  box-sizing: border-box;
  border-radius: 4px;
  font-size: 16px;
  padding: 14px;

  resize: none;
  // background: ${(props) => (props.dirty ? "#FFF6F3" : "#f3f7ff")};
  border: ${(props) => (props.dirty ? "1px solid #F74545" : "0px")};
  &::placeholder {
    color: ${(props) => (props.dirty ? "#F74545" : "#000000")};
  }
  // &:disabled {
  //   background: #f3f7ff;
  // }
  box-sizing: border-box;
`;
