import React from "react";
import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  captureWebResponse,
  deletetheFlow,
  getAppEventConfig,
  getAppEventConfigDetails,
  getAppEventConfigDetailsFetchsimple,
  getAppEvents,
  getLinkedAccount,
  getTheFlow,
  onNodeDeleteV2,
  saveflow,
  testAndReview,
  moveKonnectsToFolderPost,
  // getAppEventConfigDetailCust,
  // getAppEventConfigDetailfetchuserDefined,
  // getAppEventConfigDetailCustomKmap,
  // getAppEventConfigDetailFetchKMap

} from "../../api-client";
import { juiceMaker } from "../../commonFunctions";

// export const moveFlow = createAsyncThunk(
//   "moveFlow",
//   async ({ flowId, newFolderId }, { rejectWithValue }) => {
//     try {
//       const response = await moveFlowToFolder(flowId, newFolderId);
//       return response.data;
//     } catch (err) {
//       return rejectWithValue(err.message);
//     }
//   }
// );

// export const moveFlow = createAsyncThunk(
//   'flow/moveFlow',
//   async ({ flowId, newFolderId }, { rejectWithValue }) => {
//     try {
//       const response = await moveFlowToFolder(flowId, newFolderId);
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response.data);
//     }
//   }
// );

export const moveKonnectsToFolder = createAsyncThunk(
  "moveKonnectsToFolder",
  async (props, { rejectWithValue }) => {
    try {
      const response = await moveKonnectsToFolderPost(props);
      const data = response?.data;
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const captureWebHookResponse = createAsyncThunk(
  "captureWebHookResponse",
  async (_, { rejectWithValue, getState }) => {
    const { canvas } = getState();
    const webhookNode = canvas.flowState.apps[0];
    try {
      const response = await captureWebResponse(webhookNode);
      return response?.data;
    } catch (err) {
      return rejectWithValue(err.response);
    }
  }
);

export const get_Events = createAsyncThunk(
  "get_Events",
  async (body, { rejectWithValue, ...rest }) => {
    try {
      const response = await getAppEvents(body.appId);
      return response.data.map((res) => {
        return { ...res, label: res.name, value: res.id };
      });
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const get_accounts = createAsyncThunk(
  "get_accounts",
  async (body, { rejectWithValue }) => {
    try {
      const response = await getLinkedAccount(body.appId);
      return response.data.authorized_app_accounts.map((res) => {
        return { ...res, label: res.name, value: res.id };
      });
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);
export const get_accounts_for_app_page = createAsyncThunk(
  "get_accounts_for_app_page",
  async (body, { rejectWithValue }) => {
    try {
      const response = await getLinkedAccount(body.appId);
      return response.data.authorized_app_accounts.map((res) => {
        return { ...res, label: res.name, value: res.id };
      });
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const get_app_configs = createAsyncThunk(
  "get_app_configs",
  async (nodeId, { rejectWithValue, getState }) => {
    const { canvas } = getState();
    const appNode = canvas.flowState.apps.find(
      (app) => app.data.node_id === nodeId.nodeId
    );

    try {
      const response = await getAppEventConfig({
        ...appNode.data,
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);
export const get_app_event_config_detail = createAsyncThunk(
  "get_app_event_config_detail",
  async (data, { rejectWithValue, getState }) => {
    const { canvas } = getState();
    const appNode = canvas.flowState.apps.find(
      (app) => app.data.node_id === data.nodeId
    );
    try {
      const response = await getAppEventConfigDetails({
        ...appNode.data,
        prevSequence: data.prevValue ? data.prevValue : null,
      });
      return response;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const get_app_event_config_detail_fetch = createAsyncThunk(
  "get_app_event_config_detail_fetch",
  async (props, { rejectWithValue, getState }) => {
    const { canvas } = getState();
    const appNode= canvas.flowState.apps.find(
      (app) => app.data.node_id === props.nodeId
    );

    try {
      const response = await getAppEventConfigDetailsFetchsimple({
        ...appNode.data,
        selectedValue: props.selectedValue,
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);
export const onDeleteNodeV2 = createAsyncThunk(
  "onDeleteNodeV2",
  async (nodeId, { rejectWithValue, getState }) => {
    const { canvas } = getState();
    const nodeIdx = canvas.flowState.apps.findIndex(
      (node) => node.data.node_id === nodeId
    );
    if (nodeIdx === 0 && canvas.flowState.apps.length > 1) {
      return {
        message: "Cannot delete Trigger while Action present.",
        status: "warning",
      };
    }
    {
      try {
        const response = await onNodeDeleteV2({
          konnect_activity_id:
            canvas.flowState.apps[nodeIdx].data.konnect_activity_id,
          konnect_id: canvas.flowState.apps[nodeIdx].data?.konnect_id
            ? canvas.flowState.apps[nodeIdx].data?.konnect_id
            : canvas.flowState.apps[0].data?.konnect_id,
          nodeId: nodeId,
          canvas_json: canvas.flowState,
        });
        return response.data;
      } catch (err) {
        return rejectWithValue(err.message);
      }
    }
  }
);
export const onTest = createAsyncThunk(
  "onTest",
  async (props, { rejectWithValue, getState }) => {
    const { canvas } = getState();
    const appNode = canvas.flowState.apps.find(
      (app) => app.data.node_id === props.nodeId
    );

    const nodeIdx = canvas.flowState.apps.findIndex(
      (app) => app.data.node_id === props.nodeId
    );

    let payload = {},
      dirty = false;
    if (
      !canvas.flowState.apps[0].data?.response_payload?.konnect_id &&
      nodeIdx !== 0
    ) {


      // props.toast({
      //   position: "top",
      //   status: "warning",
      //   variant: "solid",
      //   title:
      //   `Test Your ${appNode.data.app_detail.name} after testing your Triggering app`,
      //   duration: 2500,
      //   containerStyle: {
      //     fontWeight: 400,
      //   },
      // });
      return rejectWithValue({ message: `Test Your ${appNode.data.app_detail.name} after testing your Triggering app` })

   
       
      
    }

    switch (nodeIdx) {
      case 0:
        let selectedConfigDetails = {};
        if (appNode.data.app_detail.name === "Scheduler") {
          const { localData, ...rest } = appNode.data.selectedValue;
          selectedConfigDetails = rest;
        } else {
          appNode.data.app_info.app_Event_Configurations.map((config) => {
            if (config.selected) {
              selectedConfigDetails[config.config_key] = config.selected.id;
            }
          });
        }

        payload = {
          left_app_id: appNode.data.app_detail.id,
          left_app_event_id: appNode.data.appEvent,
          left_config: selectedConfigDetails,
          canvas_json: canvas.flowState,
          app_account_id: appNode.data?.selectedAccount
            ? appNode.data.selectedAccount.id
            : null,
          konnect_id: appNode.data?.response_payload?.konnect_id ? appNode.data?.response_payload.konnect_id : null,
        };
        break;
      default:
        const _payload = juiceMaker({
          appNode,
          apps: canvas.flowState.apps,
          links: canvas.flowState.links,
        });
        payload = _payload;
        payload.canvas_json = canvas.flowState;
        if(appNode.data?.response_payload?.konnect_activity_id){
          payload.konnect_activity_id=appNode.data?.response_payload?.konnect_activity_id

        }
        canvas.flowState.apps[nodeIdx].data?.configResponses?.map((x) => {
          if (x.config_key_required && !x.value) {
            return (dirty = true);
          }
        });
        break;
    }
    if (dirty) {
      return rejectWithValue({ message: "Please fill the values of mandatory fields before Testing" })

    } else {
      try {
        const response = await testAndReview({ payload: payload });
        return response.data;
      } catch (err) {
        return rejectWithValue(err.message);
      }
    }
  }
);
export const deleteKonnectId = createAsyncThunk(
  "deleteKonnectId",
  async (nodeId, { rejectWithValue, getState }) => {
    const { canvas } = getState();
    const node = canvas.flowState.apps.find(
      (node) => node.data.node_id === nodeId
    );
    let comparedValueIsMore = false;
    node.data.configResponses.map((config) => {
      if (!config.additional && config.sequence == 0 && config.value) {
        if (node.data.konnect_activity_id) {
          if (
            config.type === "map" &&
            config.valueForTest.konnect_activity_id >
              node.data.konnect_activity_id
          ) {
            comparedValueIsMore = true;
          }
        } else return;
      }
    });
    if ((comparedValueIsMore = false)) {
      return;
    }
    {
      try {
        const response = await onNodeDeleteV2({
          konnect_activity_id: node.data.konnect_activity_id,
          konnect_id: node.data?.konnect_id
            ? node.data?.konnect_id
            : node.data?.konnect_id,
          nodeId: nodeId,
          canvas_json: canvas.flowState,
        });
        return response.data;
      } catch (err) {
        return rejectWithValue(err.message);
      }
    }
  }
);
export const saveFlow = createAsyncThunk(
  "saveFlow",
  async (props, { rejectWithValue, getState }) => {
    const { canvas } = getState();
    // if (canvas.flowState?.flowName.length === 0) {
    //   return { message: "Enter Flow Name" ,type:"error"};
    // }
    if (canvas.flowState?.apps.length === 0 || !canvas.flowState?.apps[0]?.data?.response_payload?.konnect_id ) {
      props.toast({
        position: "top",
        status: "warning",
        variant: "solid",
        title:
        "As you have not choosed trigger,Please make valid flow to save it",
        duration: 2500,
        containerStyle: {
          fontWeight: 400,
        },
      });
      return rejectWithValue({ message: "Trigger not chosen" })
    }
    try {
      const response = await saveflow({
        flowState: canvas.flowState,
        ...props,
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const deleteFlow = createAsyncThunk(
  "deleteFlow",
  async (props, { rejectWithValue, getState }) => {
    const { canvas } = getState();
    let flowId=canvas.flowState.apps[0]?.data?.response_payload?.konnect_id
    if(!flowId){
      return
    }

    try {
      const response = await deletetheFlow({
        flowState: canvas.flowState,
        props:{
          id:flowId,
          status:'DELETED',
        },
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);
export const getFlow = createAsyncThunk(
  "getFlow ",
  async (body, { rejectWithValue }) => {
    try {
      const response = await getTheFlow(body);
     
      if(response.data?.canvas_json?.dataForSelect){
        
        return response.data
      }
      else return
   
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);
export const deleteFlowWithId = createAsyncThunk(
  "deleteFlowId",
  async (props, { rejectWithValue, getState }) => {
    const { canvas } = getState();
   

    try {
      const response = await deletetheFlow({
        flowState: canvas.flowState,
        props:{
          id:props,
          status:'DELETED',
        },
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

////// For Custom Input Configs

// export const getAppEventConfigDetailCustom = createAsyncThunk(
//   "getAppEventConfigDetailCustom",
//   async (props, { rejectWithValue }) => {
//     try {
//       const response = await getAppEventConfigDetailCust(props);
//       return response;
//     } catch (err) {
//       return rejectWithValue(err.message);
//     }
//   }
// );
// export const getAppEventConfigDetailFetchuserDefined = createAsyncThunk(
//   "getAppEventConfigDetailFetchuserDefined",
//   async (props, { rejectWithValue, getState }) => {
//     const { canvas } = getState();

//     try {
//       const response = await getAppEventConfigDetailfetchuserDefined({
//         ...props,
//         nodes: canvas.editorState.nodes,
//       });
//       return response.data;
//     } catch (err) {
//       return rejectWithValue(err.message);
//     }
//   }
// );

// export const getAppEventConfigDetailCustomKeymap = createAsyncThunk(
//   "getAppEventConfigDetailCustomKeymap",
//   async (props, { rejectWithValue }) => {
//     try {
//       const response = await getAppEventConfigDetailCustomKmap(props);
//       return response.data;
//     } catch (err) {
//       return rejectWithValue(err.message);
//     }
//   }
// );

// export const getAppEventConfigDetailFetchKeyMap = createAsyncThunk(
//   "getAppEventConfigDetailFetchKeyMap",
//   async (props, { rejectWithValue }) => {
//     try {
//       const response = await getAppEventConfigDetailFetchKMap(props);
//       return response.data;
//     } catch (err) {
//       return rejectWithValue(err.message);
//     }
//   }
// );