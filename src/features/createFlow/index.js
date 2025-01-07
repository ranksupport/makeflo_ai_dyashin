import React, { useEffect, useMemo, useRef, useState } from "react";
import ReactFlow, { ReactFlowProvider, useReactFlow } from "reactflow";
import { ImUpload } from "react-icons/im";
import "reactflow/dist/style.css";
import { MdDataSaverOff } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { LuShrink } from "react-icons/lu";
import { MdArrowBack } from "react-icons/md";
import { Routes, Route, useParams } from "react-router-dom";
import {
  closeAllAdditionalResponse,
  onEdgesChange,
  onNodesChange,
  onSelectAction,
  onSelectTrigger,
  onTriggerSearch,
  redo,
  resetCanvas,
  setFlowName,
  undo,
} from "../../store/slices/flowSlice";
import {
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
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
  Portal,
  Tooltip,
  Wrap,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { WebhookInner } from "../../components/node/type/webhook";
import { ActionNode } from "../../components/node/type/actionode";
import { getApps } from "../../store/thunk/appThunk";
import { MdOutlineAppRegistration } from "react-icons/md";
import {
  AiOutlineAppstoreAdd,
  AiOutlineRedo,
  AiOutlineUndo,
  AiOutlineZoomIn,
  AiOutlineZoomOut,
} from "react-icons/ai";
import { MdOutlineWorkspacePremium } from "react-icons/md";
import { nanoid } from "@reduxjs/toolkit";
import {
  get_Events,
  get_accounts,
  saveFlow,
  deleteFlow,
  getFlow,
} from "../../store/thunk/flowThunk";
import { ButtonEdge } from "../../components/node/ui/buttonEdge";
import { useNavigate } from "react-router-dom";
import { createBrowserHistory } from "history";
import { InHouse } from "../../components/node/type/inHouse";
import { Formatter } from "../../components/node/type/formatter";
import { Generator } from "../../components/node/type/generator";
import { Filter } from "../../components/node/type/filter";
import { Scheduler } from "../../components/node/type/scheduler";
import { Api } from "../../components/node/type/api";
import { TriggerNode } from "../../components/node/type/triggernode";
export const CreateFlow = () => {
  const [canvasLoad, setCanvasLoad] = useState(true);
  const [reactFlowInstance, setReactFlowInstance] = useState();
  const dispatch = useDispatch();
  const [appType, setAppType] = useState(true);
  const history = createBrowserHistory();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const nodes = useSelector((state) => state.canvas.flowState.apps);
  const edges = useSelector((state) => state.canvas.flowState.links);
  const selectData = useSelector(
    (state) => state.canvas.flowState.dataForSelect
  );
  let { id } = useParams();
  console.group("FLOW-STATE");
  console.log("Node :", nodes);
  console.log("Link: ", edges);
  console.groupEnd();
  const nodeTypes = useMemo(
    () => ({
      WebhookInner: WebhookInner,
      ActionNode: ActionNode,
      InHouse: InHouse,
      Formatter: Formatter,
      Generator: Generator,
      Filter: Filter,
      Scheduler: Scheduler,
      Api: Api,
      TriggerNode: TriggerNode,
    }),
    []
  );
  const edgeTypes = useMemo(
    () => ({
      buttonedge: ButtonEdge,
    }),
    []
  );
  useEffect(() => {
    dispatch(getApps()).then((res) => {
      if (res.payload.length) {
        setCanvasLoad(false);
      }
    });
    history.listen((update) => {
      if (update.action === "POP") {
        dispatch(resetCanvas());
      }
    });
    if (id) {
      dispatch(getFlow(id));
    }
  }, []);

  return (
    <ReactFlowProvider>
      <Flex sx={{ width: "100vw", height: "100vh", flexDir: "column" }}>
        {!canvasLoad ? (
          <>
            <Topbar length={nodes.length} />
            <Flex sx={{ position: "relative", height: "100%", width: "100%" }}>
              <ReactFlow
                nodes={nodes}
                edges={edges}
                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes}
                connectionLineStyle={{
                  stroke: "rgb(247, 150, 10)",
                  strokeWidth: 3,
                }}
                onInit={(inst) => {
                  setReactFlowInstance(inst);
                }}
                connectionRadius={25}
                onNodesChange={(c) => dispatch(onNodesChange(c))}
                minZoom={0.3}
                maxZoom={2}
                style={{
                  background:
                    "linear-gradient(128deg, rgb(238,241,246) 0%, rgb(216,222,226) 74%)",
                }}
                onEdgesChange={(c) => dispatch(onEdgesChange(c))}
                zoomOnDoubleClick={false}
              />
              {!nodes.length ? (
                <ChooseTrigger />
              ) : (
                <Panel
                  setAppType={setAppType}
                  onOpen={onOpen}
                  reactFlowInstance={reactFlowInstance}
                />
              )}
            </Flex>
          </>
        ) : (
          <>
            <Flex sx={{ m: "auto", gap: "10px", flexDir: "column" }}>
              <CircularProgress
                isIndeterminate
                color="#33455b"
                sx={{ m: "auto" }}
              />
              Loading...
            </Flex>
          </>
        )}
      </Flex>
      {isOpen && (
        <AppPanel isOpen={isOpen} onClose={onClose} appType={appType} />
      )}
    </ReactFlowProvider>
  );
};

