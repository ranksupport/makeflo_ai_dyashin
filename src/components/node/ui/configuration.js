import {
  Checkbox,
  Drawer,
  DrawerContent,
  DrawerOverlay,
  Box,
  Flex,
  Icon,
  Input,
  Tooltip,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { memo, useEffect, useState } from "react";
import { FaArrowDownShortWide } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import ReactSelect from "react-select";
import { TbInfoCircle } from "react-icons/tb";
import { PiPlusMinusBold } from "react-icons/pi";
import { MdDeleteSweep } from "react-icons/md";
import {
  onCollapseEventAcount,
  onCollapseEventConfig,
  onSelectedValue,
  onTextInputChange,
  saveCouponDuration,
  saveCouponExpNum,
  setBasicAuthCredential,
  setEventsConfig,
  setLinkedAccount,
  setSelectedEvent,
  toggleBasicAuth,
  setSegementIndex,
  setApiData,
  resetConfig,
  addKeys,
} from "../../../store/slices/flowSlice";
import { RiGitBranchFill } from "react-icons/ri";
import {
  get_app_event_config_detail,
  get_app_event_config_detail_fetch,
  get_app_configs,
} from "../../../store/thunk/flowThunk";
import {  CustomHandleLeft, CustomHandleRight } from "./response";
import CreatableSelect from "react-select/creatable";
import { components } from "react-select";
import { MdOutlineCancel } from "react-icons/md";
import { IoMdAddCircleOutline } from "react-icons/io";
export const selectStyle = {
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
    border: "1px solid #ABB6C8",
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
const inputStyle = {
  container: (styles) => ({
    ...styles,
    width: "100%",
    "&:focus-visible": {
      outline: "none",
    },
  }),
  option: (styles) => ({ ...styles, fontSize: 14 }),
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
    border: "none",
    fontSize: 16,
  }),
  valueContainer: (styles) => ({ ...styles }),
  singleValue: (styles) => ({ ...styles, color: "#000" }),
  indicatorSeparator: (styles) => ({ ...styles, display: "none" }),
  multiValue: (styles) => {
    return {
      ...styles,
      backgroundColor: "#fff",
      border: "none",
    };
  },
};
export const EventAccount = memo(
  ({
    provider,
    app_event_present,
    node_id,
    basic_auth,
    nodeOuter,
    events,
    accounts,
    selectedAccount,
    selectedEvent,
    collapseEventAccount,
    errorMessage,
    type = "",
  }) => {
    const [collapseAuth, setCollapseAuth] = useState(false);
    const dispatch = useDispatch();
    const toast = useToast();
    const helper = {
      onBasicAuth: (e) => {
        setCollapseAuth(e.target.checked);
        dispatch(
          toggleBasicAuth({
            enabled: e.target.checked,
            node_id: node_id,
          })
        );
      },
    };
    return provider.toLowerCase()==="webhook" ? (
      <>
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
            onClick={() => {
              basic_auth?.status == true && setCollapseAuth((c) => !c);
            }}
            sx={{
              cursor: "pointer",
              width: "100%",
              "&:hover": {
                "#icon": {
                  color: "#34454E",
                },
              },
            }}
          >
            <Checkbox
              isChecked={basic_auth?.status}
              onChange={helper.onBasicAuth}
            >
              Basic Authentication
            </Checkbox>
            <Icon
              as={FaArrowDownShortWide}
              id="icon"
              boxSize={"20px"}
              sx={{
                m: "auto 0px auto 0px",

                color: collapseAuth ? "#34454E" : "#ABB6C8",
                transform: collapseAuth ? "rotate(-180deg)" : "none",
                transition: "transform 0.3s",
              }}
            />
          </Flex>
          {collapseAuth && basic_auth?.status == true ? (
            <>
              <Input
                placeholder="Enter API Key"
                value={basic_auth?.apiKey}
                onChange={(e) => {
                  dispatch(
                    setBasicAuthCredential({
                      node_id: node_id,
                      id: "apiKey",
                      value: e.target.value,
                    })
                  );
                }}
              />
              <Input
                placeholder="Enter API Secret"
                value={basic_auth?.apiSecret}
                onChange={(e) => {
                  dispatch(
                    setBasicAuthCredential({
                      node_id: node_id,
                      id: "apiSecret",
                      value: e.target.value,
                    })
                  );
                }}
              />
            </>
          ) : null}
        </Flex>
      </>
    ) : (
      <Flex
        sx={{
          justifyContent: "space-between",
          borderRadius: "12px",
          gap: "20px",
          width: "100%",
          border: "1px solid #BDBDDA",
          p: "20px",
        }}
      >
        <Flex flexDir="column" sx={{ gap: "15px", width: "100%" }}>
          <Flex
            justifyContent="space-between"
            onClick={() =>
              dispatch(
                onCollapseEventAcount({
                  node_id: node_id,
                  status: !collapseEventAccount,
                })
              )
            }
            sx={{
              cursor: "pointer",
              "&:hover": {
                "#icon": {
                  color: "#34454E",
                },
              },
            }}
          >
            {type !== "in_House" ? (
              <Flex>Choose Event & Account</Flex>
            ) : (
              <Flex>Choose Event </Flex>
            )}
            <Icon
              as={FaArrowDownShortWide}
              id="icon"
              boxSize={"20px"}
              sx={{
                m: "auto 0px auto 0px",
                color: collapseEventAccount ? "#34454E" : "#ABB6C8",
                transform: collapseEventAccount ? "rotate(-180deg)" : "none",
                transition: "transform 0.3s",
              }}
            />
          </Flex>
          {!collapseEventAccount ? (
            <>
              <Flex
                onMouseDownCapture={() => (nodeOuter.current.id = "")}
                onMouseEnter={() => {
                  nodeOuter?.current.classList.add("nopan");
                  nodeOuter?.current.classList.add("nowheel");
                }}
                onMouseLeave={() => {
                  nodeOuter?.current.classList.remove("nopan");
                  nodeOuter?.current.classList.remove("nowheel");
                }}
              >
                <ReactSelect
                  openMenuOnFocus
                  blurInputOnSelect
                  styles={selectStyle}
                  placeholder="Choose Action"
                  options={events}
                  onBlur={() => (nodeOuter.current.id = "drag")}
                  onChange={(selected) => {
                    dispatch(resetConfig({ node_id: node_id, type: "Normal" }));

                    dispatch(
                      setSelectedEvent({ value: selected, nodeId: node_id })
                    );
                    if (selectedAccount || type === "in_House")
                      dispatch(get_app_configs({ nodeId: node_id,toast:toast })).then(
                        (res) => {
                       
                          if (
                            !res.error &&
                            res.payload?.filter((r) => r.sequence >= 1)
                              ?.length > 0
                          ) {
                            dispatch(
                              get_app_event_config_detail({
                                nodeId: node_id,
                                config_key: res.payload.find(
                                  (x) => x.sequence === 1
                                ).config_key,
                                toast:toast
                              })
                            )
                          
                          }
                        }
                      );
                  }}
                  value={selectedEvent ? selectedEvent : null}
                />
              </Flex>
              {type !== "in_House"  && (
                <Flex
                  onMouseDownCapture={() => (nodeOuter.current.id = "")}
                  onMouseEnter={() => {
                    nodeOuter?.current.classList.add("nopan");
                    nodeOuter?.current.classList.add("nowheel");
                  }}
                  onMouseLeave={() => {
                    nodeOuter?.current.classList.remove("nopan");
                    nodeOuter?.current.classList.remove("nowheel");
                  }}
                  width="100%"
                >
                  <ReactSelect
                    openMenuOnFocus
                    blurInputOnSelect
                    styles={selectStyle}
                    placeholder="Select Account"
                    options={accounts}
                    onBlur={() => (nodeOuter.current.id = "drag")}
                    onChange={(selected) => {
                      dispatch(
                        resetConfig({ node_id: node_id, type: "Normal" })
                      );

                      dispatch(
                        setLinkedAccount({ value: selected, nodeId: node_id })
                      );
                      if (selectedEvent)
                        dispatch(get_app_configs({ nodeId: node_id,toast:toast }))
                      .then(
                          (res) => {
                          
                            if (
                              !res.error &&
                              res.payload?.filter((r) => r.sequence >= 1)
                                ?.length > 0
                            ) {
                              dispatch(
                                get_app_event_config_detail({
                                  nodeId: node_id,
                                  config_key: res.payload.find(
                                    (x) => x.sequence === 1
                                  ).config_key,
                                  toast:toast
                                })
                              )
                            
                            }
                          }
                        );
                    }}
                    value={selectedAccount ? selectedAccount : null}
                  />
                </Flex>
              )}
            </>
          ) : null}
        </Flex>
      </Flex>
    );
  }
);

