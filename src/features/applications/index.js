import {
  Box,
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
  Tooltip,
  Wrap,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { RiSaveLine, RiSearch2Line } from "react-icons/ri";
import InfiniteScroll from "react-infinite-scroll-component";
import {
  MdOutlineAdd,
  MdOutlineCancel,
} from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import {
  addAccount,
  editAccountName,
  getApp,
  getauthdata,
  removeAccount,
  searchApp,
} from "../../store/thunk/appThunk";
import { setActiveNav } from "../../store/slices/shellSlice";
import AuthTokenService from "../../utils/AuthTokenService";
import { useNavigate } from "react-router-dom";
import { IoMdAddCircleOutline, IoMdRemoveCircleOutline } from "react-icons/io";
import {  get_accounts_for_app_page } from "../../store/thunk/flowThunk";
import { BiEditAlt } from "react-icons/bi";
import { Topbar } from "../../components/shell";

export const Applications = () => {
  const { addOnloading, addOnList, appsLoading, appsList } = useSelector(
    (state) => state.apps
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [listedApp, setListedApp] = useState([]);
  const [pageSize, setPageSize] = useState(80);
  const [searching, setSearching] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [data, setData] = useState();
  useEffect(() => {
    dispatch(getApp({ page_size: pageSize })).then((res) => {
      if (res.error) {
        dispatch(setActiveNav(1));
        AuthTokenService.clear();
        navigate("/login");
      } else {
        setListedApp(res.payload.apps);
      }
    });
  }, [pageSize]);

  const handleChange = (e) => {
    if (!e.target.value) {
      setListedApp(appsList);
      setSearching(false);
    } else {
      setSearching(true);
      e.target.value.length > 1 &&
        dispatch(searchApp({ search_query: e.target.value })).then((res) => {
          if (res.payload.apps.length > 0) {
            setListedApp(res.payload.apps);
          } else setListedApp([]);
        });
    }
  };
  return (
    <>
      <Topbar heading="APPLICATIONS" />
      <Flex
        sx={{
          width: "100%",
          height: "100%",
          overflowY: "auto",
          overflowX: "hidden",
          flexDir: "column",
          gap: "20px",
        }}
      >
        <Flex
          width="100%"
          sx={{
            justifyContent: "space-between",
          }}
        >
          <Flex width="400px" sx={{  }}>
            <Flex>
              <Icon
                as={RiSearch2Line}
                boxSize={"20px"}
                sx={{
                  m: "auto 5px auto 0px",
                  cursor: "pointer",
                  fill: "#32445b",
                }}
              />
            </Flex>
            <Input
              onChange={handleChange}
              placeholder="Search in 1000+ Applications"
              sx={{
                border: "none",
                outline: "none",
                bgColor: "transparent",

                borderRadius: "none",
                "&:focus-visible": {
                  border: "none",

                  boxShadow: "none",
                },
              }}
            />
          </Flex>
        </Flex>
        <Flex position="relative" height="100%" width="100%">
          <Flex
            id="scrollableDiv1"
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
            }}
          >
            <InfiniteScroll
              dataLength={listedApp.length || 0} //This is important field to render the next data
              next={() => setPageSize((c) => c + 20)}
              hasMore={listedApp.length > 1000 ? false : true}
              pullDownToRefresh={false}
              scrollableTarget="scrollableDiv1"
              endMessage={
                <p style={{ textAlign: "center" }}>
                  <b>END</b>
                </p>
              }
              loader={
                !searching && (
                  <Flex width="80px" sx={{ m: "20px auto", stroke: "#162c73" }}>
                    <CircularProgress
                      isIndeterminate
                      color="#33455b"
                      size="50px"
                      sx={{ m: "auto" }}
                    />
                  </Flex>
                )
              }
            >
              <Wrap
                sx={{
                  ".chakra-wrap__list": {
                    gap: "0px",
                  },
                }}
                width="100%"
              >
                {appsLoading
                  ? ""
                  : listedApp.map((app, i) => {
                      return (
                        <Tooltip key={i} label={`Manage ${app.name}`} hasArrow>
                          <Flex
                            key={i}
                            width={1 / 11}
                            p={2}
                            sx={{
                              justifyContent: "center",
                            }}
                          >
                            <Flex
                              onClick={() => {
                                onOpen();
                                setData(app);
                              }}
                              flexDir="column"
                              width="100%"
                              sx={{
                                // border: "1px solid #7b8a9e",
                                borderRadius: "6px",
                                bgColor: "#fff",
                                py: "10px",
                                gap: "10px",
                                justifyContent: "center",
                                alignItems: "center",
                                cursor: "pointer",
                                transition: "outline 0.3s, box-shadow 0.3s",
                                boxShadow: "xl",
                                "&:hover": {
                                  boxShadow: "xxl",
                                  "#img": {
                                    transform: "scale(1.05)",
                                  },
                                  "#name": {
                                    fontWeight: 800,
                                  },
                                },
                              }}
                            >
                              <Flex
                                id="img"
                                width="80%"
                                sx={{
                                  position: "relative",
                                  transition: "transform 0.3s",
                                }}
                              >
                                <Image
                                  width="100%"
                                  src={app.image_url}
                                  sx={{ m: "auto" }}
                                />
                                <Box
                                  sx={{
                                    display:
                                      app.account_count > 0 ? "flex" : "none",
                                    position: "absolute",
                                    right: "0px",
                                    top: "0px",
                                    width: "15px",
                                    height: "15px",
                                    borderRadius: "50%",
                                    bgColor: "#152d73",
                                    color: "#fff",
                                    justifyContent: "center",
                                    p: "2px",
                                    fontSize: 7,
                                  }}
                                >
                                  {app.account_count}
                                </Box>
                                <Box
                                  sx={{
                                    display:
                                      app.status === "Beta" ? "flex" : "none",
                                    position: "absolute",
                                    left: "0px",
                                    top: "0px",
                                    bgColor: "#f7c544",
                                    color: "#fff",
                                    justifyContent: "center",
                                    py: "2px",
                                    borderTopLeftRadius: "4px",
                                    borderBottomRightRadius: "4px",
                                    px: "5px",
                                    fontSize: 7,
                                  }}
                                >
                                  {app.status}
                                </Box>
                              </Flex>

                              <Flex
                                id="name"
                                fontSize={12}
                                textAlign="center"
                                sx={{
                                  transition: "transform 0.3s, fontWeight 0.3s",
                                }}
                              >
                                {app.name.length > 9
                                  ? app.name.slice(0, 7) + "..."
                                  : app.name}
                              </Flex>
                            </Flex>
                          </Flex>
                        </Tooltip>
                      );
                    })}{" "}
              </Wrap>
            </InfiniteScroll>
          </Flex>
        </Flex>
        {isOpen && (
          <AccountPanel isOpen={isOpen} onClose={onClose} data={data} />
        )}
      </Flex>
    </>
  );
};

