import {
  Button,
  Flex,
  useDisclosure,
  useToast,
  Drawer,
  DrawerContent,
  DrawerOverlay,
  Checkbox,
} from "@chakra-ui/react";
import React, { memo, useRef, useState } from "react";
import { AppInfo } from "../ui/appInfo";
import {
  Configuration,
  EventAccount,
  InputParameter,
} from "../ui/configuration";
import { useDispatch ,useSelector} from "react-redux";
import {
  addMoreResponses,
  closeAllAdditionalResponse,
  resetConfig,
  setAppStatus, showResponseShowInNode,
} from "../../../store/slices/flowSlice";
import { deleteKonnectId, onTest ,

} from "../../../store/thunk/flowThunk";
import { ResponseContainer, ResponseModal } from "../ui/response";
import TriggerPopUp from "./triggerPopUp";
export const TriggerNode = memo(({ data }) => {
  const nodeOuter = useRef();
  const { triggerPopUp } = useSelector(state => state.canvas)

  const dispatch = useDispatch();
  const [showResponse, setShowResponse] = useState(false);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const helper = {
    onTest: () => {
      dispatch(setAppStatus({ node_id: data.node_id, status: "Loading" }));
      dispatch(deleteKonnectId(data.node_id));
      dispatch(closeAllAdditionalResponse());
      dispatch(resetConfig({ node_id: data.node_id, type: "Normal" }));
      dispatch(onTest({ nodeId: data.node_id ,toast:toast})).then((res) => {
     
        if (res.payload?.test_status?.toLowerCase() === "success") {

          toast({
            position: "top",
            status: "success",
            variant: "solid",
            title: res?.payload?.display_message,
            duration: 2500,
            containerStyle: {
              fontWeight: 400,
            },
          });
        } else {
        }
      });
    },
    additional: () => {
      dispatch(addMoreResponses(data.node_id));
    },
  };
  return (
    <Flex
      ref={nodeOuter}
      id="drag"
      sx={{
        height: "100%",
        flexDir: "column",
        gap: "15px",
        p: "20px",
        width: "450px",
        bgColor: "#fff",
        position: "relative",
        borderRadius: "6px",
        border: "1px solid #BDBDDA",
        boxShadow: "0px 0px 10px 1px rgb(52,69,91, 0.5)",
      }}
    >
      <AppInfo
        data={data.app_detail}
        node_id={data.node_id}
        status={data?.app_status?.type}
        message={data?.response_payload?.display_message}
        accounts={data?.app_info?.app_accounts}
        nodeOuter={nodeOuter}
        timerConfigs={data?.app_info?.timerConfigs}
        hasTimer={data?.app_status?.hasTimer}
        delayReady={data?.app_info?.delayReady?data?.app_info?.delayReady:false}

      />

      <EventAccount
        provider={data.app_detail.provider}
        app_event_present={data.app_info?.app_Events?.length ? false : true}
        node_id={data.node_id}
        nodeOuter={nodeOuter}
        events={data.app_info?.app_Events}
        selectedEvent={data?.selectedEvent}
        selectedAccount={data?.selectedAccount}
        accounts={data?.app_info?.app_accounts}
        collapseEventAccount={data?.app_status?.collapseEventAccount}
      />
      {data &&
        data.response_payload?.konnect_custom &&
        data.response_payload?.konnect_custom?.script_id &&
        triggerPopUp=== true && (
          <TriggerPopUp  scriptId={data.response_payload?.konnect_custom?.script_id} />
        )}
      {data?.app_info.app_Event_Configurations?.length > 0 && (
        <Configuration
          collapseConfiguration={data.app_status.collapseConfiguration}
          nodeOuter={nodeOuter}
          hasSequence={data?.app_status.hasSequence}
          appEventConfigurations={data?.app_info.app_Event_Configurations}
          fetchFieldStatus={data?.app_status.fetchFieldStatus}
          node_id={data.node_id}
        />
      )}
      {data?.configResponses?.length > 0 && (
        <>
          <InputParameter
            configResponses={data?.configResponses}
            nodeOuter={nodeOuter}
            options={data.dataForSelect}
          />
         <Flex
         onClick={() => {
          onOpen();
        }}
            sx={{
              justifyContent: "center",
              cursor:
                data.app_status.type == "Loading" ? "not-allowed" : "pointer",
              textAlign: "center",
              color: "#000",
              borderRadius: "8px",
              backgroundColor: "#EDF2F7",
              width: "100%",
              border: "1px solid #BDBDDA",
              boxShadow: `0px 1px 3px -0.5px ${
                data?.app_status.type == "Success"
                  ? "#2a9006"
                  : data?.app_status.type == "Error"
                  ? "#FC2B2B"
                  : "#0285ff"
              }`,
              p: "15px",
            }}
          >
            {data.app_status.type == "Loading"
              ? "Please Wait..."
              : "Test & Review"}
          </Flex>
        </>
      )}
      {isOpen && (
        <SheetPanel
          isOpen={isOpen}
          onClose={onClose}
          data={data}
          node_id={data.node_id}
          nodeOuter={nodeOuter}
        />
      )}

      {data?.app_status?.showAddResponseButton && (
        <Button onClick={helper.additional}>
          {data.app_status.showMoreConfig === true
            ? "Add More Responses"
            : "Show Less response"}
        </Button>
      )}
      {data?.response_payload && (
        <Flex
          sx={{
            justifyContent: "space-between",
            borderRadius: "12px",
            gap: "20px",
            width: "100%",
            flexDir: "column",
            border: "1px solid #BDBDDA",
            p: "20px",
          }}
        >
          <Flex>Responses</Flex>
          <ResponseContainer response={data.configResponses} />
          {data?.app_status.totalConfigResponses > 3 &&
            data?.app_status.totalConfigResponses -
              data?.app_status.visibleConfigResponses !=
              0 && (
              <Flex sx={{ justifyContent: "flex-end" }}>
                <Flex
                  onClick={() =>  dispatch(
                    showResponseShowInNode({
                      node_id: data.node_id,
                      status: !data.app_status.showResponse,
                    })
                  )}
                  sx={{
                    cursor: "pointer",
                    bgColor: "#EDF2F7",
                    border: "1px solid #BDBDDA",
                    px: "10px",
                    py: "3px",
                    borderRadius: "8px",
                  }}
                >
                  {data?.app_status.totalConfigResponses -
                  data?.app_status.visibleConfigResponses ===
                0
                  ? "See Values"
                  : "+" +
                    (data?.app_status.totalConfigResponses -
                      data?.app_status.visibleConfigResponses) +
                    " more"}
                </Flex>
              </Flex>
            )}
          {data.app_status.showResponse&& (
            <ResponseModal
              nodeOuter={nodeOuter}
              response={data.response_payload?.raw_response}
            />
          )}
        </Flex>
      )}
    </Flex>
  );
});

