import {
  Button,
  Flex,
  Input,
  List,
  ListItem,
 
  Text,
  Textarea,
  Tooltip,
} from "@chakra-ui/react";
import React, { memo, useState } from "react";
import { FaAngleDown, FaAngleRight } from "react-icons/fa6";
import { Handle, Position } from "reactflow";

export const ResponseContainer = ({ response }) => {
  return (
    <Flex flexDir="column" gap="10px">
      {response?.length>0 &&
        response.map((res, i) => {
          if (
          
            res.additional === true &&
            res.visible === true
          ){

            return (
              <Flex key={i} width="100%" gap="10px" position="relative">
                <CustomHandleLeft
                  type="target"
                  id={res.port.target}
                  targetLinked={res.targetLinked}
                />
                <Tooltip label={res.label} hasArrow>
                  <Flex
                    sx={{
                      border: "1px solid #BDBDDA",
                      borderRadius: "4px",
                      width: "30%",
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                      p: "5px",
                      bgColor: "#EDF2F7",
                    }}
                  >
                    {res.label}
                  </Flex>
                </Tooltip>
                <Tooltip label={typeof res?.value == "string"?res?.value :res.value?.value ?res?.value.value: null} hasArrow>
                  <Flex
                    sx={{
                      border: "1px solid #BDBDDA",
                      borderRadius: "4px",
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                      width: "70%",
                      p: "5px",
                    }}
                  >
                    {   typeof res?.value == "string"?res?.value:res.value?res.value.value:null}
                  </Flex>
                </Tooltip>
                <CustomHandleRight
                  type="source"
                  id={res.port.source}
                  sourceLinked={res.sourceLinked}
                />
              </Flex>
            )}
        })}
    </Flex>
  );
};

export const JsonView = memo(({ data, nodeOuter }) => {
  const isObject = (value) => typeof value === "object" && value !== null;
  const renderValue = (value) => {
    if (isObject(value)) {
      return <NestedObject data={value} />;
    } else {
      return (
        <Text sx={{ m: "auto 10px" }} className={`value-${typeof value}`}>
          {JSON.stringify(value)}
        </Text>
      );
    }
  };

  function NestedObject({ data }) {
    const [expanded, setExpanded] = useState(false);

    const toggleExpanded = () => {
      setExpanded((prevExpanded) => !prevExpanded);
    };

    return (
      <Flex flexDir="column" width="100%">
        {isObject(data) && (
          <Button
            size="sm"
            onClick={toggleExpanded}
            sx={{ m: "auto 0px", width: "8px", bgColor: "transparent" }}
          >
            {expanded ? <FaAngleDown scale={1.4} /> : <FaAngleRight />}
          </Button>
        )}
        {expanded && isObject(data) && (
          <List>
            {Object.entries(data).map(([key, value], index) => (
              <ListItem key={index} sx={{ display: "flex" }}>
                <Flex fontWeight="bold" mr="1" sx={{ m: "auto 10px" }}>
                  {key}:
                </Flex>
                {renderValue(value)}
              </ListItem>
            ))}
          </List>
        )}
      </Flex>
    );
  }

  return (
    <Flex
      width="100%"
      onMouseEnter={() => nodeOuter?.current.classList.add("nowheel")}
      onMouseLeave={() => nodeOuter?.current.classList.remove("nowheel")}
      sx={{ overflow: "auto", height: "100%", flexDir: "column" }}
    >
      <List>
        {Object.entries(data).map(([key, value], index) => (
          <ListItem key={index} sx={{ display: "flex", gap: "5px" }}>
            <Flex fontWeight="bold" mr="1" sx={{ m: "auto 10px" }}>
              {key}:
            </Flex>
            {isObject(value) ? (
              <NestedObject data={value} />
            ) : (
              <Text>{JSON.stringify(value)}</Text>
            )}
          </ListItem>
        ))}
      </List>
    </Flex>
  );
});

