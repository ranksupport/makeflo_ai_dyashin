import { Button, Flex, Input, useToast } from "@chakra-ui/react";
import React, { memo, useRef, useState } from "react";
import { AppInfo } from "../ui/appInfo";
import { EventAccount } from "../ui/configuration";
import { useDispatch } from "react-redux";
import { captureWebHookResponse } from "../../../store/thunk/flowThunk";
import { ResponseContainer, ResponseModal } from "../ui/response";
import {
  handleToggle,
  resetConfig,
  setAppStatus,
  showResponseShowInNode,
} from "../../../store/slices/flowSlice";
import { RxExternalLink } from "react-icons/rx";
export const WebhookInner = memo(({ data, dragging }) => {
  const dispatch = useDispatch();
  const [copyClipboard, setCopyClipboard] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const inputRef = useRef();
  const toast = useToast();
  const nodeOuter = useRef();
  let hookTimer = null;
  const helper = {
    onCaptureResponse: () => {
      dispatch(resetConfig({ node_id: data.node_id }));
      if (data.app_status.type != "Loading") {
        setCopyClipboard(true);
        let input = document.createElement("input");
        input.value = data.app_detail.webhook_url;
        document.body.appendChild(input);
        input.select();
        document.execCommand("copy");
        document.body.removeChild(input);
        setTimeout(() => {
          setCopyClipboard(false);
        }, 2000);
        const hitCapture = () => {
          dispatch(setAppStatus({ node_id: data.node_id, status: "Loading" }));
          dispatch(
            captureWebHookResponse({ node_id: data.node_id, toast: toast })
          ).then((res) => {
            if (res?.payload?.message !== "WAITING") {
              clearInterval(hookTimer);
            }
            if (res?.payload?.test_status === "Success") {
              // dispatch(saveKonnect({ publish: false }));
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
            }
          });
          dispatch(handleToggle())
        };
        !hookTimer && hitCapture();
        hookTimer = setInterval(hitCapture, 7000);
      }
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
        border: "1px solid #BDBDDA",
        borderRadius: "6px",
        boxShadow: "0px 0px 10px 1px rgb(52,69,91, 0.5)",
      }}
    >
      <AppInfo
        data={data.app_detail}
        node_id={data.node_id}
        status={data?.app_status?.type}
        message={data?.response_payload?.display_message}
        hookTimer={hookTimer}
        tested={data?.konnect_activity_id >= 0 ? true : false}
        errorMessage={data?.app_status?.errorMessage}
      />

      <EventAccount
        provider={data.app_detail.provider}
        app_event_present={data.app_info?.app_Events?.length ? false : true}
        node_id={data.node_id}
        nodeOuter={nodeOuter}
        events={data.app_info?.app_Events}
        selectedEvent={data?.selectedEvent}
        basic_auth={data.basic_auth}
        type="in_House"
      />

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
        {!showInstructions &&
        data.app_detail.provider.toLowerCase() !== "webhook" ? (
          <>
            {" "}
            <Flex sx={{ justifyContent: "center", textAlign: "center" }}>
              Configure your application with the webhook URL for seamless
              integration
            </Flex>
            <Flex alignItems="center">
              For Instructions Click
              <span
                onClick={() => setShowInstructions(true)}
                style={{
                  paddingLeft: "3px",
                  paddingRight: "5px",
                  color: "#152F73",
                  cursor: "pointer",
                  textDecoration: "underline",
                }}
              >
                Here
              </span>
              <RxExternalLink />
            </Flex>
          </>
        ) : null}

        {showInstructions && (
          <InstructionModal
            data={data.app_detail.webhook_instructions}
            setShowInstructions={setShowInstructions}
          />
        )}
        {showInstructions === false &&
          data.app_detail.provider.toLowerCase() === "webhook" && (
            <Flex sx={{ justifyContent: "center", textAlign: "center" }}>
              Configure your application with the webhook URL for seamless
              integration.
            </Flex>
          )}
        <Flex position="relative">
          <Input
            ref={inputRef}
            value={data.app_detail.webhook_url}
            readOnly
            isDisabled={true}
            sx={{
              py: "25px",
              outline: "1px solid #ABB6C8",
              "&:disabled": {
                opacity: 1,
              },
            }}
          />
          <Button
            onClick={async () => {
              setCopyClipboard(true);
              let input = document.createElement("input");
              input.value = inputRef.current.value;
              document.body.appendChild(input);
              input.select();
              document.execCommand("copy");
              document.body.removeChild(input);

              setTimeout(() => {
                setCopyClipboard(false);
              }, 2000);
            }}
            sx={{
              position: "absolute",
              right: "0px",
              height: "100%",
              fontWeight: 500,
            }}
          >
            {copyClipboard ? "Copied" : "Copy"}
          </Button>
        </Flex>
      </Flex>
      <Flex gap="15px">
        <Flex
          onClick={helper.onCaptureResponse}
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
            borderBottom: "1px solid #0285ff",
            p: "15px",
          }}
        >
          {data.app_status.type == "Loading"
            ? "Please Wait..."
            : "Capture Response"}
        </Flex>
      </Flex>
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
          {data?.app_status.totalConfigResponses > 3 && (
            <Flex sx={{ justifyContent: "flex-end" }}>
              <Flex
                onClick={() =>
                  dispatch(
                    showResponseShowInNode({
                      node_id: data.node_id,
                      status: !data.app_status.showResponse,
                    })
                  )
                }
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

const InstructionModal = React.memo(({ data, setShowInstructions }) => {
  return (
    <>
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
        <Flex sx={{ flexDirection: "column", overflowY: "auto" }}>
          {data.trim() !== "" &&
            JSON.parse(data).map((item, i) => (
              <Flex
                key={i}
                sx={{
                  color: "#7E7E7E",
                  fontSize: 13,
                  "& a": { color: "#F7C545", textDecoration: "none" },
                }}
              >
                - <label dangerouslySetInnerHTML={{ __html: item }}></label>
                <br />
              </Flex>
            ))}
        </Flex>{" "}
        <Button
          onClick={() => setShowInstructions(false)}
          size="sm"
          sx={{
            px: "20px",
            bgColor: "#33444E",
            color: "#fff",
            "&:hover": {
              bgColor: "#33444E",
            },
            display: "flex",
            m: "0px auto",
            justifyContent: "center",

            border: "1px solid #BDBDDA",
          }}
        >
          OK
        </Button>
      </Flex>
    </>
  );
});

export const rawdata = {
  nodes: [
    {
      id: "sAYt_lIkKV_CVxMfLFSko",
      position: {
        x: -197.80067928731626,
        y: 82.40001157876105,
      },
      data: {
        id: 11,
        name: "Webhook",
        image:
          "https://konnectz-prod-bucket.s3-us-east-2.amazonaws.com/apps/images/000/000/011/original/Group_192.svg",
        auth_type: "",
        background: "#e9f7ec",
        associatedAccounts: 1,
        webhook_enabled: true,
        webhook_instructions: "",
        // webhook_url: "https://hook.kntz.it/catch/2nqrci3mgr-kz467-ICek7reTSX",
        webhook_url: "https://sd.konnectzit.com/catch/2nqrci3mgr-kz467-ICek7reTSX",
        provider: "webhook",
        type: "WEBHOOK",
        side: "Left",
        nodeId: "sAYt_lIkKV_CVxMfLFSko",
        loading: false,
        status: "Success",
        captureMessage: "Success: Data received from Webhook",
        nodeIdx: 0,
        node_link: [],
        link_data: {
          normal: [],
          additional: [],
        },
        refreshed: false,
        awaitingWebhookResponse: false,
        display_message: "Success: Data received from Webhook",
        webhookRawResponse: {
          name: "test",
          controller: "api/v1/konnect_webhooks",
          action: "catch",
          identifier: "2nqrci3mgr-kz467-ICek7reTSX",
        },
        tested: true,
        reviewed: true,
        konnect_id: 94913,
        konnect_activity_id: 0,
        test_status: "Success",
      },
      dragHandle: "#drag",
      type: "WebHookInner",
      width: 360,
      height: 538,
      selected: false,
      dragging: false,
      positionAbsolute: {
        x: -197.80067928731626,
        y: 82.40001157876105,
      },
    },
  ],
  edges: [
    {
      source: "ws_V80m2UUsx7t_BrWSI7",
      sourceHandle: "LgqIyKZ46nRuakB03NGUz|source",
      target: "MDqLbeu7r8-86KgoQn14S",
      targetHandle: "ObNdKrAdVs6TUktSAIiNq|target",
      id: "MuIZ0b7ZAFr3TEXWL4fLb",
      direct_link: [],
      type: "buttonedge",
    },
    {
      source: "MDqLbeu7r8-86KgoQn14S",
      sourceHandle: "LS3S1TYfSoJ19Dde4IYx5|source",
      target: "7xAclZjwbyPCRnt5Fp5wK",
      targetHandle: "xUUI6jHQlk3uVUg95N5T-|target",
      id: "1J-CCSaHgXWqgJmOtXx8g",
      direct_link: [],
      type: "buttonedge",
    },
  ],
  canvasname: "ReactFlow2.2",
  konnect_id: 94913,
};