const Panel = ({ setAppType, onOpen, reactFlowInstance }) => {
  const dispatch = useDispatch();
  const panelOpt = [
    {
      icon: MdOutlineWorkspacePremium,
      label: "Add-Ons",
    },
    {
      icon: AiOutlineAppstoreAdd,
      label: "Add Action",
    },
    {
      icon: AiOutlineZoomOut,
      label: "Zoom Out",
    },
    {
      icon: AiOutlineZoomIn,
      label: "Zoom In",
    },
    {
      icon: AiOutlineUndo,
      label: "Undo",
    },
    {
      icon: AiOutlineRedo,
      label: "Redo",
    },
    {
      icon: LuShrink,
      label: "Eagle Eye",
    },
  ];

  return (
    <Flex
      sx={{
        position: "absolute",
        right: "20px",
        bottom: "40px",
        gap: "10px",
        flexDir: "column",
      }}
    >
      {panelOpt.map((opt, i) => {
        return (
          <Tooltip
            key={i}
            label={opt.label}
            placement="left"
            sx={{
              fontSize: i == 1 ? 16 : 14,
              bgColor: "#fff",
              color: "#34455B",
              p: "5px",
              px: "10px",
            }}
          >
            <Flex
              key={i}
              onClick={() => {
                switch (i) {
                  case 0:
                    setAppType("addons");
                    onOpen();
                    break;
                  case 1:
                    setAppType("apps");
                    onOpen();
                    break;
                  case 2:
                    reactFlowInstance.zoomOut();
                    break;
                  case 3:
                    reactFlowInstance.zoomIn();
                    break;
                  case 4:
                    dispatch(undo());
                    break;
                  case 5:
                    dispatch(redo());
                    break;
                  case 6:
                    reactFlowInstance.fitView();
                    break;
                }
              }}
              sx={{
                "&:hover": {
                  "#icon": {
                    transform: "scale(1.05)",
                  },
                },
              }}
            >
              <Icon
                id="icon"
                as={opt.icon}
                boxSize={i == 1 ? "70px" : "50px"}
                sx={{
                  m: "auto",
                  transition: "transform 0.2s",
                  boxShadow: "0px 0px 10px -4px rgb(52,69,91)",
                  cursor: "pointer",
                  color: "#34455B",
                  p: "15px",
                  borderRadius: "50%",
                  bgColor: "#fff",
                }}
              />
            </Flex>
          </Tooltip>
        );
      })}
    </Flex>
  );
};

