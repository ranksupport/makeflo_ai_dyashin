import { Flex, Icon, Input } from "@chakra-ui/react";
import React, { memo } from "react";
import { useDispatch } from "react-redux";
import {
  onCollapseEventConfig,
  setSchedulerData,
} from "../../../store/slices/flowSlice";
import { FaArrowDownShortWide } from "react-icons/fa6";
import { Tooltip } from "recharts";
import { TbInfoCircle } from "react-icons/tb";
import ReactSelect from "react-select";
const selectStyleWithNoBor = {
  container: (styles) => ({
    ...styles,
    width: "100%",
    "&:focus-visible": {
      outline: "none",
    },
  }),

  control: (styles) => ({
    ...styles,
    "&:hover": {
      outline: "none",
    },
    transition: "outline 0.15s",
    boxShadow: "none",
    minHeight: "40px",
    borderRadius: "8px",
    backgroundColor: "#fff",
    border: "none !important",
    fontSize: 16,
  }),
  valueContainer: (styles) => ({ ...styles }),
  singleValue: (styles) => ({ ...styles, color: "#000" }),
  indicatorSeparator: (styles) => ({ ...styles, display: "none" }),
  multiValue: (styles) => {
    return {
      ...styles,
      backgroundColor: "#fff",
      border: "1px solid #ABB6C8 !important",
    };
  },
};