export const Configuration = ({
  collapseConfiguration,
  nodeOuter,
  hasSequence,
  appEventConfigurations,
  fetchFieldStatus,
  node_id,
  errorMessage,
}) => {
  const dispatch = useDispatch();
  const toast = useToast();
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
          {hasSequence &&
            appEventConfigurations?.map((x, i) => {
              let title = x?.title;
              return (
                <Flex
                  key={i}
                  onMouseDownCapture={() => (nodeOuter.current.id = "")}
                  onMouseEnter={() => nodeOuter?.current.classList.add("nopan")}
                  onMouseLeave={() =>
                    nodeOuter?.current.classList.remove("nopan")
                  }
                  width="100%"
                >
                  <ReactSelect
                    openMenuOnFocus
                    blurInputOnSelect
                    styles={selectStyle}
                    value={x.selected || null}
                    onBlur={() => (nodeOuter.current.id = "drag")}
                    placeholder={
                      title?.includes("*") ? (
                        <span style={{ color: "#1A202C" }}>
                          <span style={{ color: "black" }}>
                            {title.split("*")[0]}
                          </span>
                          *
                        </span>
                      ) : (
                        title || "Select..."
                      )
                    }
                    options={x.config_details}
                    onChange={(selected) => {
                      dispatch(
                        resetConfig({ node_id: node_id, type: "Normal" })
                      );
                      dispatch(
                        setEventsConfig({
                          selectedConfig: x,
                          selectedValue: selected,
                          nodeId: node_id,
                        })
                      );
                      if (i !== appEventConfigurations.length - 1) {
                        dispatch(
                          resetConfig({ node_id: node_id, type: "Normal" })
                        );
                        dispatch(
                          get_app_event_config_detail({
                            nodeId: node_id,
                            prevValue: selected,
                          })
                        ).then((res) => {
                          if (res.error) {
                            toast({
                              position: "top",
                              status: "warning",
                              variant: "solid",
                              title:
                                "OOps!! could not fetch app details.Give appropriate inputs",
                              duration: 2500,
                              containerStyle: {
                                fontWeight: 400,
                              },
                            });
                          }
                        });
                      } else {
                        if (fetchFieldStatus) {
                          dispatch(
                            resetConfig({ node_id: node_id, type: "Normal" })
                          );
                          dispatch(
                            get_app_event_config_detail_fetch({
                              nodeId: node_id,
                              selectedValue: selected,
                              toast:toast
                            })
                          )
                         
                        }
                      }
                    }}
                  />
                </Flex>
              );
            })}
        </>
      ) : null}
    </Flex>
  );
};