const ChooseTrigger = () => {
  const dispatch = useDispatch();
  const triggers = useSelector((state) => state.apps.triggers);
  const searching = useSelector((state) => state.canvas.triggerSearch);
  const searchDiv = useRef();
  const [searchValue, setSearchValue] = useState(triggers);
  const toast = useToast();
  const onSearch = (e) => {
    if (!e.target.value) {
      setSearchValue(triggers);
    } else {
      const searchResult = triggers.filter((app) =>
        app.name.toLowerCase().includes(e.target.value.toLowerCase())
      );
      setSearchValue(searchResult);
    }
  };
  const onSelectTriggerApp = ({ app_detail }) => {
    const node_id = nanoid();
    dispatch(
      onSelectTrigger({
        app_detail: app_detail,
        posX: searchDiv.current?.getBoundingClientRect().left,
        posY: searchDiv.current?.getBoundingClientRect().top - 74,
        node_id: node_id,
      })
    );
    if (
      app_detail.provider.toLowerCase() !== "webhook" &&
      app_detail.provider.toLowerCase() !== "conditioner"
    ) {
      dispatch(
        get_Events({ nodeId: node_id, appId: app_detail.id, toast: toast })
      );
    }
    if (
      app_detail.app_type !== "WEBHOOK" &&
      app_detail.app_type !== "ADD_ON" &&
      app_detail.app_type.toLowerCase() !== "webhook_api"
    ) {
      dispatch(
        get_accounts({ nodeId: node_id, appId: app_detail.id, toast: toast })
      ).then((res) => {
        if (res.payload?.length === 0) {
          toast({
            position: "top",
            status: "warning",
            variant: "solid",
            title:
              "Please Manage the app by authorizing the accounts as you have no accounts authorised",
            duration: 2500,
            containerStyle: {
              fontWeight: 400,
            },
          });
        }
      });
    }
  };
  return (
    <Flex
      sx={{
        position: "absolute",
        top: "0px",
        bottom: "0px",
        left: "0px",
        right: "0px",
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center",
      }}
    >
      {searching ? (
        <Flex
          flexDir="column"
          ref={searchDiv}
          sx={{
            p: "20px",
            gap: "20px",
            height: "500px",
            bgColor: "#fff",
            width: "450px",
            borderRadius: "4px",
            boxShadow: "0px 0px 10px 1px rgb(52,69,91, 0.5)",
          }}
        >
          <Flex gap="10px">
            <Input
              onChange={onSearch}
              autoFocus
              placeholder="Search in 1000+ applications"
            />
          </Flex>
          <Flex position="relative" height="500px">
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
              }}
            >
              <Wrap
                sx={{
                  ".chakra-wrap__list": {
                    gap: "0px",
                  },
                }}
                width="100%"
              >
                {searchValue.map((app, i) => {
                  return (
                    <Flex
                      key={i}
                      width={1 / 6}
                      p={1}
                      sx={{ justifyContent: "center" }}
                    >
                      <Tooltip label={app.name} hasArrow arrowSize={8}>
                        <Flex
                          onClick={() =>
                            onSelectTriggerApp({
                              app_detail: app,
                            })
                          }
                          flexDir="column"
                          width="100%"
                          sx={{
                            justifyContent: "center",
                            alignItems: "center",
                            cursor: "pointer",
                            "&:hover": {
                              "#img": {
                                transform: "scale(1.15)",
                              },
                              "#name": {
                                fontWeight: 800,
                              },
                            },
                          }}
                        >
                          <Image
                            id="img"
                            src={app.image_url}
                            width="80%"
                            sx={{ transition: "transform 0.3s" }}
                          />
                          <Flex
                            id="name"
                            fontSize="10px"
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
                      </Tooltip>
                    </Flex>
                  );
                })}
              </Wrap>
            </Flex>
          </Flex>
        </Flex>
      ) : (
        <Flex
          sx={{
            m: "auto",
            width: "180px",
            flexDir: "column",
            color: "#34455B",
            textAlign: "center",
            gap: "7px",
            zIndex: 2,
          }}
        >
          <Flex
            sx={{
              fontWeight: 700,
              fontSize: 16,
              justifyContent: "center",
            }}
          >
            Choose Trigger
          </Flex>
          <Flex sx={{ fontWeight: 500, fontSize: 14 }}>
            Select Trigger to create a workflow.
          </Flex>
          <Icon
            as={MdOutlineAppRegistration}
            boxSize={"60px"}
            sx={{ m: "auto", cursor: "pointer", color: "#34455B" }}
            onClick={() => {
              dispatch(onTriggerSearch());
            }}
          />
        </Flex>
      )}
    </Flex>
  );
};