export const SchConfiguration = memo(
  ({
    selectedEvent,
    collapseConfiguration,
    nodeOuter,
    selectedValue,
    node_id,
  }) => {
    const daysArray = [
      { label: "Sunday", value: "Sunday" },
      { label: "Monday", value: "Monday" },
      { label: "Tuesday", value: "Tuesday" },
      { label: "Wednesday", value: "Wednesday" },
      { label: "Thursday", value: "Thursday" },
      { label: "Friday", value: "Friday" },
      { label: "Saturday", value: "Saturday" },
    ];
    let datesArr = [];
    for (let i = 1; i < 32; i++) {
      datesArr.push({ label: i, value: i });
    }
    const intervalArr = [
      { label: "Minutes", value: "Minutes" },
      { label: "Hours", value: "Hours" },
      { label: "Days", value: "Days" },
      { label: "Weeks", value: "Weeks" },
    ];
    const dispatch = useDispatch();
    const helper = {
      setSchData: (e, type, label = "") => {
        dispatch(
          setSchedulerData({
            nodeId: node_id,
            value: type === "input" ? e.target.value : e,
            type,
            label,
          })
        );
      },
    };
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
          selectedEvent.name === "Once" ? (
            <Flex
              width="100%"
              gap="5px"
              sx={{
                border: "1px solid #ABB6C8",
                borderRadius: "6px",
                pl: "5px",
                position: "relative",
                justifyContent: "space-between",
              }}
            >
              <Tooltip
                label={"Date & Time"}
                placement="top"
                hasArrow
                arrowSize={5}
              >
                <Flex width="22px">
                  <Icon
                    as={TbInfoCircle}
                    id="icon"
                    boxSize={"20px"}
                    sx={{
                      m: "auto 0px auto 0px",
                      color: "##657279",
                    }}
                  />
                </Flex>
              </Tooltip>
              <Flex
                width="100%"
                onMouseDownCapture={() => (nodeOuter.current.id = "")}
                onMouseEnter={() => nodeOuter?.current.classList.add("nopan")}
                onMouseLeave={() =>
                  nodeOuter?.current.classList.remove("nopan")
                }
                sx={{ cursor: "pointer" }}
              >
                <Input
                  sx={{
                    border: "none !important",
                    "&:focus-visible": {
                      border: "none !important",
                      boxShadow: "none",
                      outline: "none",
                    },
                    outline: "none",
                  }}
                  placeholder="Select Date & Time"
                  type="datetime-local"
                  onBlur={() => (nodeOuter.current.id = "drag")}
                  value={selectedValue?.localData?.date || ""}
                  onChange={(e) => helper.setSchData(e, "input")}
                />
              </Flex>
            </Flex>
          ) : selectedEvent?.name === "Every day" ? (
            <Flex
              width="100%"
              gap="5px"
              sx={{
                border: "1px solid #ABB6C8",
                borderRadius: "6px",
                pl: "5px",
                position: "relative",
                justifyContent: "space-between",
              }}
            >
              <Tooltip label={"Time"} placement="top" hasArrow arrowSize={5}>
                <Flex width="22px">
                  <Icon
                    as={TbInfoCircle}
                    id="icon"
                    boxSize={"20px"}
                    sx={{
                      m: "auto 0px auto 0px",
                      color: "##657279",
                    }}
                  />
                </Flex>
              </Tooltip>
              <Flex
                width="100%"
                onMouseDownCapture={() => (nodeOuter.current.id = "")}
                onMouseEnter={() => nodeOuter?.current.classList.add("nopan")}
                onMouseLeave={() =>
                  nodeOuter?.current.classList.remove("nopan")
                }
                sx={{ cursor: "pointer" }}
              >
                <Input
                  sx={{
                    border: "none !important",
                    "&:focus-visible": {
                      border: "none !important",
                      boxShadow: "none",
                      outline: "none",
                    },
                    outline: "none",
                  }}
                  placeholder="Select Time"
                  type="time"
                  onBlur={() => (nodeOuter.current.id = "drag")}
                  value={selectedValue?.localData?.time || ""}
                  onChange={(e) => helper.setSchData(e, "input")}
                />
              </Flex>
            </Flex>
          ) : selectedEvent?.name === "Days of the week" ? (
            <Flex sx={{ width: "100%", flexDir: "column", gap: "20px" }}>
              <Flex
                width="100%"
                gap="5px"
                sx={{
                  border: "1px solid #ABB6C8",
                  borderRadius: "6px",
                  pl: "5px",
                  position: "relative",
                  justifyContent: "space-between",
                }}
              >
                <Tooltip label={"Day"} placement="top" hasArrow arrowSize={5}>
                  <Flex width="22px">
                    <Icon
                      as={TbInfoCircle}
                      id="icon"
                      boxSize={"20px"}
                      sx={{
                        m: "auto 0px auto 0px",
                        color: "##657279",
                      }}
                    />
                  </Flex>
                </Tooltip>
                <Flex
                  width="100%"
                  onMouseEnter={() => {
                    nodeOuter.current.id = "";
                    nodeOuter?.current.classList.add("nowheel");
                  }}
                  onMouseLeave={() => {
                    nodeOuter.current.id = "drag";
                    nodeOuter?.current.classList.remove("nowheel");
                  }}
                >
                  <ReactSelect
                    closeMenuOnSelect={false}
                    value={selectedValue?.localData?.days || []}
                    placeholder="Select Day"
                    isMulti
                    onBlur={() => (nodeOuter.current.id = "drag")}
                    onChange={(e) => helper.setSchData(e, "select")}
                    options={daysArray}
                    styles={selectStyleWithNoBor}
                  />
                </Flex>
              </Flex>
              <Flex
                width="100%"
                gap="5px"
                sx={{
                  border: "1px solid #ABB6C8",
                  borderRadius: "6px",
                  pl: "5px",
                  position: "relative",
                  justifyContent: "space-between",
                }}
              >
                <Tooltip label={"Time"} placement="top" hasArrow arrowSize={5}>
                  <Flex width="22px">
                    <Icon
                      as={TbInfoCircle}
                      id="icon"
                      boxSize={"20px"}
                      sx={{
                        m: "auto 0px auto 0px",
                        color: "##657279",
                      }}
                    />
                  </Flex>
                </Tooltip>
                <Flex
                  width="100%"
                  onMouseEnter={() => {
                    nodeOuter.current.id = "";
                    nodeOuter?.current.classList.add("nowheel");
                  }}
                  onMouseLeave={() => {
                    nodeOuter.current.id = "drag";
                    nodeOuter?.current.classList.remove("nowheel");
                  }}
                >
                  <Input
                    sx={{
                      border: "none !important",
                      "&:focus-visible": {
                        border: "none !important",
                        boxShadow: "none",
                        outline: "none",
                      },
                      outline: "none",
                    }}
                    onBlur={() => (nodeOuter.current.id = "drag")}
                    placeholder="Select Time"
                    type="time"
                    value={selectedValue?.localData?.time || ""}
                    onChange={(e) => helper.setSchData(e, "input")}
                  />
                </Flex>
              </Flex>
            </Flex>
          ) : selectedEvent?.name === "Days of the month" ? (
            <Flex sx={{ width: "100%", flexDir: "column", gap: "20px" }}>
              <Flex
                width="100%"
                gap="5px"
                sx={{
                  border: "1px solid #ABB6C8",
                  borderRadius: "6px",
                  pl: "5px",
                  position: "relative",
                  justifyContent: "space-between",
                }}
              >
                <Tooltip label={"Day"} placement="top" hasArrow arrowSize={5}>
                  <Flex width="22px">
                    <Icon
                      as={TbInfoCircle}
                      id="icon"
                      boxSize={"20px"}
                      sx={{
                        m: "auto 0px auto 0px",
                        color: "##657279",
                      }}
                    />
                  </Flex>
                </Tooltip>
                <Flex
                  width="100%"
                  onMouseEnter={() => {
                    nodeOuter.current.id = "";
                    nodeOuter?.current.classList.add("nowheel");
                  }}
                  onMouseLeave={() => {
                    nodeOuter.current.id = "drag";
                    nodeOuter?.current.classList.remove("nowheel");
                  }}
                >
                  <ReactSelect
                    closeMenuOnSelect={false}
                    value={selectedValue?.localData?.dates || []}
                    placeholder="Select Date"
                    isMulti
                    onBlur={() => (nodeOuter.current.id = "drag")}
                    onChange={(e) => helper.setSchData(e, "select")}
                    options={datesArr}
                    styles={selectStyleWithNoBor}
                  />
                </Flex>
              </Flex>
              <Flex
                width="100%"
                gap="5px"
                sx={{
                  border: "1px solid #ABB6C8",
                  borderRadius: "6px",
                  pl: "5px",
                  position: "relative",
                  justifyContent: "space-between",
                }}
              >
                <Tooltip label={"Time"} placement="top" hasArrow arrowSize={5}>
                  <Flex width="22px">
                    <Icon
                      as={TbInfoCircle}
                      id="icon"
                      boxSize={"20px"}
                      sx={{
                        m: "auto 0px auto 0px",
                        color: "##657279",
                      }}
                    />
                  </Flex>
                </Tooltip>
                <Flex
                  width="100%"
                  onMouseEnter={() => {
                    nodeOuter.current.id = "";
                    nodeOuter?.current.classList.add("nowheel");
                  }}
                  onMouseLeave={() => {
                    nodeOuter.current.id = "drag";
                    nodeOuter?.current.classList.remove("nowheel");
                  }}
                >
                  <Input
                    sx={{
                      border: "none !important",
                      "&:focus-visible": {
                        border: "none !important",
                        boxShadow: "none",
                        outline: "none",
                      },
                      outline: "none",
                    }}
                    placeholder="Select Time"
                    type="time"
                    onBlur={() => (nodeOuter.current.id = "drag")}
                    value={selectedValue?.localData?.time || ""}
                    onChange={(e) => helper.setSchData(e, "input")}
                  />
                </Flex>
              </Flex>
            </Flex>
          ) : selectedEvent?.name === "At regular intervals" ? (
            <Flex sx={{ width: "100%", gap: "20px", flexDir: "column" }}>
              <Flex
                width="100%"
                gap="5px"
                sx={{
                  border: "1px solid #ABB6C8",
                  borderRadius: "6px",
                  pl: "5px",
                  position: "relative",
                  justifyContent: "space-between",
                }}
              >
                <Tooltip
                  label={"Time Span"}
                  placement="top"
                  hasArrow
                  arrowSize={5}
                >
                  <Flex width="22px">
                    <Icon
                      as={TbInfoCircle}
                      id="icon"
                      boxSize={"20px"}
                      sx={{
                        m: "auto 0px auto 0px",
                        color: "##657279",
                      }}
                    />
                  </Flex>
                </Tooltip>
                <Flex
                  width="100%"
                  onMouseEnter={() => {
                    nodeOuter.current.id = "";
                    nodeOuter?.current.classList.add("nowheel");
                  }}
                  onMouseLeave={() => {
                    nodeOuter.current.id = "drag";
                    nodeOuter?.current.classList.remove("nowheel");
                  }}
                >
                  <ReactSelect
                    value={selectedValue?.localData?.timespan || null}
                    placeholder="Select Time Span"
                    onBlur={() => (nodeOuter.current.id = "drag")}
                    onChange={(e) => helper.setSchData(e, "select", "timespan")}
                    options={intervalArr}
                    styles={selectStyleWithNoBor}
                  />
                </Flex>
              </Flex>
              {selectedValue?.time_span === "Minutes" ? (
                <>
                  <Flex
                    width="100%"
                    gap="5px"
                    sx={{
                      border: "1px solid #ABB6C8",
                      borderRadius: "6px",
                      pl: "5px",
                      position: "relative",
                      justifyContent: "space-between",
                    }}
                  >
                    <Tooltip
                      label={"Every"}
                      placement="top"
                      hasArrow
                      arrowSize={5}
                    >
                      <Flex width="22px">
                        <Icon
                          as={TbInfoCircle}
                          id="icon"
                          boxSize={"20px"}
                          sx={{
                            m: "auto 0px auto 0px",
                            color: "##657279",
                          }}
                        />
                      </Flex>
                    </Tooltip>
                    <Flex
                      width="100%"
                      onMouseEnter={() => {
                        nodeOuter.current.id = "";
                        nodeOuter?.current.classList.add("nowheel");
                      }}
                      onMouseLeave={() => {
                        nodeOuter.current.id = "drag";
                        nodeOuter?.current.classList.remove("nowheel");
                      }}
                    >
                      <Input
                        sx={{
                          border: "none !important",
                          "&:focus-visible": {
                            border: "none !important",
                            boxShadow: "none",
                            outline: "none",
                          },
                          outline: "none",
                        }}
                        onBlur={() => (nodeOuter.current.id = "drag")}
                        placeholder="Any value between 1 to 59"
                        type="number"
                        value={selectedValue?.localData?.every || ""}
                        onChange={(e) =>
                          helper.setSchData(e, "input", "minute")
                        }
                      />
                    </Flex>
                  </Flex>
                </>
              ) : selectedValue?.time_span === "Hours" ? (
                <>
                  <Flex
                    width="100%"
                    gap="5px"
                    sx={{
                      border: "1px solid #ABB6C8",
                      borderRadius: "6px",
                      pl: "5px",
                      position: "relative",
                      justifyContent: "space-between",
                    }}
                  >
                    <Tooltip
                      label={"Every"}
                      placement="top"
                      hasArrow
                      arrowSize={5}
                    >
                      <Flex width="22px">
                        <Icon
                          as={TbInfoCircle}
                          id="icon"
                          boxSize={"20px"}
                          sx={{
                            m: "auto 0px auto 0px",
                            color: "##657279",
                          }}
                        />
                      </Flex>
                    </Tooltip>
                    <Flex
                      width="100%"
                      onMouseEnter={() => {
                        nodeOuter.current.id = "";
                        nodeOuter?.current.classList.add("nowheel");
                      }}
                      onMouseLeave={() => {
                        nodeOuter.current.id = "drag";
                        nodeOuter?.current.classList.remove("nowheel");
                      }}
                    >
                      <Input
                        sx={{
                          border: "none !important",
                          "&:focus-visible": {
                            border: "none !important",
                            boxShadow: "none",
                            outline: "none",
                          },
                          outline: "none",
                        }}
                        onBlur={() => (nodeOuter.current.id = "drag")}
                        placeholder="Any value between 1 to 24"
                        type="number"
                        value={selectedValue?.localData?.every || ""}
                        onChange={(e) => helper.setSchData(e, "input", "hour")}
                      />
                    </Flex>
                  </Flex>
                </>
              ) : selectedValue?.time_span === "Days" ? (
                <>
                  <Flex
                    width="100%"
                    gap="5px"
                    sx={{
                      border: "1px solid #ABB6C8",
                      borderRadius: "6px",
                      pl: "5px",
                      position: "relative",
                      justifyContent: "space-between",
                    }}
                  >
                    <Tooltip
                      label={"Every"}
                      placement="top"
                      hasArrow
                      arrowSize={5}
                    >
                      <Flex width="22px">
                        <Icon
                          as={TbInfoCircle}
                          id="icon"
                          boxSize={"20px"}
                          sx={{
                            m: "auto 0px auto 0px",
                            color: "##657279",
                          }}
                        />
                      </Flex>
                    </Tooltip>
                    <Flex
                      width="100%"
                      sx={{ gap: "20px", flexDir: "column" }}
                      onMouseEnter={() => {
                        nodeOuter.current.id = "";
                        nodeOuter?.current.classList.add("nowheel");
                      }}
                      onMouseLeave={() => {
                        nodeOuter.current.id = "drag";
                        nodeOuter?.current.classList.remove("nowheel");
                      }}
                    >
                      <Input
                        sx={{
                          border: "none !important",
                          "&:focus-visible": {
                            border: "none !important",
                            boxShadow: "none",
                            outline: "none",
                          },
                          outline: "none",
                        }}
                        onBlur={() => (nodeOuter.current.id = "drag")}
                        placeholder="Between number of days"
                        type="number"
                        value={selectedValue?.localData?.every || ""}
                        onChange={(e) => helper.setSchData(e, "input", "days")}
                      />
                    </Flex>
                  </Flex>
                  <Flex
                    width="100%"
                    gap="5px"
                    sx={{
                      border: "1px solid #ABB6C8",
                      borderRadius: "6px",
                      pl: "5px",
                      position: "relative",
                      justifyContent: "space-between",
                    }}
                  >
                    <Tooltip
                      label={"Every"}
                      placement="top"
                      hasArrow
                      arrowSize={5}
                    >
                      <Flex width="22px">
                        <Icon
                          as={TbInfoCircle}
                          id="icon"
                          boxSize={"20px"}
                          sx={{
                            m: "auto 0px auto 0px",
                            color: "##657279",
                          }}
                        />
                      </Flex>
                    </Tooltip>
                    <Flex
                      width="100%"
                      sx={{ gap: "20px", flexDir: "column" }}
                      onMouseEnter={() => {
                        nodeOuter.current.id = "";
                        nodeOuter?.current.classList.add("nowheel");
                      }}
                      onMouseLeave={() => {
                        nodeOuter.current.id = "drag";
                        nodeOuter?.current.classList.remove("nowheel");
                      }}
                    >
                      <Input
                        sx={{
                          border: "none !important",
                          "&:focus-visible": {
                            border: "none !important",
                            boxShadow: "none",
                            outline: "none",
                          },
                          outline: "none",
                        }}
                        onBlur={() => (nodeOuter.current.id = "drag")}
                        placeholder="Select Time"
                        type="time"
                        value={selectedValue?.localData?.time || ""}
                        onChange={(e) => helper.setSchData(e, "input", "time")}
                      />
                    </Flex>
                  </Flex>
                </>
              ) : selectedValue?.time_span === "Weeks" ? (
                <>
                  <Flex
                    width="100%"
                    gap="5px"
                    sx={{
                      border: "1px solid #ABB6C8",
                      borderRadius: "6px",
                      pl: "5px",
                      position: "relative",
                      justifyContent: "space-between",
                      flexDir: "column",
                    }}
                  >
                    <Tooltip
                      label={"Every"}
                      placement="top"
                      hasArrow
                      arrowSize={5}
                    >
                      <Flex width="22px">
                        <Icon
                          as={TbInfoCircle}
                          id="icon"
                          boxSize={"20px"}
                          sx={{
                            m: "auto 0px auto 0px",
                            color: "##657279",
                          }}
                        />
                      </Flex>
                    </Tooltip>
                    <Flex
                      width="100%"
                      onMouseEnter={() => {
                        nodeOuter.current.id = "";
                        nodeOuter?.current.classList.add("nowheel");
                      }}
                      onMouseLeave={() => {
                        nodeOuter.current.id = "drag";
                        nodeOuter?.current.classList.remove("nowheel");
                      }}
                    >
                      <ReactSelect
                        onBlur={() => (nodeOuter.current.id = "drag")}
                        closeMenuOnSelect={false}
                        value={selectedValue?.localData?.days || []}
                        placeholder="Select Day"
                        isMulti
                        onChange={(e) => helper.setSchData(e, "select", "week")}
                        options={daysArray}
                        styles={selectStyleWithNoBor}
                      />
                    </Flex>
                  </Flex>{" "}
                  <Flex
                    width="100%"
                    gap="5px"
                    sx={{
                      border: "1px solid #ABB6C8",
                      borderRadius: "6px",
                      pl: "5px",
                      position: "relative",
                      justifyContent: "space-between",
                      flexDir: "column",
                    }}
                  >
                    <Tooltip
                      label={"Every"}
                      placement="top"
                      hasArrow
                      arrowSize={5}
                    >
                      <Flex width="22px">
                        <Icon
                          as={TbInfoCircle}
                          id="icon"
                          boxSize={"20px"}
                          sx={{
                            m: "auto 0px auto 0px",
                            color: "##657279",
                          }}
                        />
                      </Flex>
                    </Tooltip>

                    <Flex
                      width="100%"
                      onMouseEnter={() => {
                        nodeOuter.current.id = "";
                        nodeOuter?.current.classList.add("nowheel");
                      }}
                      onMouseLeave={() => {
                        nodeOuter.current.id = "drag";
                        nodeOuter?.current.classList.remove("nowheel");
                      }}
                    >
                      <Input
                        sx={{
                          border: "none !important",
                          "&:focus-visible": {
                            border: "none !important",
                            boxShadow: "none",
                            outline: "none",
                          },
                          outline: "none",
                        }}
                        onBlur={() => (nodeOuter.current.id = "drag")}
                        placeholder="Select Time"
                        type="time"
                        value={selectedValue?.localData?.time || ""}
                        onChange={(e) => helper.setSchData(e, "input", "time")}
                      />
                    </Flex>
                  </Flex>
                </>
              ) : null}
            </Flex>
          ) : null
        ) : null}
      </Flex>
    );
  }
);
// {
//   selectedEvent.name === "Once" ? (
//     <Flex
//       width="100%"
//       gap="5px"
//       sx={{
//         border: "1px solid #ABB6C8",
//         borderRadius: "6px",
//         pl: "5px",
//         position: "relative",
//       }}
//     >
//       <Tooltip label={"Date & Time"} placement="top" hasArrow arrowSize={5}>
//         <Flex>
//           <Icon
//             as={TbInfoCircle}
//             id="icon"
//             boxSize={"20px"}
//             sx={{
//               m: "auto 0px auto 0px",
//               color: "##657279",
//             }}
//           />
//         </Flex>
//       </Tooltip>
//       <Flex
//         width="100%"
//         onMouseDownCapture={() => (nodeOuter.current.id = "")}
//         onMouseEnter={() => nodeOuter?.current.classList.add("nopan")}
//         onMouseLeave={() => nodeOuter?.current.classList.remove("nopan")}
//       >
//         <Input
//           sx={{ bgColor: "#f3f7ff", border: "1px solid #b7c9ff" }}
//           placeholder="Select Date & Time"
//           size="md"
//           type="datetime-local"
//           value={data.selectedValue?.localData?.date || ""}
//           onChange={(e) => helper.setSchData(e, "input")}
//         />
//       </Flex>
//     </Flex>
//   ) : //   <Flex sx={{ fontWeight: 500 }}>
//   //     {t("konnect.sidebar.scheduler.date_time")}
//   //   </Flex>
//   // <Input
//   //   sx={{ bgColor: "#f3f7ff", border: "1px solid #b7c9ff" }}
//   //   placeholder="Select Date & Time"
//   //   size="md"
//   //   type="datetime-local"
//   //   value={data.selectedValue?.localData?.date || ""}
//   //   onChange={(e) => helper.setSchData(e, "input")}
//   // />
//   selectedEvent?.name === "Every day" ? (
//     <EventWrapper visibility={true}>
//       <Flex sx={{ fontWeight: 500 }}>
//         {t("konnect.sidebar.scheduler.time")}
//       </Flex>
//       <Input
//         sx={{ bgColor: "#f3f7ff", border: "1px solid #b7c9ff" }}
//         placeholder="Select Time"
//         size="md"
//         type="time"
//         value={data.selectedValue?.localData?.time || ""}
//         onChange={(e) => helper.setSchData(e, "input")}
//       />
//     </EventWrapper>
//   ) : selectedEvent?.name === "Days of the week" ? (
//     <EventWrapper visibility={true}>
//       <Flex sx={{ fontWeight: 500 }}>
//         {t("konnect.sidebar.scheduler.days")}
//       </Flex>
//       <Flex
//         onMouseEnter={() => {
//           nodeOuter.current.id = "";
//           nodeOuter?.current.classList.add("nowheel");
//         }}
//         onMouseLeave={() => {
//           nodeOuter.current.id = "drag";
//           nodeOuter?.current.classList.remove("nowheel");
//         }}
//       >
//         <ReactSelect
//           closeMenuOnSelect={false}
//           value={data.selectedValue?.localData?.days || []}
//           placeholder="Select Day"
//           isMulti
//           onChange={(e) => helper.setSchData(e, "select")}
//           options={daysArray}
//           styles={selectStyle}
//         />
//       </Flex>

