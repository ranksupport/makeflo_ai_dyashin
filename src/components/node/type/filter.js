import { Flex, useToast } from "@chakra-ui/react";
import React, { memo, useRef } from "react";
import { AppInfo } from "../ui/appInfo";
import { FilterConfigContainer } from "../ui/configuration";
import { useDispatch } from "react-redux";
import {
  setAppStatus,
  closeAllAdditionalResponse,
  resetConfig,
} from "../../../store/slices/flowSlice";
import { deleteKonnectId, onTest } from "../../../store/thunk/flowThunk";
import { ResponseContainer } from "../ui/response";
import FilerConfigs from "../ui/filerConfigs";
export const Filter = memo(({ data }) => {
  const nodeOuter = useRef();
  const dispatch = useDispatch();
  const toast = useToast();
  const helper = {
    onTest: () => {
      dispatch(setAppStatus({ node_id: data.node_id, status: "Loading" }));
      dispatch(deleteKonnectId(data.node_id));
      dispatch(closeAllAdditionalResponse());
      dispatch(resetConfig({ node_id: data.node_id, type: "Normal" }));
      dispatch(onTest({ nodeId: data.node_id, toast: toast })).then((res) => {
       
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
      <FilterConfigContainer
        responses={data.configResponses}
        filterValues={data?.filterValues}
      />
      <FilerConfigs
        nodeOuter={nodeOuter}
        nodeId={data.node_id}
        value={data.selectedAddonsValue}
        collapseConfiguration={data.app_status.collapseConfiguration}
        filterValues={data.filterValues}
        options={
          data?.dataForCondition ? data?.dataForCondition : data.dataForSelect
        }
      />
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
      {data.additionalResponses && <Flex>Response</Flex>}
      <ResponseContainer response={data.configResponses} />
    </Flex>
  );
});