const AppPanel = ({ isOpen, onClose, appType }) => {
  const toast = useToast();

  const addons = useSelector((state) => state.apps.addOnList);
  const actions = useSelector((state) => state.apps.actions);
  const [searchValue, setSearchValue] = useState(
    appType == "addons" ? addons : actions
  );
  const dispatch = useDispatch();
  const reactFlowInstance = useReactFlow();
  const onSearch = (e) => {
    if (!e.target.value) {
      setSearchValue(appType == "addons" ? addons : actions);
    } else {
      const searchResult =
        appType == "addons"
          ? addons.filter((app) =>
              app.name.toLowerCase().includes(e.target.value.toLowerCase())
            )
          : actions.filter((app) =>
              app.name.toLowerCase().includes(e.target.value.toLowerCase())
            );
      setSearchValue(searchResult);
    }
  };
  const onSelectActionApp = ({ app_detail }) => {
    const node_id = nanoid();
    dispatch(closeAllAdditionalResponse());

    dispatch(
      onSelectAction({
        app_detail: app_detail,
        node_id: node_id,
        toast: toast,
      })
    );
    if (
      app_detail.provider.toLowerCase() !== "webhook" &&
      app_detail.provider.toLowerCase() !== "conditioner"
    ) {
      dispatch(
        get_Events({ nodeId: node_id, appId: app_detail.id, toast: toast })
      );
    }
    if (app_detail.app_type !== "WEBHOOK" && app_detail.app_type !== "ADD_ON") {
      dispatch(
        get_accounts({ nodeId: node_id, appId: app_detail.id, toast: toast })
      ).then((res) => {
        if (res.payload?.length === 0) {
          toast({
            position: "top",
            status: "success",
            variant: "solid",
            title: "Please Manage the app by authorizing the accounts",
            duration: 2500,
            containerStyle: {
              fontWeight: 400,
            },
          });
        }
      });
    }
  };
  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
      <DrawerOverlay />
      <DrawerContent sx={{ p: "20px", flexDir: "column", gap: "20px" }}>
        <Input
          onChange={onSearch}
          autoFocus
          placeholder={
            appType == "addons"
              ? "Search in Add Ons"
              : "Search in 1000+ applications"
          }
        />
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
            }}
          >
            <Wrap
              sx={{
                ".chakra-wrap__list": {
                  gap: "0px",
                },
              }}
              width="100%"
            >
              {searchValue.map((app, i) => {
                return (
                  <Flex
                    key={i}
                    width={1 / 4}
                    p={1}
                    sx={{ justifyContent: "center" }}
                  >
                    <Tooltip label={app.name} hasArrow arrowSize={8}>
                      <Flex
                        onClick={() => {
                          onSelectActionApp({
                            app_detail: app,
                          });
                          onClose();
                          setTimeout(() => {
                            reactFlowInstance.fitView();
                          }, 0);
                        }}
                        flexDir="column"
                        width="100%"
                        sx={{
                          justifyContent: "center",
                          alignItems: "center",
                          cursor: "pointer",
                          "&:hover": {
                            "#img": {
                              transform: "scale(1.15)",
                            },
                            "#name": {
                              fontWeight: 800,
                            },
                          },
                        }}
                      >
                        <Image
                          id="img"
                          src={app.image_url}
                          width="80%"
                          sx={{ transition: "transform 0.3s" }}
                        />
                        <Flex
                          id="name"
                          fontSize="10px"
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
                    </Tooltip>
                  </Flex>
                );
              })}
            </Wrap>
          </Flex>
        </Flex>
      </DrawerContent>
    </Drawer>
  );
};