//       <Flex sx={{ fontWeight: 500 }}>
//         {t("konnect.sidebar.scheduler.time")}
//       </Flex>
//       <Input
//         sx={{ bgColor: "#f3f7ff", border: "1px solid #b7c9ff" }}
//         placeholder="Select Time"
//         size="md"
//         type="time"
//         value={data.selectedValue?.localData?.time || ""}
//         onChange={(e) => helper.setSchData(e, "input")}
//       />
//     </EventWrapper>
//   ) : selectedEvent?.name === "Days of the month" ? (
//     <EventWrapper visibility={true}>
//       <Flex sx={{ fontWeight: 500 }}>
//         {t("konnect.sidebar.scheduler.dates")}
//       </Flex>
//       <Flex
//         onMouseEnter={() => {
//           nodeOuter.current.id = "";
//           nodeOuter?.current.classList.add("nowheel");
//         }}
//         onMouseLeave={() => {
//           nodeOuter.current.id = "drag";
//           nodeOuter?.current.classList.remove("nowheel");
//         }}
//       >
//         <ReactSelect
//           closeMenuOnSelect={false}
//           value={data.selectedValue?.localData?.dates || null}
//           placeholder="Select Date"
//           isMulti
//           onChange={(e) => helper.setSchData(e, "select")}
//           options={datesArr}
//           styles={selectStyle}
//         />
//       </Flex>