export const InputParameter = memo(
  ({
    configResponses,
    nodeOuter,
    options,
    provider = "",
    node_id,
    apiDetail = {},data
  }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const dispatch = useDispatch();
    const [isGroupOpen, setIsGroupOpen] = useState([]);
    const toast=useToast()
    useEffect(() => {
      setIsGroupOpen(() =>
        options.map((op, i) => {
          if (Array.isArray(op.options)) {
            return { collapsed: true, index: op.nodeId };
          }
        })
      );
    }, [options]);
    const toggleGroup = (data) => {
      if (data.group) {
        setIsGroupOpen((prevState) =>
          prevState.map((group) =>
            group.index === data.index
              ? { ...group, collapsed: !group.collapsed }
              : group
          )
        );
      }
    };
    const customOption = ({ data, ...props }) => (
      <Flex flexDir="column" sx={{}}>
        {data.group ? (
          <Flex
            onClick={() => toggleGroup(data)}
            sx={{
              justifyContent: "space-between",
              borderBottom: "1px solid #BDBDDA",
              bgColor: "#e2e7eb",
              p: "10px",
              cursor: "pointer",
            }}
          >
            <Flex>
              {data.slr_no}. {data.label}
            </Flex>
            <Flex>
              <Icon
                as={RiGitBranchFill}
                id="icon"
                boxSize={"18px"}
                sx={{
                  m: "auto 0px auto 0px",
                  color: "##657279",
                  transform: "rotate(180deg)",
                }}
              />
            </Flex>
          </Flex>
        ) : (
          !isGroupOpen.find((grp) => data.nodeId == grp.index)?.collapsed && (
            <components.Option {...props}>
              <Flex sx={{ px: "20px" }}>
                {props.children}
                {props.isFocused && (
                  <Flex
                    sx={{
                      fontWeight: 600,
                      whiteSpace: "nowrap",
                      overflowX: "hidden",
                      pl: "4px",
                    }}
                  >
                    :{"  "}
                    {typeof props.value == "string"
                      ? props.value
                      : props.value?.value}
                  </Flex>
                )}
              </Flex>
            </components.Option>
          )
        )}
      </Flex>
    );
    const customComponents = {
      Option: customOption,
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
        {configResponses &&
          configResponses.map((response, i) => {
            if (response.visible === true && !response.additional)
              return (
                <Flex
                  width="100%"
                  key={i}
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
                    id={response.port.target}
                    targetLinked={response.targetLinked}
                  />
                  <Tooltip
                    label={response.label}
                    placement="top"
                    hasArrow
                    arrowSize={5}
                  >
                    <Flex>
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
                    onMouseEnter={() =>
                      nodeOuter?.current.classList.add("nopan")
                    }
                    onMouseLeave={() =>
                      nodeOuter?.current.classList.remove("nopan")
                    }
                  >
                    <CreatableSelect
                      isClearable
                      styles={inputStyle}
                      placeholder={
                        <Flex
                          sx={{
                            whiteSpace: "nowrap",
                            overflowX: "hidden",
                            width: "290px",
                          }}
                        >
                          Create/Select for
                          <Flex sx={{ fontWeight: 600, pl: "4px" }}>
                            {" "}
                            {response.label}{(
                              response.config_key_required ? (
                                <span style={{ color: "#1A202C" }}>*</span>
                              ) : (
                                ""
                              )
                            )}
                          </Flex>
                        </Flex>
                      }
                      options={options.flatMap((group, i) => [
                        {
                          value: group.label,
                          label: group.label,
                          group: true,
                          index: group.nodeId,
                          slr_no: i + 1,
                        },
                        ...group.options,
                      ])}
                      onChange={(selected) => {
                        if (selected?.__isNew__) {
                          dispatch(
                            resetConfig({ node_id: node_id, type: "Normal" })
                          );
                          dispatch(
                            onTextInputChange({
                              value: selected,
                              config: response,
                            })
                          );
                        } else {
                          dispatch(
                            resetConfig({ node_id: node_id, type: "Normal" })
                          );

                          dispatch(
                            onSelectedValue({
                              config: response,
                              value: selected,
                              toast:toast
                            })
                          );
                        }
                      }}
                      components={customComponents}
                      value={response?.value ? response.value : null}
                      onBlur={() => (nodeOuter.current.id = "drag")}
                    />
                  </Flex>

                  <CustomHandleRight
                    type="source"
                    id={response.port.source}
                    sourceLinked={response.sourceLinked}
                  />
                </Flex>
              );
          })}
        {provider == "api" ? (
          <Flex
            onClick={onOpen}
            sx={{
              width: "100%",
              borderRadius: "6px",
              bgColor: "#edf2f6",
              p: "10px",
              gap: "10px",
              cursor: "pointer",
              border: "1px solid #abb6c7",
              justifyContent: "center",
            }}
          >
            <Flex>
              <Icon
                as={PiPlusMinusBold}
                id="icon"
                boxSize={"18px"}
                sx={{
                  m: "auto 0px auto 0px",
                  color: "#657279",
                }}
              />
            </Flex>
            Set Params
          </Flex>
        ) : null}
         {provider == "data_forwarder" ? (
          <Flex
            onClick={onOpen}
            sx={{
              width: "100%",
              borderRadius: "6px",
              bgColor: "#edf2f6",
              p: "10px",
              gap: "10px",
              cursor: "pointer",
              border: "1px solid #abb6c7",
              justifyContent: "center",
            }}
          >
            <Flex>
              <Icon
                as={PiPlusMinusBold}
                id="icon"
                boxSize={"18px"}
                sx={{
                  m: "auto 0px auto 0px",
                  color: "#657279",
                }}
              />
            </Flex>
            Set Keys
          </Flex>
        ) : null}
        {isOpen && provider==="api" &&(
          <ParamsPanel
            isOpen={isOpen}
            onClose={onClose}
            apiDetail={apiDetail}
            node_id={node_id}
            // accounts={accounts}
            // data={data}
          />
        )}
         {isOpen && provider==="data_forwarder" &&(
          <KeyPanel
            isOpen={isOpen}
            onClose={onClose}
            appDetail={data}
            node_id={node_id}
            // accounts={accounts}
            // data={data}
          />
        )}
      </Flex>
    );
  }
);