const Topbar = ({ length }) => {
  const flowName = useSelector((state) => state.canvas.flowState.flowName);
  const [editing, setEditing] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const { id } = useParams();
  return (
    <Flex
      height="80px"
      bgColor="#fff"
      sx={{
        boxShadow: "0px 0px 10px 1px rgb(52,69,91, 0.5)",
        zIndex: 1,
        justifyContent: "space-between",
        alignItems: "center",
        px: "20px",
        position: "relative",
      }}
    >
      <Flex
        onClick={() => {
          if (length > 0) {
            setIsOpen(true);
          } else {
            dispatch(resetCanvas());
            navigate("/dashboard");
          }
        }}
        sx={{
          gap: "5px",
          cursor: "pointer",
          borderRadius: "6px",
          border: "1px solid #33455b",
          px: "10px",
          py: "5px",
          zIndex: 2,
          transition: "color 0.3s, background 0.3s",
          "&:hover": {
            "#icon": {
              color: "#fff",
            },
            bgColor: "#33455b",
            color: "#fff",
          },
        }}
      >
        <Icon
          id="icon"
          as={MdArrowBack}
          boxSize={"20px"}
          sx={{
            m: "auto 0px",
            color: "#34455B",
            transition: "color 0.3s, background 0.3s",
          }}
        />
        Dashboard
      </Flex>
      {isOpen === true && (
        <PopUpForBckButton isOpen={true} setIsOpen={setIsOpen} />
      )}
      <Flex
        sx={{
          position: "absolute",
          top: "0px",
          right: "0px",
          left: "0px",
          bottom: "0px",
          width: "100%",
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 0,
        }}
      >
        {editing ? (
          <Input
            placeholder="Enter the name of the flow"
            onBlur={(e) => {
              setEditing(false);
            }}
            value={flowName || null}
            autoFocus
            onChange={(e) => dispatch(setFlowName(e.target.value))}
            sx={{
              color: "#33455b",
              cursor: "pointer",
              width: "300px",
              borderRadius: "6px",
              border: "1px solid #33455b",
              px: "15px !important",
              py: "5px !important",
              zIndex: 1,
              bgColor: "#dfe4e8",
              outline: "none",
              "&:focus-visible": {
                border: "1px solid #33455b",
                boxShadow: "none",
              },
            }}
          />
        ) : (
          <Tooltip
            placement="right"
            label="Click to Edit"
            sx={{ px: "15px", py: "5px", fontSize: 16 }}
          >
            <Flex
              onClick={() => setEditing(true)}
              sx={{
                color: "#33455b",
                width: "300px",
                cursor: "pointer",
                borderRadius: "6px",
                border: "1px solid #33455b",
                px: "15px",
                py: "5px",
                zIndex: 1,
                transition: "color 0.3s, background 0.3s",
                "&:hover": {
                  bgColor: "#dfe4e8",
                  color: "#33455b",
                },
              }}
            >
              {flowName.length ? flowName : "Name of the Flow"}
            </Flex>
          </Tooltip>
        )}
      </Flex>
      <Flex sx={{ gap: "20px", zIndex: 2 }}>
        <Flex
          sx={{
            gap: "5px",
            cursor: "pointer",
            borderRadius: "6px",
            border: "1px solid #33455b",
            px: "15px",
            py: "5px",
            transition: "color 0.3s, background 0.3s",
            "&:hover": {
              "#icon": {
                color: "#fff",
              },
              bgColor: "#33455b",
              color: "#fff",
            },
          }}
          onClick={() => {
            dispatch(closeAllAdditionalResponse());
            dispatch(saveFlow({ publish: false, toast: toast })).then((res) => {
              if ((res.type = "saveFlow/fulfilled") && !res.error) {
                //uncomment it after completion
                // dispatch(resetCanvas());

                toast({
                  position: "top",
                  status: "success",

                  variant: "solid",
                  title: res.payload.message,
                  duration: 2500,
                  containerStyle: {
                    fontWeight: 400,
                  },
                });
                navigate("/flows/home");
              }
            });
          }}
        >
          {" "}
          <Icon
            id="icon"
            as={MdDataSaverOff}
            boxSize={"20px"}
            sx={{
              m: "auto 0px",
              color: "#34455B",
              transition: "color 0.3s, background 0.3s",
            }}
          />
          Save
        </Flex>
        <Flex
          onClick={() => {
            dispatch(closeAllAdditionalResponse());
            dispatch(saveFlow({ publish: true, toast: toast })).then((res) => {
              if ((res.type = "saveFlow/fulfilled") && !res.error) {
                //uncomment it after completion
                // dispatch(resetCanvas());
                toast({
                  position: "top",
                  status: "success",
                  variant: "solid",
                  title: res.payload.message,
                  duration: 2500,
                  containerStyle: {
                    fontWeight: 400,
                  },
                });
                navigate("/flows/home");
              }
            });
          }}
          sx={{
            gap: "5px",
            cursor: "pointer",
            borderRadius: "6px",
            border: "1px solid #33455b",
            px: "15px",
            py: "5px",
            transition: "color 0.3s, background 0.3s",
            "&:hover": {
              "#icon": {
                color: "#fff",
              },
              bgColor: "#33455b",
              color: "#fff",
            },
          }}
        >
          {" "}
          <Icon
            id="icon"
            as={ImUpload}
            boxSize={"20px"}
            sx={{
              m: "auto 0px",
              color: "#34455B",
              transition: "color 0.3s, background 0.3s",
            }}
          />
          Publish
        </Flex>
      </Flex>
    </Flex>
  );
};

