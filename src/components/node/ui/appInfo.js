import {
  Box,
  Button,
  CircularProgress,
  Drawer,
  DrawerContent,
  DrawerOverlay,
  Flex,
  Icon,
  Image,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Select,
  Tooltip,
  Wrap,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { memo, useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { RiRefreshLine, RiTimerFill } from "react-icons/ri";
import { IoArrowBackSharp } from "react-icons/io5";
import { useDispatch } from "react-redux";
import { RiSaveLine } from "react-icons/ri";
import { PiTimerDuotone } from "react-icons/pi";
import {
  onAccountDraw,
  onDelete,
  onDeselectTrigger,
  resetNode,
  resetConfig,
  handleToggle,
  setTimerConfig,
  setTimerConfigInApp,
  cancelTimer,
} from "../../../store/slices/flowSlice";
import CheckSVG from "../../../assets/svg/check.svg";
import ErrorSVG from "../../../assets/svg/error.svg";
import { FiSettings } from "react-icons/fi";
import { BiEditAlt } from "react-icons/bi";
import { IoMdRemoveCircleOutline } from "react-icons/io";
import { MdOutlineAdd } from "react-icons/md";
import AuthTokenService from "../../../utils/AuthTokenService";
import { MdOutlineCancel } from "react-icons/md";
import {
  addAccount,
  editAccountName,
  getauthdata,
  removeAccount,
} from "../../../store/thunk/appThunk";
import { IoMdAddCircleOutline } from "react-icons/io";
import { get_accounts, onDeleteNodeV2 } from "../../../store/thunk/flowThunk";
import { PiTimerThin } from "react-icons/pi";
import ReactSelect from "react-select";

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
export const AppInfo = memo(
  ({
    data,
    node_id,
    status,
    message,
    hookTimer,
    accounts,
    tested,
    errorMessage,
    nodeOuter,
    timerConfigs,
    hasTimer,delayReady
  }) => {
    const dispatch = useDispatch();
    const [isTimer, setIsTimer] = useState(false);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();
    const helper = {
      deleteActivityId: () => {
        if (tested) {
          dispatch(onDeleteNodeV2(node_id)).then((res) => {
            if (res?.payload?.status === "warning") {
              toast({
                position: "top",
                status: "warning",
                variant: "solid",
                title: res?.payload?.message,
                duration: 2500,
                containerStyle: {
                  fontWeight: 400,
                },
              });
            }
          });
        }
      },
      delete: () => {
        hookTimer && clearInterval(hookTimer);
        helper.deleteActivityId();
        dispatch(resetConfig({ node_id: node_id }));

        dispatch(onDelete({ node_id: node_id, toast: toast }));
        dispatch(handleToggle());
      },
      refresh: () => {
        dispatch(resetConfig({ node_id: node_id }));
        dispatch(resetNode(node_id));
        dispatch(handleToggle());
      },
      deSelect: () => {
        helper.deleteActivityId();
        dispatch(onDeselectTrigger({ toast: toast }));
      },
    };

    return (
      <Flex
        height="60px"
        sx={{
          justifyContent: "space-between",
          borderRadius: "12px",
          gap: "20px",
          position: "relative",
        }}
      >
        <Flex
          sx={{
            gap: "10px",
            width: "100%",
            p: "10px",
            borderRadius: "12px",
            border: "1px solid #BDBDDA",
            justifyContent: "space-between",
          }}
        >
          <Flex sx={{ gap: "10px", width: "100%" }}>
            <Flex sx={{ gap: "10px", justifyContent: "center" }}>
              <Icon
                onClick={helper.deSelect}
                as={IoArrowBackSharp}
                boxSize={"20px"}
                sx={{
                  m: "auto 0px",
                  cursor: "pointer",
                  color: "#34454E",
                  "&:hover": {
                    color: "#34454E",
                  },
                  transition: "transform 0.3s",
                }}
              />
              <Image
                src={data.image_url}
                width="100%"
                height="100%"
                sx={{ m: "auto" }}
              />
            </Flex>
            <Tooltip label={data.name}>
              <Flex
                sx={{
                  m: "auto 0px",
                  fontSize: "16px",
                  fontWeight: 600,
                }}
              >
                {data.name.length > 13
                  ? data.name.substring(0, 11) + ".."
                  : data.name}
              </Flex>
            </Tooltip>
          </Flex>
          <Flex sx={{ alignItems: "center" }}>
            {status == "Loading" ? (
              <CircularProgress
                isIndeterminate
                color="#33455b"
                size="22px"
                sx={{ m: "auto" }}
              />
            ) : status == "Draft" ? (
              <Tooltip placement="bottom" label="Status: Draft">
                <Flex
                  sx={{
                    m: "auto",
                    width: "22px",
                    height: "22px",
                    cursor: "pointer",
                    borderRadius: "50%",
                    border: "1.5px solid #0285ff",
                    fontSize: 12,
                    justifyContent: "center",
                    color: "#fff",
                    bgColor: "#0285ff",
                  }}
                >
                  {data.app_index}
                </Flex>
              </Tooltip>
            ) : status == "Success" ? (
              <Tooltip placement="bottom" label={message}>
                <Flex>
                  <Icon
                    as={CheckSVG}
                    boxSize={"22px"}
                    sx={{
                      m: "auto",
                      cursor: "pointer",
                      fill: "#2A9006",
                      // border: "1px solid #34454E",
                      borderRadius: "50%",
                    }}
                  />
                </Flex>
              </Tooltip>
            ) : (
              <Tooltip placement="bottom" label={message}>
                <Flex>
                  <Icon
                    as={ErrorSVG}
                    boxSize={"22px"}
                    sx={{
                      m: "auto",
                      cursor: "pointer",
                      fill: "#FC2B2B",
                      // border: "1px solid #34454E",
                      borderRadius: "50%",
                    }}
                  />
                </Flex>
              </Tooltip>
            )}
          </Flex>
        </Flex>
        
        <Flex
          sx={{
            borderRadius: "12px",
            border: "1px solid #BDBDDA",
            p: "20px",
            gap: "20px",
          }}
        >
          <Tooltip label="Manage App">
            <Flex
              onClick={() => {
                if (
                  (data.app_index == 1 && data.provider == "webhook") ||
                  (data.app_index == 1 &&
                    data.app_type.toLowerCase() == "webhook_api") ||
                  data.app_type === "ADD_ON"
                ) {
                  toast({
                    position: "top",
                    status: "warning",
                    variant: "solid",
                    title: `${data.name} is not manageable.`,
                    duration: 2500,
                    containerStyle: {
                      fontWeight: 400,
                    },
                  });
                } else {
                  dispatch(onAccountDraw({ node_id: node_id, status: true }));
                  onOpen();
                }
              }}
            >
              <Icon
                as={FiSettings}
                boxSize={"20px"}
                sx={{
                  m: "auto",
                  cursor:
                    data.app_index == 1 && data.provider == "webhook"
                      ? "not-allowed"
                      : "pointer",
                  color: "#34454E",
                  "&:hover": {
                    color: "#34454E",
                  },
                }}
              />
            </Flex>
          </Tooltip>
          {hasTimer && (
            <Tooltip label={delayReady ?"Delay is Active":"Set Delay"}>
              <Flex>
                <Icon
                  onClick={() => {
                    onOpen();
                    setIsTimer(true);
                  }}
                  as={PiTimerThin}
                  boxSize={"20px"}
                  sx={{
                    m: "auto",
                    cursor: "pointer",
                    color: delayReady ? "#43A047" :"#34454E",
                    "&:hover": {
                      color: "#34454E",
                     
                    },
                  }}
                />
              </Flex>
            </Tooltip>
          )}

          <Tooltip label="Refresh">
            <Flex>
              <Icon
                onClick={helper.refresh}
                as={RiRefreshLine}
                boxSize={"20px"}
                sx={{
                  m: "auto",
                  cursor: "pointer",
                  color: "#34454E",
                  "&:hover": {
                    color: "#34454E",
                    transform: "rotate(95deg)",
                  },
                  transition: "transform 0.3s",
                }}
              />
            </Flex>
          </Tooltip>
          <Tooltip label="Delete">
            <Flex>
              <Icon
                onClick={helper.delete}
                as={AiOutlineDelete}
                boxSize={"20px"}
                sx={{
                  m: "auto",
                  cursor: "pointer",
                  color: "#34454E",
                  "&:hover": {
                    color: "#34454E",
                  },
                }}
              />
            </Flex>
          </Tooltip>
        </Flex>
        {isOpen && isTimer === false && data.type !== "ADD_ON" && (
          <AccountPanel
            isOpen={isOpen}
            onClose={onClose}
            accounts={accounts}
            data={data}
            node_id={node_id}
          />
        )}
        {isOpen && isTimer && (
          <DelayPanel
            isOpen={isOpen}
            onClose={onClose}
            accounts={accounts}
            data={data}
            node_id={node_id}
            nodeOuter={nodeOuter}
            timerConfigs={timerConfigs}
          />
        )}
      </Flex>
    );
  }
);

const AccountPanel = ({
  isOpen,
  onClose,
  accounts,
  data,
  node_id = "",
  dash = false,
}) => {
  const [accountList, setAccountList] = useState(accounts);
  const { isOpen: isOpenAcc, onToggle, onClose: onCloseAcc } = useDisclosure();
  const dispatch = useDispatch();
  const [tokenData, setTokenData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState({});
  const [loadingAdd, setLoadingAdd] = useState(false);
  let browser = window;
  const toast = useToast();
  let popup = null;
  let Oauthtimer = null;
  const watcher = () => {
    if (popup === null) {
      clearInterval(Oauthtimer);
      Oauthtimer = null;
    } else if (popup !== null && !popup.closed) {
      popup.focus();
    } else if (popup !== null && popup.closed) {
      clearInterval(Oauthtimer);
      dispatch(
        get_accounts({ nodeId: node_id, appId: data.id, toast: toast })
      ).then((res) => {
        setAccountList(res.payload);
        setLoading(false);
      });
      Oauthtimer = null;
      popup = null;
    }
  };
  const handleAddAccount = () => {
    setLoading(true);
    if (data.auth_type === "Token") {
      dispatch(
        getauthdata({
          app_id: data.id,
          redirect_url: process.env.APP_BASE_URL,
        })
      ).then((res) => {
        setTokenData(res.payload?.fields);
        res.payload?.fields.map((obj) => {
          setInputValue((c) => ({ ...c, [obj.id]: "" }));
        });
        setLoading(false);
        onToggle();
      });
    } else {
      if (popup && !popup.closed) {
        popup.focus();
        return;
      }
      const name = "OAuth Permissions";
      const opts = `dependent=${1}, alwaysOnTop=${1}, alwaysRaised=${1}, alwaysRaised=${1}, width=800, height=600`;
      popup = browser.open(
        `${process.env.APP_BASE_URL + "oauth/response"}/${
          data.id
        }/${AuthTokenService.get()}`,
        name,
        opts
      );
      if (Oauthtimer === null) {
        Oauthtimer = setInterval(watcher, 2000);
      }
    }
  };

  return (
    <Drawer
      isOpen={isOpen}
      placement="right"
      onClose={() => {
        dispatch(onAccountDraw({ node_id: node_id, status: false }));
        onClose();
      }}
    >
      <DrawerOverlay />
      <DrawerContent
        sx={{
          py: "20px",
          flexDir: "column",
          gap: "20px",
          justifyContent: "space-between",
        }}
      >
        <Flex
          sx={{
            px: "20px",
            pb: "10px",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1.5px solid #33454e",
          }}
        >
          <Flex
            sx={{
              gap: "4px",
              height: "30px",
              alignItems: "center",
            }}
          >
            <Flex sx={{ gap: "2px", height: "30px", alignItems: "center" }}>
              <Image src={data.image_url} height="100%" />{" "}
              <Tooltip label={data.name}>
                <Flex>
                  {data.name.length > 10
                    ? data.name.substring(0, 9) + ".."
                    : data.name}
                </Flex>
              </Tooltip>
            </Flex>
            - Manage Accounts
          </Flex>
        </Flex>
        <Flex position="relative" height="100%" width="100%">
          <Flex
            sx={{
              position: "absolute",
              height: "100%",
              right: 0,
              left: 0,
              top: 0,
              bottom: 0,
              overflowY: "auto",
              flexWrap: "wrap",
              rowGap: "10px",
              px: "20px",
            }}
          >
            <Wrap
              sx={{
                ".chakra-wrap__list": {
                  gap: "10px",
                },
              }}
              width="100%"
            >
              {accountList.length ? (
                accountList.map((acc, i) => {
                  return (
                    <AccountView
                      acc={acc}
                      key={i}
                      setAccountList={setAccountList}
                    />
                  );
                })
              ) : (
                <Flex flexDir="column" gap="5px">
                  <Flex>No Account Found.</Flex>
                  <Flex fontSize={13}>Please add an account to continue.</Flex>
                </Flex>
              )}
            </Wrap>
          </Flex>
        </Flex>
        <Popover
          returnFocusOnClose={false}
          isOpen={isOpenAcc}
          // onClose={onCloseAcc}
          placement="top"
          closeOnBlur={false}
        >
          <PopoverTrigger>
            {isOpenAcc ? (
              <Flex px="20px">
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
                      setLoadingAdd(true);
                      dispatch(
                        addAccount({
                          app_id: data.id,
                          auth_response: inputValue,
                        })
                      ).then((res) => {
                        // call the get accounts api and refresh the list

                        dispatch(
                          get_accounts({
                            nodeId: node_id,
                            appId: data.id,
                            toast: toast,
                          })
                        ).then((res) => {
                          setAccountList(res.payload);

                          setLoadingAdd(false);
                          onCloseAcc();
                        });
                        if (res.type === "addAccount/fulfilled") {
                          toast({
                            position: "top",
                            status: "success",
                            variant: "solid",
                            title: res.payload.status,
                            duration: 2500,
                            containerStyle: {
                              fontWeight: 400,
                            },
                          });
                        }
                        if (res.type === "addAccount/rejected") {
                          toast({
                            position: "top",
                            status: "error",
                            variant: "solid",
                            title: res.payload.status,
                            duration: 2500,
                            containerStyle: {
                              fontWeight: 400,
                            },
                          });
                        }
                      });
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
                    {loadingAdd ? (
                      <CircularProgress
                        isIndeterminate
                        color="#33455b"
                        size="20px"
                        sx={{ m: "auto" }}
                      />
                    ) : (
                      <>
                        <Icon
                          as={IoMdAddCircleOutline}
                          boxSize={"16px"}
                          sx={{
                            m: "auto 0px",
                            color: "#000",
                          }}
                        />
                        Add
                      </>
                    )}
                  </Flex>
                  <Flex
                    width="50%"
                    onClick={onCloseAcc}
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
            ) : (
              <Flex px="20px">
                <Flex
                  onClick={handleAddAccount}
                  sx={{
                    border: "1px solid #33454e",
                    borderRadius: "6px",
                    color: "#fff",
                    cursor: "pointer",
                    p: "10px",
                    width: "100%",
                    gap: "5px",
                    justifyContent: "center",
                    fontSize: 15,
                    bgColor: "#33454e",
                    "&:hover": {
                      "#icon": {
                        color: "#33454e",
                      },
                      color: "#33454e",
                      bgColor: "#fff",
                      border: "1px solid #33454e",
                    },
                    transition: "color 0.2s, background 0.2s, border 0.2s",
                  }}
                >
                  {loading ? (
                    <CircularProgress
                      isIndeterminate
                      color="#33455b"
                      size="22px"
                      sx={{ m: "auto" }}
                    />
                  ) : (
                    <>
                      <Icon
                        id="icon"
                        as={MdOutlineAdd}
                        boxSize={"18px"}
                        sx={{
                          m: "auto 0px",
                          color: "#fff",
                        }}
                      />
                      New Account
                    </>
                  )}
                </Flex>
              </Flex>
            )}
          </PopoverTrigger>
          {data.auth_type !== "API" && (
            <PopoverContent background="transparent" px="20px" border="none">
              <Flex
                width="100%"
                bgColor="white"
                // height="400px"
                sx={{
                  boxShadow: "0px 0px 6px -1px rgb(52,69,91)",
                  // border: "1px solid #33454e",
                  borderTopLeftRadius: "6px",
                  borderTopRightRadius: "6px",
                  gap: "10px",
                  pb: "10px",
                  flexDir: "column",
                }}
              >
                <Flex
                  sx={{
                    p: "10px",
                    borderBottom: "1px solid #33454e",
                    flexDir: "column",
                  }}
                >
                  <Flex> API integration</Flex>
                  <Flex>
                    {" "}
                    {tokenData[0]?.instructions ? (
                      <Box
                        sx={{
                          p: "5px",
                          textAlign: "left",
                          fontSize: "14px",
                        }}
                      >
                        <ul>
                          {eval(tokenData[0].instructions).map((name, i) => (
                            <div key={i} style={{ display: "flex" }}>
                              {i + 1 + ". " + " "}&nbsp;
                              <div
                                key={i}
                                style={{ margin: "0" }}
                                dangerouslySetInnerHTML={{
                                  __html: name,
                                }}
                              ></div>
                            </div>
                          ))}
                        </ul>
                      </Box>
                    ) : null}
                  </Flex>
                </Flex>
                <Flex flexDir="column" width="100%" p="10px" gap="10px">
                  {tokenData.map((field, i) => {
                    let words = field.name.split(" ");
                    for (let i = 0; i < words.length; i++) {
                      words[i] =
                        words[i].charAt(0).toUpperCase() +
                        words[i].slice(1).toLowerCase();
                    }
                    const str = words.join(" ");
                    return (
                      <Flex flexDir="column" key={i} gap="4px">
                        <Flex fontSize={12}>{`${i + 1}. ${str}`}</Flex>
                        <Input
                          placeholder={`Enter ${str}`}
                          value={inputValue[field.id]}
                          onChange={(e) => {
                            setInputValue((c) => ({
                              ...c,
                              [field.id]: e.target.value,
                            }));
                          }}
                        />
                      </Flex>
                    );
                  })}
                </Flex>
              </Flex>
            </PopoverContent>
          )}
        </Popover>
      </DrawerContent>
    </Drawer>
  );
};
const DelayPanel = ({
  isOpen,
  onClose,
  node_id = "",
  nodeOuter,
  timerConfigs,
}) => {
  const dispatch = useDispatch();
  const [scheduleDate, setScheduleDate] = useState(
   timerConfigs?.value ?timerConfigs?.value : new Date()
  );
  const options = [
    {
      value: 515,
      label: "Delay for",
      name: "Delay for",
      id: 515,
      selected: false,
    },
    {
      value: 328,
      label: "Delay Until",
      name: "Delay Until",
      id: 328,
      selected: false,
    },
  ];

  const delayConfigsOptions = [
    {
      value: 514,
      label: "Minutes",
      name: "Minutes",
      id: 514,
      selected: false,
    },
    {
      value: 322,
      label: "Hours",
      name: "Hours",
      id: 322,
      selected: false,
    },
    {
      value: 511,
      label: "Days",
      name: "Days",
      id: 511,
      selected: false,
    },
    {
      value: 3228,
      label: "Weeks",
      name: "Weeks",
      id: 3228,
      selected: false,
    },
  ];
  const handleSave = () => {
    if (timerConfigs.delay_type.label == "Delay Until") {
      if (scheduleDate !== null) {
        dispatch(
          setTimerConfigInApp({
            nodeId: node_id,
            type: "delayUntil",
            timerConfigs: {
              delay_type: {
                value: 328,
                label: "Delay Until",
                name: "Delay Until",
                id: 328,
                selected: false,
              },
              value: scheduleDate.target.value,
            },
          })
        );
      } else {
        dispatch(cancelTimer(node_id));
        // setDelayConf(delayConfInStore)
      }
    } else {
      if (
        timerConfigs.delay_unit?.value &&
        timerConfigs.delay_value !== "" &&
        timerConfigs.delay_type?.value
      ) {
        dispatch(
          setTimerConfigInApp({ nodeId: node_id, timerConfigs: timerConfigs })
        );
      }
    }
    onClose();
  };
  const handleCancelDelayConfig = () => {
    dispatch(cancelTimer(node_id));

    onClose();
  };

  return (
    <Drawer
      isOpen={isOpen}
      placement="right"
      onClose={() => {
        onClose();
      }}
    >
      <DrawerOverlay />
      <DrawerContent>
        <Flex
          sx={{
            px: "20px",
            pb: "10px",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1.5px solid #33454e",
          }}
        >
          <Flex
            sx={{
              gap: "4px",
              height: "30px",
              alignItems: "center",
            }}
          >
            <Flex sx={{ gap: "2px", height: "30px", alignItems: "center" }}>
              <RiTimerFill />
            </Flex>
            -- Set Parameters For Delay To Act
          </Flex>
        </Flex>
        <Flex
          sx={{
            flexDir: "column",

            justifyContent: "space-between",
          }}
        >
          <Box
            style={{
              fontWeight: "400",
              display: "flex",
              justifyContent: "center",
            }}
          >
            Select the type of Delay Config
          </Box>

          <Flex
            onMouseDownCapture={() => (nodeOuter.current.id = "")}
            onMouseEnter={() => nodeOuter?.current.classList.add("nopan")}
            onMouseLeave={() => nodeOuter?.current.classList.remove("nopan")}
            width="100%"
          >
            <ReactSelect
              blurInputOnSelect
              styles={selectStyle}
              onBlur={() => (nodeOuter.current.id = "drag")}
              placeholder="Delay For"
              value={timerConfigs?.delay_type}
              options={options}
              onChange={(selected) => {
                dispatch(
                  setTimerConfig({
                    timerSeq: "First",
                    value: selected,
                    nodeId: node_id,
                  })
                );
              }}
            />
          </Flex>
        </Flex>
        {timerConfigs &&
        timerConfigs.delay_type.label === "Delay for" &&
        timerConfigs.delay_type.label !== "Delay Until" ? (
          <>
            {" "}
            <Box
              style={{
                fontWeight: "400",
                display: "flex",
                justifyContent: "center",
              }}
            >
              Select the Duration
            </Box>
            <Flex
              onMouseDownCapture={() => (nodeOuter.current.id = "")}
              onMouseEnter={() => nodeOuter?.current.classList.add("nopan")}
              onMouseLeave={() => nodeOuter?.current.classList.remove("nopan")}
            >
              <ReactSelect
                blurInputOnSelect
                styles={selectStyle}
                onBlur={() => (nodeOuter.current.id = "drag")}
                placeholder="Select the Duration"
                value={timerConfigs?.delay_type}
                options={delayConfigsOptions}
                onChange={(selected) => {
                  dispatch(
                    setTimerConfig({
                      timerSeq: "Second",
                      value: selected,
                      nodeId: node_id,
                    })
                  );
                }}
              />
            </Flex>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Box
                style={{
                  fontWeight: "400",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                Provide values to your Duration
              </Box>
              <Input
                type="number"
                defaultValue={
                  timerConfigs?.delay_value ? timerConfigs?.delay_value : ""
                }
                sxProps={{
                  "& ~ span": {
                    color: "#B7CBFF !important",

                    pl: "5px",
                    width: "80%",
                    fontSize: "12px",
                    border: "0px solid red",
                  },
                }}
                width="100%"
                placeholder={"Enter Value"}
                onChange={(evt) => {
                  dispatch(
                    setTimerConfig({
                      delay_type: "input",
                      value: evt.target.value,
                      nodeId: node_id,
                    })
                  );
                }}
              />
            </Box>
            <Flex justifyContent="center" gap="20px" mt="10px">
              <Button
                onClick={handleSave}
                size="sm"
                sx={{ backgroundColor: "#12BDAD" }}
              >
                Save
              </Button>
              <Button
                onClick={handleCancelDelayConfig}
                size="sm"
                sx={{ backgroundColor: "#FE6463" }}
              >
                Cancel
              </Button>
            </Flex>
          </>
        ) : null}

        {timerConfigs && timerConfigs.delay_type.label === "Delay Until" ? (
          <>
            Date
            Date
                <Input
                  type="datetime-local"
                  placeholder="select date"
                  min={new Date().toISOString().slice(0, 16)}
                  onChange={(val) => {
                    
                    setScheduleDate(val);
                  }}
                  value={timerConfigs?.value}

                  style={{ border: "1px solid #B7C9FF", padding: "5px", backgroundColor:"#F3F7FF" }}
                />
          
            <Flex justifyContent="center" gap="20px" mt="10px">
              <Button
                onClick={handleSave}
                size="sm"
                sx={{ backgroundColor: "#12BDAD" }}
              >
                Save
              </Button>
              <Button
                onClick={handleCancelDelayConfig}
                size="sm"
                sx={{ backgroundColor: "#FE6463" }}
              >
                Cancel
              </Button>
            </Flex>
          </>
        ) : null}
      </DrawerContent>
    </Drawer>
  );
};

const AccountView = ({ acc, setAccountList }) => {
  const [edit, setEdit] = useState(false);
  const [value, setValue] = useState(acc.name);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const dispatch = useDispatch();
  return (
    <Flex
      width="100%"
      flexDir="column"
      sx={{ borderRadius: "6px", border: "1px solid #c5c5df" }}
    >
      <Flex position="relative" height="100%">
        {!edit ? (
          <Flex sx={{ p: "5px", fontSize: 15 }}>{value}</Flex>
        ) : (
          <Input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            autoFocus
            sx={{
              fontSize: 15,
              p: "5px !important",
              height: "none !important",
            }}
          />
        )}
        {loading && (
          <Flex
            position="absolute"
            sx={{
              top: "0px",
              right: "5px",
              height: "100%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CircularProgress
              isIndeterminate
              color="#33455b"
              size="20px"
              sx={{ m: "auto" }}
            />
          </Flex>
        )}
      </Flex>
      <Flex width="100%">
        <Flex
          width="50%"
          onClick={() => {
            if (edit) {
              setLoading(true);
              dispatch(editAccountName({ id: acc.id, label: value })).then(
                (res) => {
                  setLoading(false);
                  setEdit(false);
                  if (
                    res.type === "editAccountName/fulfilled" &&
                    res.payload.message === "SUCCESS"
                  ) {
                    toast({
                      position: "top",
                      status: "success",
                      variant: "solid",
                      title: "Successfully Changed the name of Account",
                      duration: 2500,
                      containerStyle: {
                        fontWeight: 400,
                      },
                    });
                  }
                }
              );
            } else setEdit(true);
          }}
          sx={{
            bgColor: "#edf2f6",
            justifyContent: "center",
            cursor: "pointer",
            borderBottomLeftRadius: "6px",
            p: "5px",
            gap: "7px",
            fontSize: 12,
            color: "#000",
          }}
        >
          <Icon
            as={edit ? RiSaveLine : BiEditAlt}
            boxSize={"16px"}
            sx={{
              m: "auto 0px",
              color: "#000",
            }}
          />
          {edit ? "Save" : "Edit"}
        </Flex>
        <Flex
          width="50%"
          onClick={() => {
            setLoading(true);
            dispatch(removeAccount({ appId: acc.id, status: "REMOVE" })).then(
              (res) => {
                setLoading(false);

                if (
                  res.type === "removeAccount/fulfilled" &&
                  res.payload.message === "SUCCESS"
                ) {
                  setAccountList((c) => c.filter((ac) => ac.id != acc.id));

                  toast({
                    position: "top",
                    status: "success",
                    variant: "solid",
                    title: res.payload.details,
                    duration: 2500,
                    containerStyle: {
                      fontWeight: 400,
                    },
                  });
                }
                if (
                  res.type === "removeAccount/fulfilled" &&
                  res.payload.message === "FAILURE"
                ) {
                  toast({
                    position: "top",
                    status: "error",
                    variant: "solid",
                    title:
                      "Cannot delete this account as it contains active Konnectz",
                    duration: 2500,
                    containerStyle: {
                      fontWeight: 400,
                    },
                  });
                }
              }
            );
          }}
          sx={{
            bgColor: "#bac5cc",
            justifyContent: "center",
            cursor: "pointer",
            borderBottomRightRadius: "6px",
            p: "5px",
            gap: "7px",
            fontSize: 12,
            color: "#000",
          }}
        >
          <Icon
            as={IoMdRemoveCircleOutline}
            boxSize={"16px"}
            sx={{
              m: "auto 0px",
              color: "#000",
            }}
          />
          Delete
        </Flex>
      </Flex>
    </Flex>
  );
};