export const SplitterConfig = ({
  collapseConfiguration,
  nodeOuter,

  inHouseAppConfig,
  node_id,
  value,
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
              // value={x.selected || null}
              onBlur={() => (nodeOuter.current.id = "drag")}
              placeholder="Choose the configs"
              value={value}
              options={inHouseAppConfig.Splitter.segmentIndex}
              onChange={(selected) => {
                dispatch(
                  setSegementIndex({ nodeId: node_id, value: selected })
                );
                dispatch(resetConfig({ node_id: node_id, type: "Normal" }));

               
              }}
            />
          </Flex>
        </>
      ) : null}
    </Flex>
  );
};

export const CouponComponenet = ({
  collapseConfiguration,
  options,
  nodeOuter,
  nodeId,
  value,
  inputValue,
}) => {
  const dispatch = useDispatch();
  const toast = useToast();
  const handleInputChange = (event) => {
    const value = event.target.value.trim();
    if (value === "" || /^[0-9]*$/.test(value)) {
      dispatch(saveCouponExpNum({ nodeId: nodeId, value: value }));
      dispatch(resetConfig({ node_id: nodeId, type: "Normal" }));
      
    } else {
      toast({
        position: "top",
        status: "warning",
        variant: "solid",
        title: "Please Fill Integer Only",
        duration: 2500,
        containerStyle: {
          fontWeight: 400,
        },
      });
      event.preventDefault();
    }
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
              node_id: nodeId,
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
        <Flex
          sx={{
            justifyContent: "space-between",
            width: "100%",
            gap: "20px",
            // p: "20px",
            alignItems: "center",
          }}
        >
          <Tooltip
            label="Enter an integer"
            placement="top"
            hasArrow
            arrowSize={5}
          >
            <Input
              type="number"
              placeholder="Enter an integer"
              step="1"
              sx={{ flex: "1/3" }}
              value={inputValue}
              style={{ width: "40%" }} // This will make the input take 100% width of its parent
              onChange={handleInputChange}
            />
          </Tooltip>

          <Flex
              sx={{ flex: "2/3" }}

            onMouseDownCapture={() => (nodeOuter.current.id = "")}
            onMouseEnter={() => {
              nodeOuter?.current.classList.add("nopan");
              nodeOuter?.current.classList.add("nowheel");
            }}
            onMouseLeave={() => {
              nodeOuter?.current.classList.remove("nopan");
              nodeOuter?.current.classList.remove("nowheel");
            }}
          >
            <ReactSelect
              openMenuOnFocus
              blurInputOnSelect
              onBlur={() => (nodeOuter.current.id = "drag")}
              options={options}
              placeholder="Select duration"
              style={selectStyle}
              value={value}
              onChange={(selected) => {
                dispatch(
                  saveCouponDuration({ nodeId: nodeId, value: selected })
                );
                dispatch(resetConfig({ node_id: nodeId, type: "Normal" }));
              
              }}
            />
          </Flex>
        </Flex>
      ) : null}
    </Flex>
  );
};

