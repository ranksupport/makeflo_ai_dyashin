import {  Flex, useToast } from "@chakra-ui/react";
import React, { memo, useRef, useState } from "react";
import { AppInfo } from "../ui/appInfo";
import {
 
  EventAccount,
  InputParameter,
} from "../ui/configuration";
import { useDispatch } from "react-redux";
import {
  addMoreResponses,
  closeAllAdditionalResponse,
  resetConfig,
  setAppStatus, showResponseShowInNode,
} from "../../../store/slices/flowSlice";
import { deleteKonnectId, onTest } from "../../../store/thunk/flowThunk";
import { ResponseContainer, ResponseModal } from "../ui/response";
import { ApiConfig } from "../ui/apiConfig";

export const Api = memo(({ data }) => {
  const nodeOuter = useRef();
  const dispatch = useDispatch();
  const [showResponse, setShowResponse] = useState(false);
  const toast = useToast();
  const helper = {
    onTest: () => {
      dispatch(setAppStatus({ node_id: data.node_id, status: "Loading" }));
      dispatch(deleteKonnectId(data.node_id));
      dispatch(closeAllAdditionalResponse());
      dispatch(resetConfig({ node_id: data.node_id, type: "Normal" }));
      dispatch(onTest({ nodeId: data.node_id ,toast:toast})).then((res) => {
      
        if ( res.payload?.test_status?.toLowerCase() === "success") {

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
      />

      <EventAccount
        provider={data.app_detail.provider}
        app_event_present={data.app_info?.app_Events?.length ? false : true}
        node_id={data.node_id}
        nodeOuter={nodeOuter}
        events={data.app_info?.app_Events}
        selectedEvent={data?.selectedEvent}
        type="in_House"
        collapseEventAccount={data?.app_status?.collapseEventAccount}
      />

      {data.selectedEvent ? (
        <>
          <ApiConfig
            selectedEvent={data?.selectedEvent}
            selectedValue={data?.selectedValue}
            collapseConfiguration={data.app_status.collapseConfiguration}
            nodeOuter={nodeOuter}
            node_id={data?.node_id}
          />
          <InputParameter
            provider={data?.app_detail.provider}
            node_id={data?.node_id}
            apiDetail={data?.selectedValue?.apiDetails}
            configResponses={data?.configResponses}
            nodeOuter={nodeOuter}
            options={data.dataForSelect}
          />
          <Flex gap="15px">
          <Flex
            onClick={helper.onTest}
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
          </Flex>
        </>
      ) : null}
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
          {data.app_status.showResponse && (
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
