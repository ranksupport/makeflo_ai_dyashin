import {
  Checkbox,
  CircularProgress,
  Flex,
  Icon,
  Input,
  Modal,
  ModalContent,
  ModalOverlay,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import React, { memo, useEffect, useState } from "react";
import { Topbar } from "../../components/shell";
import { useDispatch, useSelector } from "react-redux";
import {
  getLogsList,
  getTaskDetails,
  getTaskLogsList,
} from "../../store/thunk/historyThunk";
import { RiSearch2Line } from "react-icons/ri";
import { MdOutlineErrorOutline } from "react-icons/md";
import { IoCalendarOutline } from "react-icons/io5";
import { GiLevelEndFlag } from "react-icons/gi";
import { IoCalendarNumberOutline } from "react-icons/io5";
import Select, { components } from "react-select";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { IoMdInformationCircle } from "react-icons/io";
import InfiniteScroll from "react-infinite-scroll-component";
import { AiOutlineFileSearch } from "react-icons/ai";
import { VscClearAll } from "react-icons/vsc";
import { VscError } from "react-icons/vsc";
import { CgFeed } from "react-icons/cg";
import { GoTasklist } from "react-icons/go";
const { Option } = components;
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
      border: "1px solid #ABB6C8 !important",
    };
  },
};
const CustomOption = (props) => (
  <Option {...props}>
    <Flex>
      <Icon
        as={
          props.data.label == "Error"
            ? MdOutlineErrorOutline
            : IoMdCheckmarkCircleOutline
        }
        boxSize={"20px"}
        sx={{
          m: "auto 5px auto 0px",
          fill: "#32445b",
        }}
      />{" "}
      {props.data.label}
    </Flex>
  </Option>
);

