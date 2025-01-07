import {
  Checkbox,
  CircularProgress,
  Flex,
  Icon,
  Input,
  Tooltip,
  Popover,
  PopoverTrigger,
  PopoverContent,
  useToast,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Portal,
  PopoverArrow,
  PopoverHeader,
  PopoverCloseButton,
  PopoverBody,
  Button,
} from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import { Topbar } from "../../components/shell";
import { PiFolderSimpleStarFill, PiFolderSimpleUserFill } from "react-icons/pi";
import { MdOutlineDeleteSweep } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaSquareCheck } from "react-icons/fa6";
import { setFlowNav } from "../../store/slices/dashflowSlice";
import { PiFolderFill } from "react-icons/pi";
import { PiFolderSimplePlus } from "react-icons/pi";
import { BsThreeDotsVertical } from "react-icons/bs";
import { MdOutlineDriveFileRenameOutline } from "react-icons/md";
import {
  createFolder,
  deleteFolder,
  fetchFolder,
  getKonnectsByFolder,
  getKonnectsList,
  renameFolderCall,
  searchKonnectz,
} from "../../store/thunk/dashflowThunk";
import { LuSearch } from "react-icons/lu";
import InfiniteScroll from "react-infinite-scroll-component";
import { RiFileEditLine } from "react-icons/ri";
import { RiFileCloseLine } from "react-icons/ri";
import { FaUncharted } from "react-icons/fa6";
import { deleteFlowWithId, getFlow } from "../../store/thunk/flowThunk";
//import { MdOutlineDriveFileMove } from "react-icons/md";
//import { PiFolderFill } from "react-icons/pi";
//import { moveFlow } from "../../store/thunk/flowThunk";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { MdOutlineDriveFileMove } from "react-icons/md";
import { moveFlowsToFolder } from "../../store/thunk/dashflowThunk"; // You need to create this action
export const Flows = () => {
  const [folderList, setFolderList] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const { index } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(fetchFolder()).then((res) => {
      setFolderList(res?.payload?.folders);
      res?.payload?.folders.map((item, i) => {
        if (item.id == index) {
          dispatch(setFlowNav(i));
        } else if (index == "home") {
          dispatch(setFlowNav(-1));
        }
      });
    });
  }, []);
  const toast = useToast();
  const loading = useSelector((state) => state.dashflow.folder_loading);
  const activeRoute = useSelector((state) => state.dashflow.flow_nav);
  const initialFocusRef = useRef();
  const [folderAdd, setFolderAdd] = useState(false);
  const [folderName, setFolderName] = useState("");
  return (
    <>
      <Topbar heading="FLOWS" />
      <Flex
        sx={{
          width: "100%",
          height: "100%",
          borderRadius: "12px",
          bgColor: "#fff",
          boxShadow: "lg",
        }}
      >
        <Flex
          sx={{
            width: "400px",
            bgColor: "#fff",
            p: "20px 0px 20px 20px",
            borderBottomLeftRadius: "12px",
            borderTopLeftRadius: "12px",
            height: "100%",
            flexDir: "column",
            gap: "20px",
            borderRight: "2px solid #e9ecf0",
            position: "relative",
          }}
        >
          <Flex
            sx={{
              // gap: "20px",
              //   flexDir: "column",
              //   justifyContent: "center",
              position: "relative",
              width: "100%",
              height: "100%",
            }}
          >
            <Flex
              sx={{
                position: "absolute",
                top: "0px",
                width: "100%",
                height: "100%",
                bottom: "0px",
                left: "0px",
                right: "0px",
                flexDir: "column",
                overflowY: "auto",
                direction: "rtl",
                pl: "10px",
              }}
            >
              {" "}
              <Flex
                onClick={() => {
                  navigate(`/flows/home`);
                  dispatch(setFlowNav(-1));
                }}
                sx={{
                  cursor: "pointer",
                  alignItems: "center",
                  direction: "ltr",
                  background: activeRoute == -1 ? "#e9ecf1" : "#fff",
                  p: "15px 20px",
                  gap: "20px",
                  fontWeight: activeRoute == -1 ? 600 : 500,
                  borderTopLeftRadius: activeRoute == -1 ? "26px" : "none",
                  borderBottomLeftRadius: activeRoute == -1 ? "26px" : "none",
                  transition:
                    "border 0.5s, background 0.5s, border-radius 0.5s",
                  "#icon": {
                    transform: activeRoute == -1 ? "scale(1.2)" : "none",
                  },
                }}
              >
                <Icon
                  as={PiFolderSimpleStarFill}
                  boxSize="26px"
                  id="icon"
                  sx={{
                    m: "auto 0px",
                    cursor: "pointer",
                  }}
                />
                Home
              </Flex>
              {folderList.map((item, i) => {
                return (
                  <FolderView
                    key={i}
                    i={i}
                    item={item}
                    setSearchValue={setSearchValue}
                    activeRoute={activeRoute}
                    setFolderList={setFolderList}
                  />
                );
              })}
            </Flex>
          </Flex>

          <Popover
            initialFocusRef={initialFocusRef}
            isOpen={folderAdd}
            placement="top"
            closeOnBlur={true}
          >
            <PopoverTrigger>
              {folderAdd ? (
                <Flex
                  onClick={() => {
                    if (folderName.length > 0) {
                      !loading &&
                        dispatch(createFolder(folderName)).then((res) => {
                          setFolderAdd(false);
                          setFolderName("");
                          if (res.payload.status == "SUCCESS") {
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
                          } else {
                            toast({
                              position: "top",
                              status: "error",
                              variant: "solid",
                              title: "Something went wrong.",
                              duration: 2500,
                              containerStyle: {
                                fontWeight: 400,
                              },
                            });
                          }
                          dispatch(fetchFolder()).then((res) => {
                            setFolderList(res?.payload?.folders);
                          });
                        });
                    } else {
                      setFolderAdd(false);
                    }
                  }}
                  sx={{
                    bgColor: "#33445B",
                    borderRadius: "6px",
                    justifyContent: "center",
                    p: "10px 20px",
                    gap: "10px",
                    mr: "20px",
                    fontSize: 14,
                    color: "#fff",
                    cursor: "pointer",
                    alignItems: "center",
                    border: "2px solid #E0E5E9",
                    boxShadow: "md",
                  }}
                >
                  {loading ? (
                    <>
                      <CircularProgress
                        isIndeterminate
                        color="#33455b"
                        size="26px"
                        // sx={{ m: "auto" }}
                      />
                      Loading
                    </>
                  ) : (
                    <>
                      <Icon
                        as={PiFolderSimplePlus}
                        boxSize="26px"
                        id="icon"
                        sx={
                          {
                            // m: "auto 0px",
                          }
                        }
                      />
                      Submit
                    </>
                  )}
                </Flex>
              ) : (
                <Flex
                  onClick={() => setFolderAdd(true)}
                  sx={{
                    bgColor: "#33445B",
                    borderRadius: "6px",
                    justifyContent: "center",
                    p: "10px 20px",
                    gap: "10px",
                    mr: "20px",
                    fontSize: 14,
                    color: "#fff",
                    cursor: "pointer",
                    alignItems: "center",
                    border: "2px solid #E0E5E9",
                    boxShadow: "md",
                  }}
                >
                  <Icon
                    as={PiFolderSimplePlus}
                    boxSize="26px"
                    id="icon"
                    sx={
                      {
                        // m: "auto 0px",
                      }
                    }
                  />
                  Add Folder
                </Flex>
              )}
            </PopoverTrigger>
            <PopoverContent sx={{ width: "260px", boxShadow: "md", p: "20px" }}>
              <Flex sx={{ flexDir: "column", gap: "5px" }}>
                <Flex sx={{ fontSize: 14 }}>Name of the Folder</Flex>
                <Input
                  value={folderName}
                  placeholder="Folder Name"
                  onChange={(e) => setFolderName(e.target.value)}
                />
              </Flex>
            </PopoverContent>
          </Popover>
        </Flex>
        <Flex sx={{ width: "100%" }}>
          <FolderFlow
            folders={folderList}
            activeRoute={activeRoute}
            setSearchValue={setSearchValue}
            searchValue={searchValue}
          />
        </Flex>
      </Flex>
    </>
  );
};