export const KeyValueView = memo(({ data, nodeOuter }) => {
  const [keyWidth, setKeyWidth] = useState(30);
  const [dragValue, setDragValue] = useState(0);
  const [valueWidth, setValueWidth] = useState("70%");
  function RenderData({ data, parentKey = "" }) {
    const renderValue = (value, key) => {
      if (typeof value === "object" && value !== null) {
        // Check if it's an array
        if (Array.isArray(value)) {
          return (
            <ul
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              {value.map((item, index) => (
                <Flex id="list_item" key={index} flexDir="column">
                  {renderValue(item, `${key}[${index}]`)}
                </Flex>
              ))}
            </ul>
          );
        } else {
          // It's a nested object
          return <RenderData data={value} parentKey={key} />;
        }
      } else {
        // It's a primitive value
        return (
          <Flex id="outer_flex">
            <Flex width="100%" id="inner_flex" position="relative" gap="10px">
              <Tooltip label={key.toString()} hasArrow>
                <Flex
                  width={`${keyWidth}%`}
                  readOnly
                  sx={{
                    border: "1px solid #BDBDDA",
                    borderRadius: "4px",

                    p: "5px",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    bgColor: "#EDF2F7",
                    "&:disabled": {
                      opacity: 1,
                    },
                  }}
                >
                  {key}
                </Flex>
              </Tooltip>
              <Tooltip label={value?.toString()} hasArrow>
                {value?.length > 42 ? (
                  <Textarea
                    isDisabled={true}
                    width={valueWidth}
                    readOnly
                    value={value}
                    sx={{
                      minHeight: "40px",
                      border: "1px solid #BDBDDA",
                      borderRadius: "4px",

                      p: "5px",
                      "&:disabled": {
                        opacity: 1,
                      },
                    }}
                  />
                ) : (
                  <Input
                    width={valueWidth}
                    readOnly
                    isDisabled={true}
                    value={value}
                    sx={{
                      border: "1px solid #BDBDDA",
                      borderRadius: "4px",
                      p: "5px",
                      bgColor: "#fff",
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                      "&:disabled": {
                        opacity: 1,
                      },
                    }}
                  />
                )}
              </Tooltip>
            </Flex>
          </Flex>
        );
      }
    };

    return (
      <Flex flexDir="column" gap="10px">
        {Object.entries(data).map(([key, value], index) => (
          <Flex key={index} flexDir="column">
            {renderValue(value, parentKey ? `${parentKey}.${key}` : key)}
          </Flex>
        ))}
      </Flex>
    );
  }
  return (
    <Flex
      // p="4"
      mb="4"
      width="100%"
      onMouseEnter={() => {
        nodeOuter?.current.classList.add("nopan");
        nodeOuter?.current.classList.add("nowheel");
      }}
      onMouseLeave={() => {
        nodeOuter?.current.classList.remove("nopan");
        nodeOuter?.current.classList.remove("nowheel");
      }}
      sx={{ overflow: "auto", height: "100%", flexDir: "column" }}
    >
      {/* <Flex
        draggable
        onDragStart={(e) => {
          setDragValue(e.clientX);
        }}
        onDrag={(e) => {
          setKeyWidth((c) => e.clientX - dragValue);
        }}
        sx={{}}
        pl={`${keyWidth}%`}
      >
        Move
      </Flex> */}
      <RenderData data={data} nodeOuter={nodeOuter} />{" "}
    </Flex>
  );
});

export const ResponseModal = ({ nodeOuter, response }) => {
  const [view, setView] = useState("key-value");
  return (
    <Flex
      sx={{
        height: nodeOuter.current?.getBoundingClientRect().height,
        minHeight: "550px",
        width: "600px",
        bgColor: "#fff",
        position: "absolute",
        left: 470,
        transformOrigin: "50% 50%",
        transition: "height 0.3s, width: 0.3s",
        bottom: "0px",
        p: "20px",
        borderRadius: "8px",
        border: "1px solid #BDBDDA",
        boxShadow: "0px 0px 6px -3px rgb(52,69,91)",
        flexDir: "column",
        gap: "20px",
      }}
    >
      <Flex width="100%" sx={{ height: "40px", zIndex: 0 }}>
        <Flex
          width="20%"
          onClick={() => setView("key-value")}
          sx={{
            border: view == "key-value" ? "1px solid #BDBDDA" : "none",
            borderBottom: view == "key-value" ? "none" : "1px solid #BDBDDA",
            borderTopLeftRadius: "8px",
            borderTopRightRadius: "8px",
            justifyContent: "center",
            alignItems: "center",
            cursor: "pointer",
          }}
        >
          Key-Value
        </Flex>
        <Flex
          width="20%"
          onClick={() => setView("json")}
          sx={{
            border: view == "key-value" ? "none" : "1px solid #BDBDDA",
            borderBottom: view == "key-value" ? "1px solid #BDBDDA" : "none",
            borderTopLeftRadius: "8px",
            borderTopRightRadius: "8px",
            justifyContent: "center",
            alignItems: "center",
            cursor: "pointer",
          }}
        >
          Json
        </Flex>
        <Flex width="60%" sx={{ borderBottom: "1px solid #BDBDDA" }} />
      </Flex>
      {view == "key-value" ? (
        <KeyValueView nodeOuter={nodeOuter} data={response} />
      ) : (
        <JsonView nodeOuter={nodeOuter} data={response} />
      )}
      <Flex
        sx={{
          position: "absolute",
          bottom: "40px",
          left: "-15px",
          width: "0px",
          height: "0px",
          borderTop: "10px solid transparent",
          borderRight: "15px solid #fff",
          borderBottom: "10px solid transparent",
        }}
      />
    </Flex>
  );
};

export const CustomHandleLeft = ({ type, id, targetLinked = false }) => {
  return (
    <>
      <Handle
        type={type}
        position={Position.Left}
        id={id}
        style={{
          height: "6px",
          width: "6px",
          outline: "3px solid #33455b",
          outlineOffset: "2px",
          right: "none",
          left: "-25px",
          borderRadius: "50%",
          backgroundColor: "#33455b",
          border: "none",
          zIndex: 1,
          visibility: targetLinked == true ? "visible" : "hidden",
        }}
      />
    </>
  );
};
export const CustomHandleRight = ({ type, id, sourceLinked }) => {
  return (
    <>
      <Handle
        type={type}
        position={Position.Right}
        id={id}
        style={{
          height: "6px",
          width: "6px",
          outline: "3px solid #33455b",
          outlineOffset: "2px",
          right: "-25px",
          left: "none",
          borderRadius: "50%",
          backgroundColor: "#33455b",
          border: "none",
          zIndex: 1,
          visibility: sourceLinked == true ? "visible" : "hidden",
        }}
      />
    </>
  );
};