export const History = () => {
  const dispatch = useDispatch();
  const total_konnects = useSelector((state) => state.dashflow.total_konnects);
  const loading = useSelector((state) => state.history.loading);
  const [konnectList, setKonnectList] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState(null);
  const [customSearch, setCustomSearch] = useState(false);
  const [pageSize, setPageSize] = useState(30);
  const [flowId, setFlowId] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [pageIndex, setPageIndex] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  // useEffect(() => {
  //   dispatch(
  //     getTaskLogsList({
  //       searching: customSearch,
  //       searchData: {
  //         page_size: pageSize,
  //       },
  //     })
  //   ).then((res) => {
  //     setKonnectList(res.payload?.konnects);
  //   });
  // }, [pageSize]);

  // useEffect(() => {
  //   dispatch(
  //     getTaskLogsList({
  //       searching: customSearch,
  //       searchData: {
  //         page_size: pageSize,
  //         page_index: 1,
  //       },
  //     })
  //   ).then((res) => {
  //     setKonnectList(res.payload?.konnects);
  //   });
  // }, [pageSize]);

  // useEffect(() => {
  //   loadKonnects(1);
  // }, [pageSize]); 

  // const loadKonnects = (page) => {
  //   const searchData = {
  //     page_size: pageSize,
  //     page_index: page,
  //   };
  
  //   if (customSearch) {
  //     if (searchValue) searchData.search_query = searchValue;
  //     if (startDate) searchData.start_date = startDate;
  //     if (endDate) searchData.end_date = endDate;
  //     if (status) searchData.status = status.value;
  //   }

    const loadKonnects = (page) => {
    const searchData = {
      page_size: pageSize,
      page_index: page,
      ...(customSearch && {
        ...(searchValue && { search_query: searchValue }),
        ...(startDate && { start_date: startDate }),
        ...(endDate && { end_date: endDate }),
        ...(status && { status: status.value })
      })
    };
  
  //   dispatch(
  //     getTaskLogsList({
  //       searching: customSearch,
  //       searchData: searchData,
  //     })
  //   ).then((res) => {
  //     if (res.payload?.konnects) {
  //       if (page === 1) {
  //         setKonnectList(res.payload.konnects);
  //       } else {
  //         setKonnectList(prevList => [...prevList, ...res.payload.konnects]);
  //       }
  //       setPageIndex(page);
  //       // Update total_konnects here
  //       if (res.payload.total_konnects !== undefined) {
  //         dispatch({ type: 'UPDATE_TOTAL_KONNECTS', payload: res.payload.total_konnects });
  //       }
  //     } else {
  //       console.error("No konnects data in response");
  //       setKonnectList([]);
  //     }
  //   }).catch(error => {
  //     console.error("Error fetching konnects:", error);
  //     setKonnectList([]);
  //   });
  // };

  // dispatch(getTaskLogsList({ searching: customSearch, searchData }))
  //     .then((res) => {
  //       if (res.payload?.konnects) {
  //         if (page === 1) {
  //           setKonnectList(res.payload.konnects);
  //         } else {
  //           // Only add new konnects that aren't already in the list
  //           setKonnectList(prevList => {
  //             const newKonnects = res.payload.konnects.filter(
  //               newKonnect => !prevList.some(existingKonnect => existingKonnect.id === newKonnect.id)
  //             );
  //             return [...prevList, ...newKonnects];
  //           });
  //         }
  //         setPageIndex(page);
  //         if (res.payload.total_konnects !== undefined) {
  //           dispatch({ type: 'UPDATE_TOTAL_KONNECTS', payload: res.payload.total_konnects });
  //         }
  //       } else {
  //         console.error("No konnects data in response");
  //         if (page === 1) setKonnectList([]);
  //       }
  //     })
  //     .catch(error => {
  //       console.error("Error fetching konnects:", error);
  //       if (page === 1) setKonnectList([]);
  //     });
  // };

  // dispatch(getTaskLogsList({ searching: customSearch, searchData }))
  //     .then((res) => {
  //       if (res.payload?.konnects) {
  //         if (page === 1) {
  //           setKonnectList(res.payload.konnects);
  //         } else {
  //           setKonnectList(prevList => [...prevList, ...res.payload.konnects]);
  //         }
  //         setPageIndex(page);
  //         if (res.payload.total_konnects !== undefined) {
  //           dispatch({ type: 'UPDATE_TOTAL_KONNECTS', payload: res.payload.total_konnects });
  //         }
  //         // Check if we've loaded all konnects
  //         setHasMore(konnectList.length + res.payload.konnects.length < res.payload.total_konnects);
  //       } else {
  //         console.error("No konnects data in response");
  //         if (page === 1) setKonnectList([]);
  //         setHasMore(false);
  //       }
  //     })
  //     .catch(error => {
  //       console.error("Error fetching konnects:", error);
  //       if (page === 1) setKonnectList([]);
  //       setHasMore(false);
  //     });
  // };

  dispatch(getTaskLogsList({ searching: customSearch, searchData }))
  .then((res) => {
    if (res.payload?.konnects) {
      if (page === 1) {
        setKonnectList(res.payload.konnects);
      } else {
        setKonnectList(prevList => [...prevList, ...res.payload.konnects]);
      }
      setPageIndex(page);
      if (res.payload.total_konnects !== undefined) {
        dispatch({ type: 'UPDATE_TOTAL_KONNECTS', payload: res.payload.total_konnects });
      }
      // Check if we've loaded all konnects
      setHasMore(konnectList.length + res.payload.konnects.length < res.payload.total_konnects);
    } else {
      console.error("No konnects data in response");
      if (page === 1) setKonnectList([]);
      setHasMore(false);
    }
  })
  .catch(error => {
    console.error("Error fetching konnects:", error);
    if (page === 1) setKonnectList([]);
    setHasMore(false);
  });
  };

  useEffect(() => {
    loadKonnects(1);
  }, [pageSize]); 


  // const handleGoClick = () => {
  //   if (searchValue.length > 0 || startDate || endDate || status) {
  //     setCustomSearch(true);
  //     setPageIndex(1);
  //     dispatch(
  //       getTaskLogsList({
  //         searching: true,
  //         searchData: {
  //           start_date: startDate,
  //           end_date: endDate,
  //           search_query: searchValue,
  //           status: status ? status.value : undefined,
  //           page_size: pageSize,
  //           page_index: 1,
  //         },
  //       })
  //     ).then((res) => {
  //       setKonnectList(res.payload?.konnects);
  //     });
  //   }
  // };

  // const handleClearFilters = () => {
  //   setCustomSearch(false);
  //   setSearchValue("");
  //   setStartDate("");
  //   setEndDate("");
  //   setStatus(null);
  //   dispatch(
  //     getTaskLogsList({
  //       searching: false,
  //       searchData: {
  //         page_size: pageSize,
  //       },
  //     })
  //   ).then((res) => {
  //     setKonnectList(res.payload?.konnects);
  //   });
  // };

  const handleGoClick = () => {
    setCustomSearch(true);
    setPageIndex(1);
    loadKonnects(1);
  };

  const handleClearFilters = () => {
    setCustomSearch(false);
    setSearchValue("");
    setStartDate("");
    setEndDate("");
    setStatus(null);
    setPageIndex(1);
    loadKonnects(1);
  };

  return (
    <>
      <Topbar heading="FLOW HISTORY" />
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
            p: "20px",
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
              pb: "5px",
              //   mb: "20px",
              borderBottom: "2px solid #32445b",
              fontWeight: 600,
            }}
          >
            Filter
          </Flex>
          <Flex sx={{ flexDir: "column", gap: "10px", alignItems: "flex-end" }}>
            <Flex sx={{ flexDir: "column", width: "100%", gap: "3px" }}>
              <Flex sx={{ fontSize: 12 }}>Search Flow</Flex>
              <Flex
                width="100%"
                sx={{
                  borderRadius: "6px",
                  border: "1px solid #32445b",
                  px: "10px",
                }}
              >
                <Flex>
                  <Icon
                    as={RiSearch2Line}
                    boxSize={"20px"}
                    sx={{
                      m: "auto 5px auto 0px",
                      fill: "#32445b",
                    }}
                  />
                </Flex>
                <Input
                  //   onChange={handleChange}
                  placeholder="Search in Name"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
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
            <Flex sx={{ flexDir: "column", width: "100%", gap: "3px" }}>
              <Flex sx={{ fontSize: 12 }}>Start Date</Flex>
              <Flex
                width="100%"
                sx={{
                  borderRadius: "6px",
                  border: "1px solid #32445b",
                  px: "10px",
                }}
              >
                <Flex>
                  <Icon
                    as={IoCalendarOutline}
                    boxSize={"20px"}
                    sx={{
                      m: "auto 5px auto 0px",
                      fill: "#32445b",
                    }}
                  />
                </Flex>
                <Input
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  placeholder="Start Date"
                  type="date"
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
            <Flex sx={{ flexDir: "column", width: "100%", gap: "3px" }}>
              <Flex sx={{ fontSize: 12 }}>End Date</Flex>
              <Flex
                width="100%"
                sx={{
                  borderRadius: "6px",
                  border: "1px solid #32445b",
                  px: "10px",
                }}
              >
                <Flex>
                  <Icon
                    as={IoCalendarNumberOutline}
                    boxSize={"20px"}
                    sx={{
                      m: "auto 5px auto 0px",
                      fill: "#32445b",
                    }}
                  />
                </Flex>
                <Input
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  placeholder="End Date"
                  type="date"
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
              </Flex>{" "}
            </Flex>
            <Flex sx={{ flexDir: "column", width: "100%", gap: "3px" }}>
              <Flex sx={{ fontSize: 12 }}>Status</Flex>
              <Flex
                width="100%"
                sx={{
                  borderRadius: "6px",
                  border: "1px solid #32445b",
                  pl: "10px",
                }}
              >
                <Flex>
                  <Icon
                    as={GiLevelEndFlag}
                    boxSize={"20px"}
                    sx={{
                      m: "auto 5px auto 0px",
                      fill: "#32445b",
                    }}
                  />
                </Flex>
                <Select
                  isClearable
                  options={[
                    { id: 1, value: "SUCCESS", label: "Success" },
                    { id: 2, value: "ERROR", label: "Error" },
                  ]}
                  placeholder="Select Status"
                  value={status}
                  onChange={(e) => setStatus(e)}
                  components={{ Option: CustomOption }}
                  styles={selectStyle}
                />
              </Flex>{" "}
            </Flex>{" "}
            <Flex sx={{ gap: "10px", mt: "10px" }}>
              <Flex
                width="100px"
                // onClick={() => {
                //   if (searchValue.length > 0) {
                //     setCustomSearch(true);
                //     dispatch(
                //       getTaskLogsList({
                //         searching: true,
                //         searchData: {
                //           start_date: startDate,
                //           end_date: endDate,
                //           search_query: searchValue,
                //         },
                //       })
                //     ).then((res) => {
                //       setKonnectList(res.payload?.konnects);
                //     });
                //   }
                // }}
                onClick={handleGoClick}
                sx={{
                  borderRadius: "6px",
                  border: "1px solid #32445b",
                  bgColor: "#32445b",
                  color: "#fff",
                  justifyContent: "center",
                  boxShadow: "md",
                  p: "7px",
                  cursor: "pointer",
                }}
              >
                <Flex>
                  <Icon
                    as={AiOutlineFileSearch}
                    boxSize={"20px"}
                    sx={{
                      m: "auto 5px auto 0px",
                      fill: "#fff",
                    }}
                  />
                </Flex>
                Go
              </Flex>{" "}
              {customSearch ? (
                <Flex
                  width="100px"
                  // onClick={() => {
                  //   setCustomSearch(false);
                  //   setSearchValue("");
                  //   setEndDate("");
                  //   setStartDate("");
                  //   setStatus(null);
                  //   dispatch(
                  //     getTaskLogsList({
                  //       searching: false,
                  //       searchData: {
                  //         page_size: pageSize,
                  //       },
                  //     })
                  //   ).then((res) => {
                  //     setKonnectList(res.payload?.konnects);
                  //   });
                  // }}
                  onClick={handleClearFilters}
                  sx={{
                    borderRadius: "6px",
                    border: "1px solid #32445b",
                    bgColor: "#32445b",
                    color: "#fff",
                    justifyContent: "center",
                    p: "7px",
                    cursor: "pointer",
                    boxShadow: "md",
                  }}
                >
                  <Flex>
                    <Icon
                      as={VscClearAll}
                      boxSize={"20px"}
                      sx={{
                        m: "auto 5px auto 0px",
                        fill: "#fff",
                      }}
                    />
                  </Flex>
                  Clear
                </Flex>
              ) : null}
            </Flex>
          </Flex>
        </Flex>
        <Flex
          sx={{
            p: "20px",
            width: "100%",
            alignItems: loading ? "center" : "none",
            justifyContent: loading ? "center" : "none",
            fontSize: 18,
          }}
        >
          <Flex
            sx={{
              width: "100%",
              height: "100%",
              flexDir: "column",
              gap: "20px",
            }}
          >
            <Flex sx={{ width: "100%", p: "0px 36px 0px 20px", fontSize: 14, fontWeight: 600 }}>
              <Flex sx={{ width: "40%" }}>Name</Flex>
              <Flex sx={{ width: "20%" }}>Creation Date</Flex>
              <Flex sx={{ width: "30%", alignItems: "center", gap: "5px" }}>
                Status{" "}
                <Tooltip label="Success/Error tasks count in the Flow.">
                  <Flex>
                    <Icon as={IoMdInformationCircle} boxSize="20px" id="icon" />
                  </Flex>
                </Tooltip>
              </Flex>
              <Flex sx={{ width: "10%" }}>Action</Flex>
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
                  //dataLength={konnectList.length || 0} //This is important field to render the next data
                  //next={() => setPageSize((c) => c + 20)}
                  //hasMore={konnectList.length == total_konnects ? false : true}
                  //pullDownToRefresh={false}
                  //dataLength={konnectList.length || 0}
                  // next={() => {
                  //   setPageIndex(prevIndex => prevIndex + 1);
                  //   dispatch(
                  //     getTaskLogsList({
                  //       searching: customSearch,
                  //       searchData: {
                  //         start_date: startDate,
                  //         end_date: endDate,
                  //         search_query: searchValue,
                  //         status: status ? status.value : undefined,
                  //         page_size: pageSize,
                  //         page_index: pageIndex + 1,
                  //       },
                  //     })
                  //   ).then((res) => {
                  //     setKonnectList(prevList => [...prevList, ...res.payload?.konnects]);
                  //   });
                  // }}
                  //next={loadKonnects}
                  //hasMore={hasMore}
                  //hasMore={konnectList.length < total_konnects}
                  dataLength={konnectList.length}
                  //next={() => loadKonnects(pageIndex + 1)}
                  // next={() => {
                  //   if (konnectList.length < total_konnects) {
                  //     loadKonnects(pageIndex + 1);
                  //   }
                  // }}
                  next={() => {
                    if (hasMore) {
                      loadKonnects(pageIndex + 1);
                    }
                  }}
                  // hasMore={konnectList.length < total_konnects}
                  hasMore={hasMore}
                  // loader={
                  //   <Flex width="80px" sx={{ m: "20px auto", stroke: "#162c73" }}>
                  //     <CircularProgress isIndeterminate color="#33455b" size="50px" />
                  //   </Flex>
                  // }
                  // loader={
                  //   <Flex width="100%" sx={{ m: "20px 0", justifyContent: "center" }}>
                  //     <CircularProgress isIndeterminate color="#33455b" size="50px" />
                  //   </Flex>
                  // }
                  loader={
                    <Flex width="100%" sx={{ height: "50px", justifyContent: "center", alignItems: "center" }}>
                      <CircularProgress isIndeterminate color="#33455b" size="30px" />
                    </Flex>
                  }
                
                  // loader={null}
                  scrollableTarget="scrollableDiv1"
                  endMessage={
                    //!loading && (
                    !loading && konnectList.length > 0 && !hasMore && (
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
                        {/* <Flex>**Bottom of the Page**</Flex> */}
                        <Flex>**End of List - No More Flows to Load**</Flex>
                      </Flex>
                    )
                  }
                  // loader={
                  //   loading && (
                  //     <Flex
                  //       width="80px"
                  //       sx={{ m: "20px auto", stroke: "#162c73" }}
                  //     >
                  //       <CircularProgress
                  //         isIndeterminate
                  //         color="#33455b"
                  //         size="50px"
                  //       />
                  //     </Flex>
                  //   )
                  // }
                >
                  { konnectList.length > 0 ? (
                    konnectList.map((app, i) => {
                      return (
                        <FlowView
                          app={app}
                          key={i}
                          setFlowId={setFlowId}
                          onOpen={onOpen}
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
                        <Flex sx={{ width: "10%" }}></Flex>
                        <Flex
                          sx={{
                            width: "20%",
                            gap: "20px",
                            justifyContent: "flex-end",
                          }}
                        ></Flex>
                      </Flex>{" "}
                    </Flex>
                  )}
                </InfiniteScroll>
              </Flex>
            </Flex>
          </Flex>
        </Flex>
        <ResponseModal
          flow_id={flowId}
          isOpen={isOpen}
          onOpen={onOpen}
          onClose={onClose}
        />
      </Flex>
    </>
  );
};

const FlowView = ({ app, setFlowId, onOpen }) => {
  const dispatch = useDispatch();
  return (
    <Flex
      sx={{
        width: "100%",
        p: "20px 36px 20px 20px",
        cursor: "pointer",
        borderBottom: "0.5px solid #D8DEE2",
        transition: "background 0.3s",

        justifyContent: "center",
        "&:hover": {
          bgColor: "#ECEFF4",
        },
      }}
    >
      <Flex
        sx={{
          width: "100%",
          p: "0px",
          fontSize: 16,
          alignItems: "center",
        }}
      >
        <Flex sx={{ width: "40%" }}>{app.konnect_name}</Flex>
        <Flex sx={{ width: "20%" }}>{app.created_at}</Flex>
        <Flex sx={{ width: "30%", gap: "20px" }}>
          <Flex
            sx={{
              gap: "5px",
              alignItems: "center",
              fontSize: 15,
            }}
          >
            <Flex>
              <Icon as={IoMdCheckmarkCircleOutline} boxSize="22px" id="icon" />
            </Flex>
            Success: <a style={{ fontSize: 16 }}>{app.success_task_count}</a>
          </Flex>
          <Flex>
            <Flex
              sx={{
                gap: "5px",
                alignItems: "center",
                fontSize: 15,
              }}
            >
              <Flex>
                <Icon as={VscError} boxSize="22px" id="icon" />
              </Flex>
              Error: <a style={{ fontSize: 16 }}>{app.error_task_count}</a>
            </Flex>
          </Flex>
        </Flex>
        <Flex sx={{ width: "10%" }}>
          <Flex
            onClick={() => {
              onOpen();
              setFlowId(app.id);
              dispatch(getLogsList({
                  start_date: "2020-04-12",
                  end_date: "2023-04-12",
                  task_log_type: "SUCCESS",
                  page_index: 1,
                  page_size: 60,
                  konnect_id: app.id,
                }));
                dispatch(getTaskLogsList({
                  searching: true,
                  searchData: {
                    konnect_id: app.id,
                  },
                }));
            }}
            sx={{
              alignItems: "center",
              borderRadius: "6px",
              transition: "background 0.3s",
              justifyContent: "center",
              p: "5px 10px",
              outline: "1px solid #32445b",
              "&:hover": {
                bgColor: "#e1e5e9",
              },
            }}
          >
            <Tooltip label="Show Responses">
              <Flex sx={{ gap: "5px", alignItems: "center" }}>
                <Icon as={CgFeed} boxSize="24px" id="icon" /> Show
              </Flex>
            </Tooltip>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

const ResponseModal = memo(({ flow_id, isOpen, onOpen, onClose }) => {
  const dispatch = useDispatch();
  const taskLog = useSelector((state) => state.history.taskLog);
  const taskList = useSelector((state) => state.history.taskList);
  const taskLogLoading = useSelector((state) => state.history.taskLogLoading);
  const taskLoading = useSelector((state) => state.history.taskLoading);
  const [activeTab, setActiveTab] = useState("Success");
  const [activeTask, setActiveTask] = useState(0);
  // useEffect(() => {
  //   if (taskList.length > 0 && taskLog.length == 0) {
  //     dispatch(getTaskDetails(taskList[0].id));
  //   }
  // }, [taskList]);
  useEffect(() => {
    if (flow_id) {
      dispatch(getLogsList({
        start_date: "2020-04-12",
        end_date: "2023-04-12",
        task_log_type: activeTab.toUpperCase(),
        page_index: 1,
        page_size: 60,
        konnect_id: flow_id,
      }));
    }
  }, [flow_id, activeTab]);

  

  const renderTaskData = (data) => {
    if (typeof data === 'object' && data !== null) {
      return JSON.stringify(data);
    }
    return String(data);
  };

  return (
    <>
      <Modal
        isCentered
        onClose={onClose}
        isOpen={isOpen}
        motionPreset="slideInBottom"
      >
        <ModalOverlay />
        <ModalContent
          sx={{
            p: "20px",
            // gap: "20px",
            minHeight: "300px",
            height: "600px",
            minW: "900px",
            maxW: "900px",
            flexDir: "row",
          }}
        >
          <Flex
            sx={{
              width: "300px",
              position: "relative",
              height: "100%",
              flexDir: "column",
              gap: "20px",
              zIndex: 1,
              borderRight: "1.5px solid #32435b",
            }}
          >
            <Flex sx={{ flexDir: "column" }}>
              <Flex
                sx={{
                  width: "100%",
                  border: "solid #33455b",
                  borderWidth: "2px 0px 2px 2px",
                }}
              >
                <Flex
                  onClick={() => {
                    setActiveTab("Success");
                    dispatch(
                      getLogsList({
                        start_date: "2020-04-12",
                        end_date: "2023-04-12",
                        task_log_type: "SUCCESS",
                        page_index: 1,
                        page_size: 60,
                        konnect_id: flow_id,
                      })
                    );
                  }}
                  sx={{
                    width: "100%",
                    gap: "5px",
                    p: "10px",
                    alignItems: "center",
                    color: activeTab == "Success" ? "#fff" : "#000",
                    bgColor: activeTab == "Success" ? "#33455b" : "#fff",
                    transition: "color 0.5s, background 0.5s",
                    fontWeight: activeTab == "Success" ? 600 : 500,
                    cursor: "pointer",
                    fontSize: 15,
                  }}
                >
                  <Flex>
                    <Icon
                      as={IoMdCheckmarkCircleOutline}
                      boxSize="22px"
                      id="icon"
                    />
                  </Flex>
                  Success
                </Flex>
                <Flex
                  onClick={() => {
                    setActiveTab("Error");
                    dispatch(
                      getLogsList({
                        start_date: "2020-04-12",
                        end_date: "2023-04-12",
                        task_log_type: "ERROR",
                        page_index: 1,
                        page_size: 60,
                        konnect_id: flow_id,
                      })
                    );
                  }}
                  sx={{
                    width: "100%",
                    gap: "5px",
                    p: "10px",
                    color: activeTab == "Error" ? "#fff" : "#000",
                    bgColor: activeTab == "Error" ? "#33455b" : "#fff",
                    fontWeight: activeTab == "Error" ? 600 : 500,
                    transition: "color 0.5s, background 0.5s",
                    cursor: "pointer",
                    alignItems: "center",
                    fontSize: 15,
                  }}
                >
                  <Flex>
                    <Icon as={VscError} boxSize="22px" id="icon" />
                  </Flex>
                  Error
                </Flex>
              </Flex>
            </Flex>
            <Flex sx={{ position: "relative", height: "100%", width: "100%" }}>
              <Flex
                sx={{
                  width: "100%",
                  // height: "100%",
                  overflowY: "auto",
                  position: "absolute",
                  top: "0px",
                  bottom: "0px",
                  left: "0px",
                  gap: "10px",
                  right: "0px",
                  flexDir: "column",
                }}
              >
                {taskLoading ? (
                  <CircularProgress
                    isIndeterminate
                    color="#33455b"
                    size="30px"
                    sx={{ m: "auto" }}
                  />
                ) : taskList.length > 0 ? (
                  taskList.map((task, i) => {
                    return (
                      <Flex
                        key={i}
                        onClick={() => {
                          setActiveTask(i);
                          dispatch(getTaskDetails(task.id));
                        }}
                        sx={{
                          flexDir: "column",
                          position: "relative",
                          gap: "5px",
                          cursor: "pointer",
                          bgColor: activeTask == i ? "#e1e5e9" : "#fff",
                          transition: "background 0.3s",
                          borderLeft: "1px solid #32435b",
                          borderBottom: "1px solid #32435b",
                          borderTop: "1px solid #32435b",
                          borderTopLeftRadius: "6px",
                          borderBottomLeftRadius: "6px",
                          p: "10px",
                          zIndex: 1,
                        }}
                      >
                        <Flex sx={{ fontSize: 14 }}>Task Id: {task.id}</Flex>
                        <Flex>Task Date: {task.task_date.slice(0, 10)}</Flex>
                      </Flex>
                    );
                  })
                ) : (
                  <>No Task Found</>
                )}
              </Flex>
            </Flex>
          </Flex>
          <Flex
            sx={{ p: "0px", gap: "20px", flexDir: "column", width: "100%" }}
          >
            {" "}
            <Flex
              sx={{
                width: "100%",
                gap: "5px",
                p: "10px",
                alignItems: "center",
                border: "2px solid #32435b",
                color: "#fff",
                bgColor: "#32445b",
                transition: "color 0.5s, background 0.5s",
                fontSize: 15,
              }}
            >
              <Flex>
                <Icon as={GoTasklist} boxSize="22px" id="icon" />
              </Flex>
              Task Details
            </Flex>
            <Flex
              sx={{
                position: "relative",
                height: "100%",
                width: "100%",
              }}
            >
              <Flex
                sx={{
                  position: "absolute",
                  top: "0px",
                  bottom: "0px",
                  left: "0px",
                  px: "20px",
                  right: "0px",
                  overflow: "auto",
                  flexDir: "column",
                  gap: "10px",
                }}
              >
                {taskLogLoading ? (
                  <CircularProgress
                    isIndeterminate
                    color="#33455b"
                    size="30px"
                    sx={{ m: "auto" }}
                  />
                ) : taskLog.length > 0 ? (
                  taskLog.map((task, i) => {
                    return (
                      <Flex
                        key={i}
                        sx={{
                          flexDir: "column",
                          position: "relative",
                          width: "100%",
                          gap: "5px",
                          cursor: "pointer",
                          transition: "background 0.3s",
                          border: "1px solid #32435b",
                          borderRadius: "6px",
                          p: "10px",
                          zIndex: 1,
                          "&:hover": {
                            bgColor: "#e1e5e9",
                          },
                        }}
                      >
                        <Flex sx={{ fontSize: 14 }}>Id: {task.id}</Flex>
                        <Flex sx={{ fontSize: 14 }}>
                          Date: {task.task_date.slice(0, 10)}
                        </Flex>
                        <Flex sx={{ fontSize: 14 }}>Data:</Flex>
                        <Flex
                          sx={{ flexDir: "column", gap: "5px", pl: "10px" }}
                        >
                          {Object.entries(task?.data).map(([key, value], i) => {
                            return (
                              <Tooltip key={i} label={renderTaskData(value)}>
                                <Flex
                                  key={i}
                                  sx={{
                                    whiteSpace: "nowrap",
                                    overflowX: "hidden",
                                  }}
                                >
                                  {key}: {renderTaskData(value)}
                                </Flex>
                              </Tooltip>
                            );
                          })}
                        </Flex>{" "}
                      </Flex>
                    );
                  })
                ) : (
                  <>No Task Logs Found</>
                )}
              </Flex>
            </Flex>
          </Flex>
        </ModalContent>
      </Modal>
    </>
  );
});