//       <Flex sx={{ fontWeight: 500 }}>
//         {t("konnect.sidebar.scheduler.time")}
//       </Flex>
//       <Input
//         sx={{ bgColor: "#f3f7ff", border: "1px solid #b7c9ff" }}
//         placeholder="Select Time"
//         size="md"
//         type="time"
//         value={data.selectedValue?.localData?.time || ""}
//         onChange={(e) => helper.setSchData(e, "input")}
//       />
//     </EventWrapper>
//   ) : data.selectedEvent?.name === "At regular intervals" ? (
//     <EventWrapper visibility={true}>
//       <Flex sx={{ fontWeight: 500 }}>
//         {t("konnect.sidebar.scheduler.timespan")}
//       </Flex>
//       <Flex
//         onMouseEnter={() => {
//           nodeOuter.current.id = "";
//           nodeOuter?.current.classList.add("nowheel");
//         }}
//         onMouseLeave={() => {
//           nodeOuter.current.id = "drag";
//           nodeOuter?.current.classList.remove("nowheel");
//         }}
//       >
//         <ReactSelect
//           value={data.selectedValue?.localData?.timespan || null}
//           placeholder="Choose Time Span"
//           onChange={(e) => helper.setSchData(e, "select", "timespan")}
//           options={intervalArr}
//           styles={selectStyle}
//         />
//       </Flex>
//       {data?.selectedValue?.time_span === "Minutes" ? (
//         <>
//           <Flex sx={{ fontWeight: 500 }}>
//             {t("konnect.sidebar.scheduler.every")}
//           </Flex>
//           <Input
//             sx={{ bgColor: "#f3f7ff", border: "1px solid #b7c9ff" }}
//             placeholder="Any value between 1 to 59"
//             size="md"
//             type="number"
//             value={data.selectedValue?.localData?.every || ""}
//             onChange={(e) => helper.setSchData(e, "input", "minute")}
//           />
//         </>
//       ) : data?.selectedValue?.time_span === "Hours" ? (
//         <>
//           <Flex sx={{ fontWeight: 500 }}>
//             {t("konnect.sidebar.scheduler.every")}
//           </Flex>
//           <Input
//             sx={{ bgColor: "#f3f7ff", border: "1px solid #b7c9ff" }}
//             placeholder="Any value between 1 to 24"
//             size="md"
//             type="number"
//             value={data.selectedValue?.localData?.every || ""}
//             onChange={(e) => helper.setSchData(e, "input", "hour")}
//           />
//         </>
//       ) : data?.selectedValue?.time_span === "Days" ? (
//         <>
//           <Flex sx={{ fontWeight: 500 }}>
//             {t("konnect.sidebar.scheduler.every")}
//           </Flex>