const PopUpForBckButton = ({ setIsOpen, isOpen }) => {
  const dispatch = useDispatch();
  const toast = useToast();
  const navigate = useNavigate();
  const id = useParams();
  return (
    <Popover
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      sx={{ mt: "80px" }}
    >
      <Portal>
        <PopoverContent style={{ marginTop: "80px", marginLeft: "20px" }}>
          <PopoverArrow />
          <PopoverHeader>Do You Want to Save the Flow?</PopoverHeader>
          <PopoverCloseButton />
          <PopoverBody>
            <Flex justify="space-between" gap="10px">
              <Button
                sx={{ backgroundColor: "#12BDAD", flex: 1 }}
                onClick={() => {
                  dispatch(saveFlow({ publish: false, toast: toast })).then(
                    (res) => {
                      if ((res.type = "saveFlow/fulfilled") && !res.error) {
                        //uncomment it after completion

                        toast({
                          position: "top",
                          status: "success",

                          variant: "solid",
                          title: res.payload.message,
                          duration: 2500,
                          containerStyle: {
                            fontWeight: 400,
                          },
                        });
                      }
                    }
                  );
                  dispatch(resetCanvas());
                  navigate("/dashboard");
                }}
              >
                Yes
              </Button>
              <Button
                sx={{ backgroundColor: "#FE6463", flex: 1 }}
                onClick={() => {
                  //delete konnectactividId api if flowReady
                  if (isNaN(id.id)===true) {
                   
                    dispatch(deleteFlow());
                  }

                  dispatch(resetCanvas());
                  navigate("/dashboard");
                }}
              >
                No
              </Button>
            </Flex>
          </PopoverBody>
        </PopoverContent>
      </Portal>
    </Popover>
  );
};
