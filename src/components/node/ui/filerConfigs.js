import React, { useState } from "react";
import { Flex, Icon, Tooltip, Button } from "@chakra-ui/react";
import { FaArrowDownShortWide } from "react-icons/fa6";
import { useDispatch } from "react-redux";
import ReactSelect from "react-select";
import CreatableSelect from "react-select/creatable";
import { components } from "react-select";
import {
  addNewFilter,
  handleToggle,
  onCollapseEventConfig,
  onUpdateFilter,
  removeFilter,
  updateFilters,
} from "../../../store/slices/flowSlice";
import { RiChatDeleteFill, RiGitBranchFill } from "react-icons/ri";
const selectStyle = {
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

let filterConditions = [
  {
    id: "lesser than",
    name: "Lesser Than",
    label: "Lesser Than",
    value: "lesser than",
  },
  {
    id: "greater than",
    name: "Greater Than",
    label: "Greater Than",
    value: "greater than",
  },
  {
    id: "is exist",
    name: "Is Exist",
    label: "Is Exist",
    value: "is exist",
  },
  {
    id: "does not exist",
    name: "Does Not Exist",
    label: "Does Not Exist",
    value: "does not exist",
  },
  {
    id: "start with",
    name: "Start With",
    label: "Start With",
    value: "start with",
  },
  {
    id: "start with",
    name: "Does Not Start With",
    label: "Does Not Start With",
    value: "start with",
  },
  {
    id: "end with",
    name: "End With",
    label: "End With",
    value: "end with",
  },
  {
    id: "does not end with",
    name: "Does Not End With",
    label: "Does Not End With",
    value: "does not end with",
  },
  {
    id: "equal to",
    name: "Equal To",
    label: "Equal To",
    value: "equal to",
  },
  {
    id: "does not equal to",
    name: "Does Not Equal To",
    label: "Does Not Equal To",
    value: "does not equal to",
  },
  {
    id: "contain string",
    name: "Contain String",
    label: "Contain String",
    value: "contain string",
  },
  {
    id: "does not contain string",
    name: "Does Not Contain String",
    label: "Does Not Contain String",
    value: "does not contain string",
  },
];
const FilerConfigs = ({
  collapseConfiguration,
  options,
  nodeOuter,
  nodeId,
  value,
  filterValues,
}) => {
  const dispatch = useDispatch();

  const [isGroupOpen, setIsGroupOpen] = useState(() =>
    options.map((op, i) => {
      if (Array.isArray(op.options)) {
        return { collapsed: true, index: op.nodeId };
      }
    })
  );
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

  const helper = {
    addNew: (props) => {
      dispatch(addNewFilter({ nodeId: nodeId, joinWith: props.joinWith }));
    },
    remove: (props) => {
      dispatch(removeFilter(props));
      dispatch(handleToggle());
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
        <>
          {filterValues.map((value, i) => {
            return (
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
                  alignItems="center"
                >
                  <ReactSelect
                    isClearable={i === 0 ? true : false}
                    styles={selectStyle}
                    placeholder="Select the Config on which you want to apply filter"
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
                      if (selected == null) {
                        const filterValue = {
                          id: value.id,
                          field: "",
                          operator: "",
                          value: "",
                        };

                        dispatch(
                          onUpdateFilter({
                            nodeId: nodeId,
                            value: filterValue,
                            id: value.id,
                            conditionIndex: i,
                            nullValue: true,
                          })
                        );
                      } else {
                        const filterValue = {
                          id: value.id,
                          field: {
                            key: selected.port.source,
                            label: selected.label,
                            value: selected.config_key,
                            name: selected.label,
                            konnect_activity_id: selected.konnect_activity_id,
                          },
                          linkFrom1: selected.port.source,
                          operator: "",
                          value: "",
                          selectedNodeId: selected.nodeId,
                        };

                        dispatch(
                          onUpdateFilter({
                            nodeId: nodeId,
                            linkFrom1: selected.port.source,
                            value: filterValue,
                            id: value.id,
                            conditionIndex: i,
                            selectedConfig: selected,
                          })
                        );
                      }
                      dispatch(handleToggle());
                    }}
                    value={value.field}
                    components={customComponents}
                    // value={response?.value}
                    onBlur={() => (nodeOuter.current.id = "drag")}
                  />
                  {i > 0 && (
                    <Tooltip
                      label="Delete the condition"
                      placement="top"
                      hasArrow
                      arrowSize={5}
                    >
                      <RiChatDeleteFill
                        style={{
                          height: "30px",
                          width: "30px",
                          background: "#EDF2F6",
                          right: "-25px",

                          border: "none",
                          zIndex: 1,
                        }}
                        onClick={() =>
                          helper.remove({ id: value.id, nodeId: nodeId })
                        }
                      />
                    </Tooltip>
                  )}
                </Flex>
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
                    // value={x.selected || null}
                    onBlur={() => (nodeOuter.current.id = "drag")}
                    placeholder="Select the filtering Condition"
                    //  value={filterConditions}
                    options={filterConditions}
                    value={value.operatorValue ? value.operatorValue : null}
                    onChange={(selected) => {
                      const filterValue = {
                        ...value,
                        operator: selected.id,
                        operatorValue: {
                          label: selected.label,
                          value: selected.config_key,
                          name: selected.label,
                        },
                      };

                      dispatch(
                        onUpdateFilter({
                          nodeId: nodeId,
                          value: filterValue,
                          id: value.id,
                          conditionIndex: i,
                          selectedConfig: "custom",
                        })
                      );
                      dispatch(handleToggle());
                    }}
                  />
                </Flex>
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
                  <CreatableSelect
                    openMenuOnFocus
                    blurInputOnSelect
                    styles={selectStyle}
                    components={customComponents}
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
                    value={value.valueOfFilter|| null}
                    onBlur={() => (nodeOuter.current.id = "drag")}
                    placeholder="Select the Config or type the comparisive value"
                    onChange={(selected) => {
                      if (!selected.__isNew__) {
                        const valueObj = {
                          type: "key-map",
                          value: selected.config_key,
                          konnect_activity_id: selected.konnect_activity_id,
                          name: selected.label,
                          label: selected.label,
                          id: selected.label,
                        };
                        const filterValue = {
                          ...value,
                          value: valueObj,
                          valueOfFilter: valueObj,
                          linkFrom2: selected.port.source,
                        };

                        dispatch(
                          onUpdateFilter({
                            nodeId: nodeId,
                            value: filterValue,
                            linkFrom2: selected.port.source,

                            id: value.id,
                            conditionIndex: i,
                            selectedConfig: selected,
                          })
                        );
                      } else {
                        const valueObj = selected.value;
                        const filterValue = {
                          ...value,
                          value: valueObj,
                          valueOfFilter: {
                            value: selected.value,
                            name: selected.value,
                            id: selected.value,
                            label: selected.value,
                          },
                        };
                        dispatch(
                          onUpdateFilter({
                            nodeId: nodeId,
                            value: filterValue,
                            id: value.id,
                            conditionIndex: i,
                            selectedConfig: "custom",
                          })
                        );
                      }
                      dispatch(updateFilters({ nodeId: nodeId }));
                      dispatch(handleToggle());
                    }}
                  />
                </Flex>
              </>
            );
          })}
          {filterValues[0].valueOfFilter && (
            <Flex
              justify="space-between"
              sx={{
                borderRadius: "12px",
                border: "1px solid #BDBDDA",
              }}
            >
              <Tooltip
                label="Add New Condition with 'AND' Logic"
                placement="top"
                hasArrow
                arrowSize={5}
              >
                <Button
                  flex="1"
                  onClick={() => helper.addNew({ joinWith: "And" })}
                >
                  +And
                </Button>
              </Tooltip>
              <Tooltip
                label="Add New Condition with 'OR' Logic"
                placement="top"
                hasArrow
                arrowSize={5}
              >
                <Button
                  flex="1"
                  onClick={() => helper.addNew({ joinWith: "or" })}
                >
                  +OR
                </Button>
              </Tooltip>
            </Flex>
          )}
        </>
      ) : null}
    </Flex>
  );
};

export default FilerConfigs;