//           <Input
//             sx={{ bgColor: "#f3f7ff", border: "1px solid #b7c9ff" }}
//             placeholder="Between number of days"
//             size="md"
//             type="number"
//             value={data.selectedValue?.localData?.every || ""}
//             onChange={(e) => helper.setSchData(e, "input", "days")}
//           />
//           <Flex sx={{ fontWeight: 500 }}>
//             {t("konnect.sidebar.scheduler.time")}
//           </Flex>
//           <Input
//             sx={{ bgColor: "#f3f7ff", border: "1px solid #b7c9ff" }}
//             placeholder="Select Time"
//             size="md"
//             type="time"
//             value={data.selectedValue?.localData?.time || ""}
//             onChange={(e) => helper.setSchData(e, "input", "time")}
//           />
//         </>
//       ) : data?.selectedValue?.time_span === "Weeks" ? (
//         <>
//           <Flex sx={{ fontWeight: 500 }}>
//             {t("konnect.sidebar.scheduler.every")}
//           </Flex>
//           <Flex
//             onMouseEnter={() => {
//               nodeOuter.current.id = "";
//               nodeOuter?.current.classList.add("nowheel");
//             }}
//             onMouseLeave={() => {
//               nodeOuter.current.id = "drag";
//               nodeOuter?.current.classList.remove("nowheel");
//             }}
//           >
//             <ReactSelect
//               closeMenuOnSelect={false}
//               value={data.selectedValue?.localData?.days || []}
//               placeholder="Select Day"
//               isMulti
//               onBlur={() => (nodeOuter.current.id = "drag")}
//               onChange={(e) => helper.setSchData(e, "select", "week")}
//               options={daysArray}
//               styles={selectStyle}
//             />
//           </Flex>

//           <Flex sx={{ fontWeight: 500 }}>
//             {t("konnect.sidebar.scheduler.time")}
//           </Flex>
//           <Input
//             sx={{ bgColor: "#f3f7ff", border: "1px solid #b7c9ff" }}
//             placeholder="Select Time"
//             size="md"
//             type="time"
//             value={data.selectedValue?.localData?.time || ""}
//             onChange={(e) => helper.setSchData(e, "input", "time")}
//           />
//         </>
//       ) : null}
//     </EventWrapper>
//   ) : null;
// }