export const FolderView = ({
  item,
  setSearchValue,
  activeRoute,
  i,
  setFolderList,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loading = useSelector((state) => state.dashflow.folder_loading);
  const toast = useToast();
  const [renaming, setRenaming] = useState(false);
  const [folderName, setFolderName] = useState(item.name);
  return (
    <Flex
      key={i}
      onClick={(e) => {
        navigate(`/flows/${item.id}`);
        dispatch(setFlowNav(i));
        setSearchValue("");
      }}
      sx={{
        width: "100%",
        cursor: "pointer",
        alignItems: "center",
        justifyContent: "space-between",
        direction: "ltr",
        background: activeRoute == i ? "#e9ecf1" : "#fff",
        p: "15px 20px",
        gap: "20px",
        fontWeight: activeRoute == i ? 600 : 500,
        borderTopLeftRadius: activeRoute == i ? "26px" : "none",
        borderBottomLeftRadius: activeRoute == i ? "26px" : "none",
        transition:
          "border 0.5s, background 0.5s, border-radius 0.5s, opacity 0.5s, fontWeight 0.5s",
        "#icon": {
          transform: activeRoute == i ? "scale(1.2)" : "none",
        },
      }}
    >
      <Flex
        sx={{
          gap: "20px",
        }}
      >
        <Flex
          sx={{
            position: "relative",
            width: "26px",
            height: "26px",
          }}
        >
          <Icon
            as={PiFolderFill}
            boxSize="26px"
            id="icon"
            sx={{
              opacity: activeRoute == i ? "1" : "0",
              m: "auto 0px",
              cursor: "pointer",
              position: "absolute",
              transition: "opacity 0.25s",
            }}
          />
          <Icon
            as={PiFolderSimpleUserFill}
            boxSize="26px"
            id="icon"
            sx={{
              opacity: activeRoute != i ? "1" : "0",
              m: "auto 0px",
              cursor: "pointer",
              position: "absolute",
              transition: "opacity 0.25s",
            }}
          />
        </Flex>{" "}
        {renaming && activeRoute == i ? (
          <Flex sx={{ justifyContent: "space-between", gap: "20px" }}>
            <Input
              sx={{ height: "" }}
              autoFocus
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
            />
            <Flex
              sx={{ bgColor: "#fff", borderRadius: "6px", width: "20px" }}
              onClick={() => {
                if (folderName != item.name) {
                  !loading &&
                    dispatch(
                      renameFolderCall({
                        folderId: item.id,
                        folderName: folderName,
                      })
                    ).then((res) => {
                      if (
                        res.payload.status == "SUCCESS" ||
                        res.payload.status == "FAILURE"
                      ) {
                        toast({
                          position: "top",
                          status:
                            res.payload.status == "SUCCESS"
                              ? "success"
                              : "error",
                          variant: "solid",
                          title: res.payload.message,
                          duration: 2500,
                          containerStyle: {
                            fontWeight: 400,
                          },
                        });
                      } else {
                        toast({
                          position: "top",
                          status: "error",
                          variant: "solid",
                          title: "Something went wrong.",
                          duration: 2500,
                          containerStyle: {
                            fontWeight: 400,
                          },
                        });
                      }
                      dispatch(fetchFolder()).then((res) => {
                        setFolderList(res?.payload?.folders);
                      });
                    });
                  setRenaming(false);
                } else setRenaming(false);
              }}
            >
              <Icon
                as={FaSquareCheck}
                boxSize="20px"
                id="icon"
                sx={{
                  m: "auto 0px",
                  cursor: "pointer",
                  color: "#32445b",
                }}
              />
            </Flex>
          </Flex>
        ) : (
          item.name
        )}
      </Flex>

      <Menu>
        <MenuButton
          sx={{
            height: "100%",
            "&:hover": {
              "#icon": {
                bgColor: "#C1C1C1",
              },
            },
          }}
        >
          <Flex
            sx={{
              height: "100%",
              alignItems: "center",
              py: "8px",
              cursor: "pointer",
              width: "16px",
              justifyContent: "center",
              borderRadius: "2px",
            }}
          >
            <Icon
              as={BsThreeDotsVertical}
              boxSize="18px"
              id="icon"
              sx={{
                opacity: activeRoute == i ? 1 : 0,
                m: "auto 0px",
                cursor: "pointer",
                position: "absolute",
                py: "2px",
                borderRadius: "2px",
                transition: "background 0.3s",
                transition: "opacity 0.25s",
              }}
            />{" "}
          </Flex>
        </MenuButton>
        <MenuList sx={{ p: "5px", mt: "10px", boxShadow: "lg" }}>
          <MenuItem
            onClick={() => {
              setRenaming(true);
            }}
            sx={{
              justifyContent: "start",
              paddingY: "10px",
              "&:hover": {
                "& #label": {
                  color: "#000",
                },
              },
            }}
          >
            <Flex
              sx={{
                gap: "10px",
                cursor: "pointer",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Flex
                id="label"
                sx={{
                  m: "auto 0px",
                  fontSize: 16,
                  gap: "10px",
                }}
              >
                <Icon
                  as={MdOutlineDriveFileRenameOutline}
                  boxSize="16px"
                  id="icon"
                  sx={{
                    m: "auto 0px",
                    cursor: "pointer",
                  }}
                />
                Rename Folder
              </Flex>
            </Flex>
          </MenuItem>
          <MenuItem
            onClick={() => {
              !loading &&
                dispatch(deleteFolder(item.id)).then((res) => {
                  if (
                    res.payload.status == "SUCCESS" ||
                    res.payload.status == "FAILURE"
                  ) {
                    toast({
                      position: "top",
                      status:
                        res.payload.status == "SUCCESS" ? "success" : "error",
                      variant: "solid",
                      title: res.payload.message,
                      duration: 2500,
                      containerStyle: {
                        fontWeight: 400,
                      },
                    });
                  } else {
                    toast({
                      position: "top",
                      status: "error",
                      variant: "solid",
                      title: "Something went wrong.",
                      duration: 2500,
                      containerStyle: {
                        fontWeight: 400,
                      },
                    });
                  }
                  dispatch(fetchFolder()).then((res) => {
                    setFolderList(res?.payload?.folders);
                  });
                });
            }}
            sx={{
              justifyContent: "start",
              paddingY: "10px",
              "&:hover": {
                "& #label": {
                  color: "#000",
                },
              },
            }}
          >
            <Flex
              sx={{
                gap: "10px",
                cursor: "pointer",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Flex
                id="label"
                sx={{
                  m: "auto 0px",
                  fontSize: 16,
                  gap: "10px",
                }}
              >
                <Icon
                  as={MdOutlineDeleteSweep}
                  boxSize="16px"
                  id="icon"
                  sx={{
                    m: "auto 0px",
                    cursor: "pointer",
                  }}
                />
                Delete Folder
              </Flex>
            </Flex>
          </MenuItem>
        </MenuList>
      </Menu>
    </Flex>
  );
};

export const FolderFlow = ({
  folders,
  activeRoute,
  setSearchValue,
  searchValue,
}) => {
  const loading = useSelector((state) => state.dashflow.loading);
  const konnectsLoading = useSelector(
    (state) => state.dashflow.konnects_loading
  );
  const total_konnects = useSelector((state) => state.dashflow.total_konnects);
  const { index } = useParams();
  const konnects = useSelector((state) => state.dashflow.konnects);
  const [pageSize, setPageSize] = useState(20);
  const [konnectList, setKonnectList] = useState([]);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [deleteFlowId, setDeleteFlowId] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [deleted, setdeleted] = useState(true);
  const [selectedFlows, setSelectedFlows] = useState([]);
  const toast = useToast();

  useEffect(() => {
    if (index == "home") {
      dispatch(getKonnectsList({ page_size: pageSize, include_created_at: true })).then((res) => {
        if (res.error) {
          // AuthTokenService.clear();
          // navigate("/logout");
        } else setKonnectList(res.payload.konnects);
      });
    } else if (folders.find((fold) => fold.id == index)) {
      dispatch(getKonnectsByFolder(index)).then((res) => {
        if (res.error) {
          // AuthTokenService.clear();
          // navigate("/logout");
        } else setKonnectList(res.payload.konnects);
      });
      setError(false);
    } else {
      setError(true);
    }
  }, [ folders, activeRoute,deleted,pageSize]);

  const handleChange = (e, status = "") => {
    if (status == "blank") {
      if (!e.target.value) {
        setKonnectList(konnects);
        setSearching(false);
      }
    } else {
      if (!searchValue) {
        setKonnectList(konnects);
        setSearching(false);
      } else {
        if (status == "folder") {
          setKonnectList((list) =>
            list.filter((kon) => kon?.konnect_name?.includes(searchValue))
          );
          setSearching(false);
        } else {
          setSearching(true);
          searchValue.length > 1 &&
            dispatch(searchKonnectz({ search_query: searchValue })).then(
              (res) => {
                if (res.payload.konnects.length > 0) {
                  setKonnectList(res.payload.konnects);
                  setSearching(false);
                } else {
                  setSearching(false);
                  setKonnectList([]);
                }
              }
            );
        }
      }
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedFlows(konnectList.map(flow => flow.id));
    } else {
      setSelectedFlows([]);
    }
  };

  const handleMoveSelectedFlows = (folderId) => {
    if (selectedFlows.length === 0) {
      toast({
        position: "top",
        status: "warning",
        variant: "solid",
        title: "No flows selected",
        duration: 2500,
      });
      return;
    }

    dispatch(moveFlowsToFolder({ flowIds: selectedFlows, folderId }))
      .unwrap()
      .then(() => {
        toast({
          position: "top",
          status: "success",
          variant: "solid",
          title: "Flows moved successfully",
          duration: 2500,
        });
        setKonnectList(prevList => prevList.filter(flow => !selectedFlows.includes(flow.id)));
        setSelectedFlows([]);
      })
      .catch((error) => {
        toast({
          position: "top",
          status: "error",
          variant: "solid",
          title: "Failed to move flows",
          description: error.message || "An unknown error occurred",
          duration: 2500,
        });
      });
  };

  return (
    <Flex
      sx={{
        p: "20px",
        width: "100%",
        alignItems: loading || error ? "center" : "none",
        justifyContent: loading || error ? "center" : "none",
        fontSize: 18,
      }}
    >
      {!error ? (
        loading ? (
          <CircularProgress
            isIndeterminate
            color="#33455b"
            size="50px"
            sx={{ m: "auto" }}
          />
        ) : (
          <Flex
            sx={{
              width: "100%",
              height: "100%",
              flexDir: "column",
              gap: "20px",
            }}
          >
            <Flex
              sx={{
                width: "100%",
                position: "relative",
                boxShadow: "md",
                p: "20px",
                borderRadius: "4px",
              }}
            >
              <Flex sx={{ width: "100%", position: "relative" }}>
                <Input
                  placeholder="Search in Flows"
                  value={searchValue}
                  onChange={(e) => {
                    handleChange(e, "blank");
                    setSearchValue(e.target.value);
                  }}
                  sx={{
                    "&:focus-visible": {
                      border: "2px solid #33445B",
                      boxShadow: "none",
                      zIndex: 1,
                    },
                    border: "2px solid #33445B",
                  }}
                />
                <Flex
                  onClick={(e) =>
                    handleChange(e, index != "home" ? "folder" : "")
                  }
                  sx={{
                    position: "absolute",
                    top: "0px",
                    right: "0px",
                    height: "100%",
                    borderRadius: "4px",
                    gap: "5px",
                    bgColor: "#33445B",
                    color: "#fff",
                    alignItems: "center",
                    px: "20px",
                    zIndex: 2,
                    cursor: "pointer",
                    outline: "4px solid #33445B",
                    outlineOffset: -1,
                  }}
                >
                  <Icon as={LuSearch} boxSize="24px" id="icon" />
                  Search
                </Flex>{" "}
              </Flex>
            </Flex>
            <Flex sx={{ width: "100%", p: "20px 36px 10px 20px" }}>
              <Flex sx={{ width: "40px" }}>
                {/* <Checkbox size="lg" fill="#33455b"></Checkbox> */}
              </Flex>
              <Flex width="100%" sx={{ fontSize: 14, fontWeight: 600 }}>
                <Flex sx={{ width: "50%" }}>Name</Flex>
                <Flex sx={{ width: "35%", justifyContent: "center" }}>Publish Status</Flex>
                {/* <Flex sx={{ width: "20%" }}>Creation Date</Flex> */}
                <Flex sx={{ width: "15%" }}>Actions</Flex>
              </Flex>{" "}
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
                  borderRadius: "2px",
                  rowGap: "10px",
                  boxShadow: "0px 0px 6px -2px rgb(0,0,0,0.5)",
                }}
              > 
                <InfiniteScroll
                  dataLength={konnectList.length || 0} //This is important field to render the next data
                  next={() => setPageSize((c) => c + 20)}
                  hasMore={
                    index == "home"
                      ? konnectList.length == total_konnects
                        ? false
                        : true
                      : false
                  }
                  pullDownToRefresh={false}
                  scrollableTarget="scrollableDiv1"
                  endMessage={
                    !konnectsLoading && (
                      <Flex
                        sx={{
                          textAlign: "center",
                          pl: "20px",
                          justifyContent: "flex-start",
                          fontSize: 13,
                          marginTop: "15px",
                          fontWeight: 500,
                        }}
                      >
                        <Flex>**Bottom of the Page**</Flex>
                      </Flex>
                    )
                  }
                  loader={
                    konnectsLoading && (
                      <Flex
                        width="80px"
                        sx={{ m: "20px auto", stroke: "#162c73" }}
                      >
                        <CircularProgress
                          isIndeterminate
                          color="#33455b"
                          size="50px"
                          // sx={{ m: "auto" }}
                        />
                      </Flex>
                    )
                  }
                >
                  {konnectList.length > 0 ? (
                    konnectList.map((app, i) => {
                      return (
                        // <FlowInfo i={i} app={app} setdeleted={setdeleted} setKonnectList={setKonnectList} folders={folders}  />
                        <FlowInfo 
                          key={app.id}
                          i={i} 
                          app={app} 
                          setdeleted={setdeleted} 
                          setKonnectList={setKonnectList} 
                          folders={folders}
                          isSelected={selectedFlows.includes(app.id)}
                          onSelect={() => {
                            setSelectedFlows(prev => 
                              prev.includes(app.id) 
                                ? prev.filter(id => id !== app.id)
                                : [...prev, app.id]
                            );
                          }}
                        />
                      );
                    })
                  ) : (
                    <Flex
                      sx={{
                        width: "100%",
                        p: "20px 36px 20px 20px",
                        cursor: "pointer",
                        borderBottom: "0.5px solid #D8DEE2",
                        transition: "background 0.3s",
                        "&:hover": {
                          bgColor: "#ECEFF4",
                        },
                      }}
                    >
                      <Flex sx={{ width: "40px" }}>
                        <Checkbox
                          size="lg"
                          fill="#33455b"
                          sx={{ display: "none" }}
                        ></Checkbox>
                      </Flex>
                      <Flex
                        width="100%"
                        sx={{ fontSize: 14, alignItems: "center" }}
                      >
                        <Flex sx={{ width: "50%" }}>No Flow Found</Flex>
                        <Flex sx={{ width: "20%" }}></Flex>
                        <Flex sx={{ width: "40%" }}></Flex>
                        <Flex
                          sx={{
                            width: "20%",
                            gap: "20px",
                            justifyContent: "flex-end",
                          }}
                        >
                          <Flex
                            onClick={() => {
                              navigate("/create");
                            }}
                            sx={{
                              bgColor: "#33445b",
                              color: "#fff",
                              borderRadius: "8px",
                              cursor: "pointer",
                              px: "20px",
                              py: "10px",
                              gap: "7px",
                            }}
                          >
                            <Icon
                              as={FaUncharted}
                              boxSize="16px"
                              id="icon"
                              sx={{ m: "auto 0px" }}
                            />
                            Create Flow
                          </Flex>
                        </Flex>
                      </Flex>{" "}
                    </Flex>
                  )}
                </InfiniteScroll>
              </Flex>
            </Flex>
            {selectedFlows.length > 0 && (
              <Flex justifyContent="flex-end" p="20px">
                <Menu>
                  <MenuButton as={Button} rightIcon={<MdOutlineDriveFileMove />}>
                    Move Selected Flows
                  </MenuButton>
                  <MenuList maxHeight="200px" overflowY="auto">
                    {folders && folders.length > 0 ? (
                      folders.map((folder) => (
                        <MenuItem key={folder.id} onClick={() => handleMoveSelectedFlows(folder.id)}>
                          {folder.name}
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem isDisabled>No folders available</MenuItem>
                    )}
                  </MenuList>
                </Menu>
              </Flex>
              )}
          </Flex>
        )
      ) : (
        <>This folder does'nt exist.</>
      )}
    </Flex>
  );
};

const FlowInfo = ({ i, app, setdeleted, setKonnectList, folders, isSelected, onSelect }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();
  const [isOpen, setIsOpen] = useState(false); 
  //const [creationDate, setCreationDate] = useState('N/A')
  //const [isMoveOpen, setIsMoveOpen] = useState(false);

  // const handleMove = (newFolderId) => {
  //   console.log('Moving flow:', app.id, 'to folder:', newFolderId); 
  //   dispatch(moveFlow({ flowId: app.id, newFolderId }))
  //     .unwrap()
  //     .then((result) => {
  //       console.log('Move flow result:', result); 
  //       toast({
  //         position: "top",
  //         status: "success",
  //         variant: "solid",
  //         title: "Flow moved successfully",
  //         duration: 2500,
  //         containerStyle: {
  //           fontWeight: 400,
  //         },
  //       });
  //       setKonnectList((prevList) => prevList.filter((x) => x.id !== app.id));
  //     })
  //     .catch((error) => {
  //       console.error('Move flow error:', error); 
  //       toast({
  //         position: "top",
  //         status: "error",
  //         variant: "solid",
  //         title: "Failed to move flow",
  //         description: error.message || "An unknown error occurred",
  //         duration: 2500,
  //         containerStyle: {
  //           fontWeight: 400,
  //         },
  //       });
  //     });
  // };

  // const handleMove = (newFolderId) => {
  //   dispatch(moveFlowsToFolder({ flowIds: [app.id], folderId: newFolderId }))
  //     .unwrap()
  //     .then(() => {
  //       toast({
  //         position: "top",
  //         status: "success",
  //         variant: "solid",
  //         title: "Flow moved successfully",
  //         duration: 2500,
  //         containerStyle: {
  //           fontWeight: 400,
  //         },
  //       });
  //       setKonnectList((prevList) => prevList.filter((x) => x.id !== app.id));
  //     })
  //     .catch((error) => {
  //       toast({
  //         position: "top",
  //         status: "error",
  //         variant: "solid",
  //         title: "Failed to move flow",
  //         description: error.message || "An unknown error occurred",
  //         duration: 2500,
  //         containerStyle: {
  //           fontWeight: 400,
  //         },
  //       });
  //     });
  // };

  // const creationDate = app.activity_dates && app.activity_dates.length > 0
  //   ? new Date(app.activity_dates[0].created_at).toLocaleDateString()
  //   : 'N/A'

  const handleMove = (newFolderId) => {
    dispatch(moveFlowsToFolder({ flowIds: [app.id], folderId: newFolderId }))
      .unwrap()
      .then((result) => {
        toast({
          position: "top",
          status: "success",
          variant: "solid",
          title: "Flow moved successfully",
          duration: 2500,
          containerStyle: {
            fontWeight: 400,
          },
        });
        setKonnectList((prevList) => prevList.filter((x) => x.id !== app.id));
      })
      .catch((error) => {
        toast({
          position: "top",
          status: "error",
          variant: "solid",
          title: "Failed to move flow",
          description: error.message || "An unknown error occurred",
          duration: 2500,
          containerStyle: {
            fontWeight: 400,
          },
        });
      });
  };

  return (
   
      <Flex
        key={i}
        sx={{
          width: "100%",
          p: "20px 36px 20px 20px",
          cursor: "pointer",
          borderBottom: "0.5px solid #D8DEE2",
          transition: "background 0.3s",
          "&:hover": {
            bgColor: "#ECEFF4",
          },
        }}
      >
        <Flex sx={{ width: "40px" }}>
          <Checkbox size="lg" fill="#33455b" isChecked={isSelected} onChange={onSelect} ></Checkbox>
        </Flex>
        <Flex width="100%" sx={{ fontSize: 14 }}>
          <Flex sx={{ width: "50%" }}>{app.konnect_name}</Flex>
          <Flex sx={{ width: "35%", justifyContent: "center" }}>
            {app.status == "Draft" ? "Unpublished" : "Published"}
          </Flex>
          {/* <Flex sx={{ width: "20%" }}>{creationDate}</Flex> */}
          <Flex sx={{ width: "15%", gap: "20px" }}>
            <Tooltip label="Edit Flow">
              <Flex
                onClick={() => {
                  dispatch(getFlow(app.id)).then((res) => {
                    navigate(`/create/${app.id}`);
                  });
                }}
              >
                <Icon as={RiFileEditLine} boxSize="20px" id="icon" />
              </Flex>
            </Tooltip>{" "}
            <Popover
              isOpen={isOpen}
              onClose={() => setIsOpen(false)}
              placement="top-start"
            >
              <PopoverTrigger>
                <Tooltip label="Delete Flow">
                  <Flex
                    onClick={() => {
                      setIsOpen(true);
                    }}
                  >
                    <Icon as={RiFileCloseLine} boxSize="20px" id="icon" />
                  </Flex>
                </Tooltip>
              </PopoverTrigger>
              <PopoverContent>
                <PopoverArrow />
                <PopoverHeader>Do you want to delete the flow?</PopoverHeader>
                <PopoverCloseButton />
                <PopoverBody>
                  <Flex justify="space-between" gap="10px">
                    <Button
                      sx={{ backgroundColor: "#FE6463", flex: 1 }}
                      onClick={() => {
                        dispatch(deleteFlowWithId(app.id)).then((res) => {
                          if (res.payload.message === "SUCCESS") {
                            setIsOpen(false);
                            // setdeleted((deleted) => !deleted);
                            setKonnectList(konnectList=>konnectList.filter(x=>x.id !==app.id))
                            toast({
                              position: "top",
                              status: "success",
                              variant: "solid",
                              title: "Deleted",
                              duration: 2500,
                              containerStyle: {
                                fontWeight: 400,
                              },
                            });
                          } else
                            toast({
                              position: "top",
                              status: "error",
                              variant: "solid",
                              title: "Cannot Delete this Flow",
                              duration: 2500,
                              containerStyle: {
                                fontWeight: 400,
                              },
                            });
                        });
                      }}
                    >
                      Yes
                    </Button>
                    <Button sx={{ flex: 1 }} onClick={() => setIsOpen(false)}>
                      No
                    </Button>
                  </Flex>
                </PopoverBody>
              </PopoverContent>
            </Popover>
            {/* <Menu>
          <MenuButton>
            <Tooltip label="Move Flow">
              <Flex>
                <Icon as={MdOutlineDriveFileMove} boxSize="20px" id="icon" />
              </Flex>
            </Tooltip>
          </MenuButton>
          <MenuList>
          {folders && folders.length > 0 ? (
            folders.map((folder) => (
              <MenuItem key={folder.id} onClick={() => handleMove(folder.id)}>
                {folder.name}
              </MenuItem>
            ))
          ) : (
            <MenuItem isDisabled>No folders available</MenuItem>
          )}
        </MenuList>
        </Menu> */}
          <Menu>
          <MenuButton>
            <Tooltip label="Move Flow">
              <Flex>
                <Icon as={MdOutlineDriveFileMove} boxSize="20px" id="icon" />
              </Flex>
            </Tooltip>
          </MenuButton>
          <MenuList>
            {folders && folders.length > 0 ? (
              folders.map((folder) => (
                <MenuItem key={folder.id} onClick={() => handleMove(folder.id)}>
                  {folder.name}
                </MenuItem>
              ))
            ) : (
              <MenuItem isDisabled>No folders available</MenuItem>
            )}
          </MenuList>
        </Menu>
          </Flex>
        </Flex>{" "}
      </Flex>
  
  );
};