const AccountPanel = ({ isOpen, onClose, accounts = [], data }) => {
  const [accountList, setAccountList] = useState(accounts);
  const { isOpen: isOpenAcc, onToggle, onClose: onCloseAcc } = useDisclosure();
  const dispatch = useDispatch();
  const [tokenData, setTokenData] = useState([]);
  const [panelLoading, setPanelLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState({});
  const [loadingAdd, setLoadingAdd] = useState(false);
  let browser = window;
  let popup = null;
  let Oauthtimer = null;
  const toast=useToast()
  useEffect(() => {
    dispatch( get_accounts_for_app_page({ appId: data.id })).then((res) => {
      setAccountList(res.payload);
      setPanelLoading(false);
    });
  }, []);
  const watcher = () => {
    if (popup === null) {
      clearInterval(Oauthtimer);
      Oauthtimer = null;
    } else if (popup !== null && !popup.closed) {
      popup.focus();
    } else if (popup !== null && popup.closed) {
      clearInterval(Oauthtimer);
      dispatch( get_accounts_for_app_page({ appId: data.id })).then((res) => {
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
        {panelLoading ? (
          <CircularProgress
            isIndeterminate
            color="#33455b"
            size="30px"
            sx={{ m: "auto" }}
          />
        ) : (
          <>
            {" "}
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
                      <Flex fontSize={13}>
                        Please add an account to continue.
                      </Flex>
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
                               get_accounts_for_app_page({
                                appId: data.id,
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
                <PopoverContent
                  background="transparent"
                  px="20px"
                  border="none"
                >
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
                      }}
                    >
                      API integration
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
          </>
        )}
      </DrawerContent>
    </Drawer>
  );
};

const AccountView = ({ acc, setAccountList }) => {
  const [edit, setEdit] = useState(false);
  const [value, setValue] = useState(acc.name);
  const [loading, setLoading] = useState(false);
const toast=useToast()
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