const SheetPanel = ({
  isOpen,
  onClose,
  accounts,
  data,
  configResponses,
  node_id = "",
  dash = false,
  nodeOuter,
}) => {
  const dispatch = useDispatch();
  const toast = useToast();
  const [isAndSelected, setIsSelected] = useState(true);
  const [result, setResult] = useState(data.configResponses);
  const [list, setList] = useState(
    result.map((r) => {
      return {
        ...r,
        checked: false,
      };
    })
  );
  const [displayValue, setDisplayValue] = useState();

  const handleCheck = (e, id) => {
    setList((c) =>
      c.map((res) => {
        if (id === res.port.id) {
          return { ...res, checked: e.target.checked };
        } else return res;
      })
    );
    setResult((c) =>
      c.map((res) => {
        if (id === res.port.id) {
          return { ...res, checked: e.target.checked };
        } else return res;
      })
    );
  };
  const helper = {
    onTest: () => {
      dispatch(setAppStatus({ node_id: data.node_id, status: "Loading" }));
      dispatch(deleteKonnectId(data.node_id));
      dispatch(closeAllAdditionalResponse());
      dispatch(resetConfig({ node_id: data.node_id, type: "Normal" }));
      dispatch(onTest({ nodeId: data.node_id ,toast:toast})).then((res) => {
       
        if (res.payload?.test_status?.toLowerCase() === "success") {

          toast({
            position: "top",
            status: "success",
            variant: "solid",
            title: res?.payload?.display_message,
            duration: 2500,
            containerStyle: {
              fontWeight: 400,
            },
          });
        } else {
        }
      });
    },
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
        <Flex
          height="100%"
          width="100%"
          sx={{
            p: "16px",
            flexDirection: "column",
            bgColor: "#fff",
            borderBottomRightRadius: "4px",
            borderBottomLeftRadius: "4px",
            justifyContent: "space-between",
          }}
        >
          {isAndSelected ? (
            <>
              <Button
                colorScheme="teal"
                variant="solid"
                onClick={() => setIsSelected(true)}
              >
                {"AND"}
              </Button>
              <Button onClick={() => setIsSelected(false)}>OR</Button>
            </>
          ) : (
            <>
              <Button onClick={() => setIsSelected(true)}>AND</Button>
              <Button
                colorScheme="teal"
                variant="solid"
                onClick={() => setIsSelected(false)}
              >
                {"OR"}
              </Button>
            </>
          )}
          {
            <Flex height="100%" width="100%" sx={{ position: "relative" }}>
              <Flex
                onMouseEnter={() => nodeOuter.current.classList.add("nowheel")}
                onMouseLeave={() =>
                  nodeOuter.current.classList.remove("nowheel")
                }
                sx={{
                  height: "100%",
                  gap: "10px",
                  flexDirection: "column",
                  position: "absolute",
                  p: "5px 5px 5px 2px",
                  top: "0px",
                  left: "0px",
                  right: "0px",
                  bottom: "0px",
                  borderBottomRightRadius: "4px",
                  borderBottomLeftRadius: "4px",
                  overflowY: "auto",
                }}
              >
                {list[0].id !== "Not-found" ? (
                  list.map((response, i) => {
                    return (
                      <Checkbox
                        key={i}
                        onMouseEnter={() => setDisplayValue(i)}
                        onMouseLeave={() => setDisplayValue(null)}
                        isChecked={response.checked}
                        onChange={(e) => handleCheck(e, response.port.id)}
                        sx={{
                          wordBreak: "break-all",
                          "&:hover": {
                            outline: "1px solid #b7caff",
                            borderRadius: "4px",
                          },
                        }}
                      >
                        {`${response.label}`}
                      </Checkbox>
                    );
                  })
                ) : (
                  <>{"No Label Found"}</>
                )}
              </Flex>
            </Flex>
          }
          <Flex>
            <Button
              sx={{ backgroundColor: "#12BDAD", flex: 1 }}
              onClick={() => {
                helper.onTest();
                onClose();
              }}
            >
              {"Proceed"}
            </Button>
            <Button
              sx={{ backgroundColor: "#FE6463", flex: 1 }}
              onClick={() => {
                alert("hello");
              }}
            >
              {"Cancel"}
            </Button>
          </Flex>
        </Flex>
      </DrawerContent>
    </Drawer>
  );
};