export const FilterConfigContainer = ({ responses, filterValues }) => {
  function findSubstringWithTenAlphabets(text) {
    const pattern = /[A-Za-z]+/g; // Regular expression to match consecutive alphabetic characters
    const matches = text.match(pattern); // Find all matches of consecutive alphabetic characters

    if (text) {
      for (let i = 0; i < text.length; i++) {
        if (text[i].length > 35) {
          return text[i]; // Found a substring with more than 10 alphabets, return it
        }
      }
    }

    return null; // No substring with more than 10 alphabets found
  }
  return (
    <Box
      sx={{
        display: "flex",
      }}
    >
      {filterValues &&
        responses.map((res) => {
          if (!res.additional)
            return (
              <>
                <Flex sx={{ position: "relative", mr: "4%" }}>
                  <CustomHandleLeft
                    type="target"
                    id={res.port.target}
                    targetLinked={res.targetLinked}
                  />
                </Flex>
                <Flex
                  sx={{
                    width: "95%",
                    gap: "7px",
                    minHeight: "70px",
                    width: "100%",
                    flexDirection: "column",
                    backgroundColor: "#f3f7ff",
                    borderRadius: "5px",
                  }}
                >
                  {filterValues?.map((condition, i) => {
                    let queryOperatorText =
                      condition.queryOperator === undefined
                        ? ""
                        : condition.queryOperator.toUpperCase();
                    // Handling empty entries in the condition
                    if (condition.field === "" || condition.operator === "") {
                      return "";
                    }
                    // Remove the query operator AND or OR if this is the last item
                    if (i === filterValues.length - 1) {
                      queryOperatorText = "";
                    }
                    let res = condition.field.label;
                    let res1 = condition.value.name
                      ? condition.value.name
                      : condition.value;
                    const string =
                      (condition && res?.length > 35) ||
                      findSubstringWithTenAlphabets(res);
                    const string1 =
                      (condition && res1?.length > 35) ||
                      findSubstringWithTenAlphabets(res1);
                    return (
                      <Flex
                        sx={{ flexDirection: "column", paddingLeft: "5px" }}
                      >
                        <span
                          style={{
                            color: "#152F73",
                            fontSize: "18px",
                          }}
                        >
                          {condition?.field?.label}
                        </span>
                        <span style={{ color: "#909395", fontSize: "18px" }}>
                          {condition?.operator}
                        </span>

                        <span
                          style={{
                            color: "#152F73",
                            fontSize: "18px",
                          }}
                        >
                          {" " +
                            ` ${
                              condition?.value.name
                                ? condition?.value.name
                                : condition?.value
                            }` +
                            " " +
                            queryOperatorText}{" "}
                        </span>
                      </Flex>
                    );
                  })}
                </Flex>
              </>
            );
        })}
    </Box>
  );
};

const ParamsPanel = ({ isOpen, onClose, apiDetail, node_id }) => {
  const [headerList, setHeaderList] = useState(apiDetail.headers);
  const [paramList, setParamList] = useState(apiDetail.params);
  const dispatch = useDispatch();
  return (
    <Drawer
      isOpen={isOpen}
      placement="right"
      onClose={() => {
        // dispatch(onAccountDraw({ node_id: node_id, status: false }));
        onClose();
      }}
    >
      <DrawerOverlay />
      <DrawerContent
        sx={{
          p: "20px",
          flexDir: "column",
          gap: "20px",
          justifyContent: "space-between",
        }}
      >
        <Flex height="100%" sx={{ position: "relative" }}>
          <Flex
            sx={{
              position: "absolute",
              top: "0px",
              bottom: "0px",
              left: "0px",
              right: "0px",
              gap: "10px",
              overflowY: "auto",
              overFlowX: "hidden",
              alignItems: "flex-start",
              width: "100%",
              justifyContent: "flex-start",
              flexDir: "column",
              p: "2px",
            }}
          >
            <Flex
              sx={{
                width: "100%",
                borderBottom: "1px solid #abb6c6",
                py: "3px",
              }}
            >
              Headers
            </Flex>
            <Flex sx={{ flexDir: "column", width: "100%", gap: "10px" }}>
              {headerList.map((head, index) => {
                return (
                  <Flex
                    key={index}
                    sx={{ width: "100%", position: "relative" }}
                  >
                    <Input
                      value={head.key || ""}
                      placeholder="Enter Key"
                      onChange={(e) =>
                        setHeaderList((c) =>
                          c.map((ob, i) => {
                            if (i == index) {
                              return { ...ob, key: e.target.value };
                            }
                            return ob;
                          })
                        )
                      }
                      sx={{
                        width: "100%",
                        zIndex: 1,
                      }}
                    />
                    <Flex
                      onClick={() =>
                        setHeaderList((c) => c.filter((x, i) => i != index))
                      }
                      sx={{
                        zIndex: 2,
                        position: "absolute",
                        right: "0px",
                        top: "0px",
                        cursor: "pointer",
                        height: "100%",
                      }}
                    >
                      <Icon
                        as={MdDeleteSweep}
                        boxSize={"20px"}
                        sx={{
                          m: "auto 10px",
                          color: "#000",
                        }}
                      />
                    </Flex>
                  </Flex>
                );
              })}
              <Flex
                onClick={() => setHeaderList((c) => [...c, { key: "" }])}
                sx={{
                  bgColor: "#edf2f6",
                  justifyContent: "center",
                  cursor: "pointer",
                  borderRadius: "6px",
                  p: "10px",
                  fontSize: 15,
                  gap: "7px",
                  color: "#000",
                  border: "1px solid #33454e",
                }}
              >
                Add Headers
              </Flex>
            </Flex>
          </Flex>
        </Flex>
        <Flex height="100%" sx={{ position: "relative" }}>
          <Flex
            sx={{
              position: "absolute",
              top: "0px",
              bottom: "0px",
              left: "0px",
              right: "0px",
              gap: "10px",
              overflowY: "auto",
              overFlowX: "hidden",
              alignItems: "flex-start",
              width: "100%",
              justifyContent: "flex-start",
              flexDir: "column",
              p: "2px",
            }}
          >
            <Flex
              sx={{
                width: "100%",
                borderBottom: "1px solid #abb6c6",
                py: "3px",
              }}
            >
              Parameters
            </Flex>
            <Flex sx={{ flexDir: "column", width: "100%", gap: "10px" }}>
              {paramList.map((param, index) => {
                return (
                  <Flex
                    key={index}
                    sx={{ width: "100%", position: "relative" }}
                  >
                    <Input
                      value={param.key || ""}
                      placeholder="Enter Key"
                      onChange={(e) =>
                        setParamList((c) =>
                          c.map((ob, i) => {
                            if (i == index) {
                              return { ...ob, key: e.target.value };
                            }
                            return ob;
                          })
                        )
                      }
                      sx={{
                        width: "100%",
                        zIndex: 1,
                      }}
                    />
                    <Flex
                      onClick={() =>
                        setParamList((c) => c.filter((x, i) => i != index))
                      }
                      sx={{
                        zIndex: 2,
                        position: "absolute",
                        right: "0px",
                        top: "0px",
                        cursor: "pointer",
                        height: "100%",
                      }}
                    >
                      <Icon
                        as={MdDeleteSweep}
                        boxSize={"20px"}
                        sx={{
                          m: "auto 10px",
                          color: "#000",
                        }}
                      />
                    </Flex>
                  </Flex>
                );
              })}
              <Flex
                onClick={() => setParamList((c) => [...c, { key: "" }])}
                sx={{
                  bgColor: "#edf2f6",
                  justifyContent: "center",
                  cursor: "pointer",
                  borderRadius: "6px",
                  p: "10px",
                  fontSize: 15,
                  gap: "7px",
                  color: "#000",
                  border: "1px solid #33454e",
                }}
              >
                Add Params
              </Flex>
            </Flex>
          </Flex>
        </Flex>

        <Flex sx={{ width: "100%" }}>
          <Flex
            width="100%"
            sx={{
              border: "1px solid #33454e",
              borderBottomLeftRadius: "6px",
              borderBottomRightRadius: "6px",
            }}
          >
            <Flex
              width="50%"
              onClick={() => {
                dispatch(
                  setApiData({
                    panelData: true,
                    headers: headerList,
                    params: paramList,
                    node_id: node_id,
                  })
                );
                onClose();
              }}
              sx={{
                bgColor: "#edf2f6",
                justifyContent: "center",
                cursor: "pointer",
                borderBottomLeftRadius: "6px",
                p: "10px",
                fontSize: 15,
                gap: "7px",
                color: "#000",
              }}
            >
              <Icon
                as={IoMdAddCircleOutline}
                boxSize={"16px"}
                sx={{
                  m: "auto 0px",
                  color: "#000",
                }}
              />
              Submit
            </Flex>
            <Flex
              width="50%"
              onClick={onClose}
              sx={{
                bgColor: "#bac5cc",
                justifyContent: "center",
                cursor: "pointer",
                p: "10px",
                fontSize: 15,
                borderBottomRightRadius: "6px",
                gap: "7px",
                color: "#000",
              }}
            >
              <Icon
                as={MdOutlineCancel}
                boxSize={"16px"}
                sx={{
                  m: "auto 0px",
                  color: "#000",
                }}
              />
              Cancel
            </Flex>
          </Flex>
        </Flex>
      </DrawerContent>
    </Drawer>
  );
};
const KeyPanel = ({ isOpen, onClose, node_id ,appDetail}) => {
  const [inputList, setInputList] = useState(appDetail);
  const dispatch = useDispatch();
  return (
    <Drawer
      isOpen={isOpen}
      placement="right"
      onClose={() => {
        // dispatch(onAccountDraw({ node_id: node_id, status: false }));
        onClose();
      }}
    >
      <DrawerOverlay />
      <DrawerContent
        sx={{
          p: "20px",
          flexDir: "column",
          gap: "20px",
          justifyContent: "space-between",
        }}
      >
        <Flex height="100%" sx={{ position: "relative" }}>
          <Flex
            sx={{
              position: "absolute",
              top: "0px",
              bottom: "0px",
              left: "0px",
              right: "0px",
              gap: "10px",
              overflowY: "auto",
              overFlowX: "hidden",
              alignItems: "flex-start",
              width: "100%",
              justifyContent: "flex-start",
              flexDir: "column",
              p: "2px",
            }}
          >
            <Flex
              sx={{
                width: "100%",
                borderBottom: "1px solid #abb6c6",
                py: "3px",
              }}
            >
              Keys
            </Flex>
            <Flex sx={{ flexDir: "column", width: "100%", gap: "10px" }}>
              {inputList.map((head, index) => {
                return (
                  <Flex
                    key={index}
                    sx={{ width: "100%", position: "relative" }}
                  >
                    <Input
                      value={head.key || ""}
                      placeholder="Enter Key"
                      onChange={(e) =>
                        setInputList((c) =>
                          c.map((ob, i) => {
                            if (i == index) {
                              return { ...ob, key: e.target.value };
                            }
                            return ob;
                          })
                        )
                      }
                      sx={{
                        width: "100%",
                        zIndex: 1,
                      }}
                    />
                    <Flex
                      onClick={() =>
                        setInputList((c) => c.filter((x, i) => i != index))
                      }
                      sx={{
                        zIndex: 2,
                        position: "absolute",
                        right: "0px",
                        top: "0px",
                        cursor: "pointer",
                        height: "100%",
                      }}
                    >
                      <Icon
                        as={MdDeleteSweep}
                        boxSize={"20px"}
                        sx={{
                          m: "auto 10px",
                          color: "#000",
                        }}
                      />
                    </Flex>
                  </Flex>
                );
              })}
              <Flex
                onClick={() => setInputList((c) => [...c, { key: "" }])}
                sx={{
                  bgColor: "#edf2f6",
                  justifyContent: "center",
                  cursor: "pointer",
                  borderRadius: "6px",
                  p: "10px",
                  fontSize: 15,
                  gap: "7px",
                  color: "#000",
                  border: "1px solid #33454e",
                }}
              >
                Add Keys
              </Flex>
            </Flex>
          </Flex>
        </Flex>
      

        <Flex sx={{ width: "100%" }}>
          <Flex
            width="100%"
            sx={{
              border: "1px solid #33454e",
              borderBottomLeftRadius: "6px",
              borderBottomRightRadius: "6px",
            }}
          >
            <Flex
              width="50%"
              onClick={() => {
                dispatch(
                  addKeys({
                    panelData: true,
                    inputList: inputList,
                   
                    node_id: node_id,
                  })
                );
                onClose();
              }}
              sx={{
                bgColor: "#edf2f6",
                justifyContent: "center",
                cursor: "pointer",
                borderBottomLeftRadius: "6px",
                p: "10px",
                fontSize: 15,
                gap: "7px",
                color: "#000",
              }}
            >
              <Icon
                as={IoMdAddCircleOutline}
                boxSize={"16px"}
                sx={{
                  m: "auto 0px",
                  color: "#000",
                }}
              />
              Submit
            </Flex>
            <Flex
              width="50%"
              onClick={onClose}
              sx={{
                bgColor: "#bac5cc",
                justifyContent: "center",
                cursor: "pointer",
                p: "10px",
                fontSize: 15,
                borderBottomRightRadius: "6px",
                gap: "7px",
                color: "#000",
              }}
            >
              <Icon
                as={MdOutlineCancel}
                boxSize={"16px"}
                sx={{
                  m: "auto 0px",
                  color: "#000",
                }}
              />
              Cancel
            </Flex>
          </Flex>
        </Flex>
      </DrawerContent>
    </Drawer>
  );
};
