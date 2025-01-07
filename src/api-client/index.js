import { apiClient, apiClient1 } from "./axios";
import { routes } from "./routes";
import AuthTokenService from "../utils/AuthTokenService";

//   -----------------------login--------------------------
export const userLoginPost = (body) => {
  let tokenobj1 = AuthTokenService.get();
  return apiClient1({
    method: routes.USER_LOGIN.METHOD,
    url: routes.USER_LOGIN.URL,
    data: body,
    headers: {
      Authorization: "Bearer " + tokenobj1,
      Accept: "application/json",
      "Content-Type": "application/json; charset=utf-8",
    },
  });
};

export const userSignupPost = (body) => {
  let tokenobj1 = AuthTokenService.get();
  return apiClient1({
    method: routes.USER_SIGNUP.METHOD,
    url: routes.USER_SIGNUP.URL,
    data: body,
    headers: {
      Authorization: "Bearer " + tokenobj1,
      Accept: "application/json",
      "Content-Type": "application/json; charset=utf-8",
    },
  });
};

export const userExistPost = (body) => {
  let tokenobj1 = AuthTokenService.get();
  return apiClient1({
    method: routes.USER_EXISTS.METHOD,
    url: routes.USER_EXISTS.URL,
    data: body,
    headers: {
      Authorization: "Bearer " + tokenobj1,
      Accept: "application/json",
      "Content-Type": "application/json; charset=utf-8",
    },
  });
};

export const userVerifyPost = (body) => {
  let tokenobj1 = AuthTokenService.get();
  return apiClient1({
    method: routes.VERIFY_EMAIL.METHOD,
    url: routes.VERIFY_EMAIL.URL,
    data: body,
    headers: {
      Authorization: "Bearer " + tokenobj1,
      Accept: "application/json",
      "Content-Type": "application/json; charset=utf-8",
    },
  });
};

export const userUpdatePost = (body) => {
  let tokenobj1 = AuthTokenService.get();
  return apiClient1({
    method: routes.UPDATE_USER.METHOD,
    url: routes.UPDATE_USER.URL,
    data: body,
    headers: {
      Authorization: "Bearer " + tokenobj1,
      Accept: "application/json",
      "Content-Type": "application/json; charset=utf-8",
    },
  });
};

export const userForgotPasswordPost = (body) => {
  let tokenobj1 = AuthTokenService.get();
  return apiClient1({
    method: routes.GET_FORGOT_PASSWORD_LINK.METHOD,
    url: routes.GET_FORGOT_PASSWORD_LINK.URL,
    data: body,
    headers: {
      Authorization: "Bearer " + tokenobj1,
      Accept: "application/json",
      "Content-Type": "application/json; charset=utf-8",
    },
  });
};

export const userResetPasswordPost = (body) => {
  let tokenobj1 = AuthTokenService.get();
  return apiClient1({
    method: routes.RESET_PASSWORD.METHOD,
    url: routes.RESET_PASSWORD.URL,
    data: body,
    headers: {
      Authorization: "Bearer " + tokenobj1,
      Accept: "application/json",
      "Content-Type": "application/json; charset=utf-8",
    },
  });
};

//   -----------------------dashboard--------------------------

export const widgetsGet = () => {
  let tokenobj1 = AuthTokenService.get();
  return apiClient1({
    method: routes.GET_WIDGETS_ACTIVE.METHOD,
    url: routes.GET_WIDGETS_ACTIVE.URL,
    headers: {
      Authorization: "Bearer " + tokenobj1,
      Accept: "application/json",
      "Content-Type": "application/json; charset=utf-8",
    },
  });
};

export const widgetsDetailsGet = (widgetKey) => {
  let tokenobj1 = AuthTokenService.get();
  return apiClient1({
    method: routes.GET_WIDGETS_DETAILS.METHOD,
    url: `${routes.GET_WIDGETS_DETAILS.URL}${widgetKey}`,
    headers: {
      Authorization: "Bearer " + tokenobj1,
      Accept: "application/json",
      "Content-Type": "application/json; charset=utf-8",
    },
  });
};

export const updateKonnectStatusPost = (props) => {
  let tokenobj1 = AuthTokenService.get();
  let url = routes.UPDATE_APP_STATUS.URL + props.id + "/update_status";
  return apiClient1({
    method: routes.UPDATE_APP_STATUS.METHOD,
    url: url,
    data: { status: props.status },
    headers: {
      Authorization: "Bearer " + tokenobj1,
      Accept: "application/json",
      "Content-Type": "application/json; charset=utf-8",
    },
  });
};

//   -----------------------konnects--------------------------

export const getFoldersListGet = () => {
  let tokenobj1 = AuthTokenService.get();
  return apiClient1({
    url: routes.GET_FOLDERS_LIST.URL,
    method: routes.GET_FOLDERS_LIST.METHOD,
    headers: {
      Authorization: "Bearer " + tokenobj1,
      Accept: "application/json",
      "Content-Type": "application/json; charset=utf-8",
    },
  });
};

export const getKonnectsByFolderIdd = (id) => {
  let tokenobj1 = AuthTokenService.get();
  let url = routes.GET_FOLDER_KONNECTS.URL + id + "/konnects";

  return apiClient1({
    url: url,
    method: routes.GET_FOLDER_KONNECTS.METHOD,
    headers: {
      Authorization: "Bearer " + tokenobj1,
      Accept: "application/json",
      "Content-Type": "application/json; charset=utf-8",
    },
  });
};

export const createFolderPost = (folderName) => {
  let tokenobj1 = AuthTokenService.get();
  return apiClient1({
    url: routes.CREATE_FOLDER.URL,
    method: routes.CREATE_FOLDER.METHOD,
    data: {
      folder_name: folderName,
    },
    headers: {
      Authorization: "Bearer " + tokenobj1,
      Accept: "application/json",
      "Content-Type": "application/json; charset=utf-8",
    },
  });
};

// export const moveKonnectsToFolderPost = (props) => {
//   let tokenobj1 = AuthTokenService.get();
//   let url = routes.MOVE_KONNECTS_TO_FOLDER.URL + props.folderId + "/assign";

//   return apiClient1({
//     url: url,
//     data: {
//       konnects: props.selectedKonnects.toString(),
//     },
//     method: routes.MOVE_KONNECTS_TO_FOLDER.METHOD,
//     headers: {
//       Authorization: "Bearer " + tokenobj1,
//       Accept: "application/json",
//       "Content-Type": "application/json; charset=utf-8",
//     },
//   });
// };


export const moveKonnectsToFolderPost = ({ selectedKonnects, folderId }) => {
  let tokenobj1 = AuthTokenService.get();
  let url = routes.MOVE_KONNECTS_TO_FOLDER.URL + folderId + "/assign";

  return apiClient1({
    url: url,
    data: {
      konnects: selectedKonnects.toString(),
    },
    method: routes.MOVE_KONNECTS_TO_FOLDER.METHOD,
    headers: {
      Authorization: "Bearer " + tokenobj1,
      Accept: "application/json",
      "Content-Type": "application/json; charset=utf-8",
    },
  });
};

export const renameKonnectFolderPut = (props) => {
  let tokenobj1 = AuthTokenService.get();
  let url = routes.RENAME_FOLDER.URL + props.folderId + "/rename";

  return apiClient1({
    url: url,
    data: {
      folder_name: props.folderName,
    },
    method: routes.RENAME_FOLDER.METHOD,
    headers: {
      Authorization: "Bearer " + tokenobj1,
      Accept: "application/json",
      "Content-Type": "application/json; charset=utf-8",
    },
  });
};

export const deleteKonnectFolderGet = (folderId) => {
  let tokenobj1 = AuthTokenService.get();
  let url = routes.DELETE_FOLDER.URL + folderId + "/remove";

  return apiClient1({
    url: url,
    method: routes.DELETE_FOLDER.METHOD,
    headers: {
      Authorization: "Bearer " + tokenobj1,
      Accept: "application/json",
      "Content-Type": "application/json; charset=utf-8",
    },
  });
};

export const getKonnectsListGet = (searchQuery) => {
  let tokenobj1 = AuthTokenService.get();
  let url = routes.GET_KONNECTS_LIST.URL;

  if (searchQuery) {
    const qs = Object.keys(searchQuery)
      .map((key) => `${key}=${searchQuery[key]}`)
      .join("&");

    url = url + `?${qs}`;
  }

  return apiClient1({
    url: url,
    method: "GET",
    searchQuery,
    headers: {
      Authorization: "Bearer " + tokenobj1,
      Accept: "application/json",
      "Content-Type": "application/json; charset=utf-8",
    },
  });
};

//   -----------------------Apps--------------------------

export const getOauthDataPost = (payload) => {
  let tokenobj1 = AuthTokenService.get();
  return apiClient1({
    url: routes.GET_AUTH_URL.URL,
    data: payload,
    method: routes.GET_AUTH_URL.METHOD,
    headers: {
      Authorization: "Bearer " + tokenobj1,
      Accept: "application/json",
      "Content-Type": "application/json; charset=utf-8",
    },
  });
};

export const saveOauthDataPost = (payload) => {
  let tokenobj1 = AuthTokenService.get();
  return apiClient1({
    url: routes.SAVE_AUTH.URL,
    data: payload,
    method: routes.SAVE_AUTH.METHOD,
    headers: {
      Authorization: "Bearer " + tokenobj1,
      Accept: "application/json",
      "Content-Type": "application/json; charset=utf-8",
    },
  });
};

export const getAppDetailsGet = (payload) => {
  let tokenobj1 = AuthTokenService.get();
  let url = routes.GET_APP_DETAILS.URL + payload + "/authorized_app_accounts";

  return apiClient1({
    url: url,
    method: routes.GET_APP_DETAILS.METHOD,
    headers: {
      Authorization: "Bearer " + tokenobj1,
      Accept: "application/json",
      "Content-Type": "application/json; charset=utf-8",
    },
  });
};

export const updateAppStatusPost = (props) => {
  let tokenobj1 = AuthTokenService.get();
  let url =
    routes.UPDATE_APP_STATUS_USER.URL + "/" + props.appId + "/update_status";
  return apiClient1({
    url: url,
    data: { status: props.status },
    method: routes.UPDATE_APP_STATUS_USER.METHOD,
    headers: {
      Authorization: "Bearer " + tokenobj1,
      Accept: "application/json",
      "Content-Type": "application/json; charset=utf-8",
    },
  });
};

export const saveAuthLabelPost = (props) => {
  let tokenobj1 = AuthTokenService.get();
  let url = routes.SAVE_LABEL.URL + "/" + props.id + "/update_label";
  return apiClient1({
    url: url,
    data: { label: props.label },
    method: routes.SAVE_LABEL.METHOD,
    headers: {
      Authorization: "Bearer " + tokenobj1,
      Accept: "application/json",
      "Content-Type": "application/json; charset=utf-8",
    },
  });
};

export const addNewAccount = (props) => {
  let tokenobj1 = AuthTokenService.get();
  let url = routes.SAVE_LABEL.URL + "/" + props.id + "/update_label";
  return apiClient1({
    url: url,
    data: { label: props.label },
    method: routes.SAVE_LABEL.METHOD,
    headers: {
      Authorization: "Bearer " + tokenobj1,
      Accept: "application/json",
      "Content-Type": "application/json; charset=utf-8",
    },
  });
};

export const getAppsget = (searchQuery) => {
  let tokenobj1 = AuthTokenService.get();
  let url = routes.GET_ALL_APPS.URL;
  if (searchQuery) {
    const qs = Object.keys(searchQuery)
      .map((key) => `${key}=${searchQuery[key]}`)
      .join("&");

    url = url + `?${qs}`;
  }
  return apiClient1({
    url: url,
    method: routes.GET_ALL_APPS.METHOD,
    searchQuery,
    headers: {
      Authorization: "Bearer " + tokenobj1,
      Accept: "application/json",
      "Content-Type": "application/json; charset=utf-8",
    },
  });
};

//   -----------------------history--------------------------

export const getTaskLogsGet = (data) => {
  let tokenobj1 = AuthTokenService.get();
  let url = data.searching
    ? routes.SEARCH_TASK_LOGS.URL
    : routes.GET_TASK_LOGS.URL;
  if (data?.searchData) {
    const qs = Object.keys(data?.searchData)
      .map((key) => `${key}=${encodeURIComponent(data?.searchData[key])}`)
      .join("&");
    url = url + `?${qs}`;
  }
  return apiClient1({
    url: url,
    method: routes.GET_TASK_LOGS.METHOD,
    headers: {
      Authorization: "Bearer " + tokenobj1,
      Accept: "application/json",
      "Content-Type": "application/json; charset=utf-8",
    },
  });
};

export const getLogsGet = (searchQuery) => {
  let url = routes.GET_LOGS.URL;

  if (searchQuery) {
    const qs = Object.keys(searchQuery)
      .map((key) => `${key}=${searchQuery[key]}`)
      .join("&");

    url = url + `?${qs}`;
  }
  return apiClient({
    url: url,
    method: routes.GET_LOGS.METHOD,
    headers: {
      Authorization: AuthTokenService.get(),
    },
  });
};
export const getTaskDetailsGet = (taskId) => {
  let url = routes.GET_TASK_DETAILS.URL + taskId + "/tasks";
  return apiClient({
    url: url,
    method: routes.GET_TASK_DETAILS.METHOD,
    headers: {
      Authorization: AuthTokenService.get(),
    },
  });
};

//   -----------------------sidebar--------------------------
export const getapps = (type) => {
  // let url = type == "Action" ? routes.GET_ACTIONS.URL : routes.GET_TRIGGERS.URL;
  let url = routes.GET_ALL_APPS.URL;
  let tokenobj1 = AuthTokenService.get();
  return apiClient1({
    method: routes.GET_ALL_APPS.METHOD,
    url: url,
    headers: {
      Authorization: "Bearer " + tokenobj1,
      Accept: "application/json",
      "Content-Type": "application/json; charset=utf-8",
    },
  });
};
export const getapp = (searchQuery) => {
  let url = routes.GET_APPS.URL;
  if (searchQuery) {
    const qs = Object.keys(searchQuery)
      .map((key) => `${key}=${searchQuery[key]}`)
      .join("&");
    url = url + `?${qs}`;
  }
  return apiClient({
    method: routes.GET_APPS.METHOD,
    url: url,
    headers: {
      Authorization: AuthTokenService.get(),
    },
  });
};
export const getaddonapps = () => {
  let tokenobj1 = AuthTokenService.get();
  return apiClient1({
    method: routes.GET_ADD_ON_APPS.METHOD,
    url: routes.GET_ADD_ON_APPS.URL,
    headers: {
      Authorization: "Bearer " + tokenobj1,
      Accept: "application/json",
      "Content-Type": "application/json; charset=utf-8",
    },
  });
};

//   -----------------------sidebar--------------------------
// ... (existing code)

// Continue adding headers and using tokenobj1 in each function
export const getAppEvents = (id) => {
  let tokenobj1 = AuthTokenService.get();
  let url = routes.GET_APP_EVENTS.URL + `/${id}/app_events`;
  return apiClient1({
    method: routes.GET_APP_EVENTS.METHOD,
    url: url,
    headers: {
      Authorization: "Bearer " + tokenobj1,
      Accept: "application/json",
      "Content-Type": "application/json; charset=utf-8",
    },
  });
};

export const captureWebResponse = (node) => {
  const identifier = node.data.app_detail.webhook_url.split("/").pop();
  let payload = {};
  for (const [key] of Object.entries(node.data.app_detail)) {
    switch (key) {
      case "webhook_url":
        payload.webhookUrl = node.data.app_detail.webhook_url;
        break;
      case "id":
        payload.left_app_id = node.data.app_detail.id;
        break;
      case "appEvent":
        payload.left_app_event_id = node.data.app_detail.appEvent;
        break;
      case "enabled":
        payload.auth_enabled = true;
        payload.api_key = node.data.apiKey;
        payload.api_secret = node.data.apiSecret;
        break;
      default:
        payload.canvas_json = {};
      // if (node && node.data.konnect_id)
      //   payload.konnect_id = node.data.konnect_id;
    }
  }
  return apiClient({
    url: routes.CAPTURE_WEBHOOK_RESPONSE.URL + `${identifier}`,
    method: routes.CAPTURE_WEBHOOK_RESPONSE.METHOD,
    data: payload,
    extra: node.data,
    headers: {
      Authorization: AuthTokenService.get(),
    },
  });
};

export const getLinkedAccount = (id) => {
  let tokenobj1 = AuthTokenService.get();
  let url = routes.GET_LINKED_ACCOUNTS.URL + `/${id}/authorized_app_accounts`;
  return apiClient1({
    method: routes.GET_LINKED_ACCOUNTS.METHOD,
    url: url,
    headers: {
      Authorization: "Bearer " + tokenobj1,
      Accept: "application/json",
      "Content-Type": "application/json; charset=utf-8",
    },
  });
};

export const getAppEventConfig = (data) => {
  let url =
    routes.GET_APP_EVENT_CONFIGS.URL +
    `${data.app_detail.id}/app_events/${data.selectedEvent.id}/event_config/${
      data.app_status.app_index === 1 ? "left" : "right"
    }`;
  if (data.selectedAccount?.id)
    url += `?app_account_id=${data.selectedAccount.id}`;
  return apiClient({
    method: routes.GET_APP_EVENT_CONFIGS.METHOD,
    url: url,
    headers: {
      Authorization: AuthTokenService.get(),
    },
  });
};

export const onNodeDeleteV2 = (props) => {
  let tokenobj1 = AuthTokenService.get();
  return apiClient1({
    method: routes.ON_NODE_DELETE.METHOD,
    url: routes.ON_NODE_DELETE.URL,
    data: props,
    headers: {
      Authorization: "Bearer " + tokenobj1,
      Accept: "application/json",
      "Content-Type": "application/json; charset=utf-8",
    },
  });
};

export const testAndReview = (props) => {
  return apiClient({
    method: routes.TEST_AND_REVIEW.METHOD,
    url: routes.TEST_AND_REVIEW.URL,
    data: props.payload,
    headers: {
      Authorization: AuthTokenService.get(),
    },
  });
};

export const getAppEventConfigDetails = (nodeData) => {
  let tokenobj1 = AuthTokenService.get();
  const sequence = nodeData.prevSequence
    ? nodeData.prevSequence.sequence + 1
    : 1;
  const eventConfigId = nodeData.app_info.app_Event_Configurations.find(
    (x) => x.sequence === sequence
  ).id;
  let url =
    routes.GET_APP_EVENT_CONFIGS_DETAILS.URL +
    `${nodeData.app_detail.id}/app_events/${
      nodeData.selectedEvent.id
    }/event_config/${nodeData.selectedEvent.side.toLowerCase()}/${eventConfigId}/details?`;

  let params = "";
  if (nodeData.prevSequence) {
    nodeData.app_info.app_Event_Configurations.map((x) => {
      if (x.config_key !== nodeData.prevSequence.config_key && x.selected) {
        params += `&${x.config_key}=${x.selected.id}`;
      }
    });
  }
  if (nodeData.prevSequence) {
    url = `${url}${nodeData.prevSequence.config_key}=${nodeData.prevSequence.id}${params}`;
  }

  if (nodeData.selectedAccount?.id)
    url += `&app_account_id=${nodeData.selectedAccount.id}`;
  return apiClient({
    method: routes.GET_APP_EVENT_CONFIGS.METHOD,
    url: url,
    headers: {
      Authorization: "Bearer " + tokenobj1,
    },
  });
};
export const getAppEventConfigDetailsFetchsimple = (nodeData) => {
  let tokenobj1 = AuthTokenService.get();
  let params = "";
  nodeData.app_info.app_Event_Configurations.map((x) => {
    if (x.config_key !== "sheet_id" && x.selected)
      params += `&${x.config_key}=${x.selected.id}`;
  });
  if (nodeData.selectedValue) {
    params = `?${nodeData.selectedValue.config_key}=${nodeData.selectedValue.id}${params}`;
  }
  let url =
    routes.GET_APP_EVENT_CONFIGS_DETAILS_FETCH.URL +
    `${nodeData.app_detail.id}/app_events/${
      nodeData.selectedEvent.id
    }/event_config/${nodeData.selectedEvent.side.toLowerCase()}/${
      nodeData.selectedValue.id
    }/fetch-fields`;

  url += `${params}`;

  if (nodeData.selectedAccount.id)
    url += `&app_account_id=${nodeData.selectedAccount.id}`;
  return apiClient({
    method: routes.GET_APP_EVENT_CONFIGS_DETAILS_FETCH.METHOD,
    url: url,
    headers: {
      Authorization: "Bearer " + tokenobj1,
    },
  });
};

export const saveflow = (props) => {
  let { flowState } = props;
  console.log("flowState", flowState)
  const newFlowState = {
    ...flowState,
    konnect_id: flowState.apps[0]?.data?.konnect_id
      ? flowState.apps[0]?.data?.konnect_id
      : null,
      konnect_name:flowState.flowName
  };

  const payload = {
    canvas_name: true,
    konnect_id: flowState.apps[0]?.data?.konnect_id
      ? flowState.apps[0]?.data?.konnect_id
      : null,
    canvas_json: newFlowState,
  };
  // const flowReady = flowState.apps.every(
  //   (node) => node.data.app_status.flowReady === true
  // );

  let url =
    props.publish
      ? routes.PUBLISH_KONNECT.URL
      : routes.SAVE_KONNECT.URL;

  return apiClient({
    method: routes.SAVE_KONNECT.METHOD,
    url: url,
    data: payload,
    headers: {
      Authorization: AuthTokenService.get(),
    },
  });
};

export const getProfileGet = () => {
  return apiClient({
    url: routes.GET_PROFILE.URL,
    method: routes.GET_PROFILE.METHOD,
    headers: {
      Authorization: AuthTokenService.get(),
    },
  });
};
export const updateProfilePost = (data) => {
  return apiClient({
    url: routes.GET_PROFILE.URL,
    method: "POST",
    data: data,
    headers: {
      Authorization: AuthTokenService.get(),
    },
  });
};
export const updatePasswordPost = (data) => {
  return apiClient({
    url: routes.UPDATE_PASSWORD.URL,
    data: data,
    method: routes.UPDATE_PASSWORD.METHOD,
    headers: {
      Authorization: AuthTokenService.get(),
    },
  });
};
export const updateProfileAvatar = (data) => {
  return apiClient({
    url: routes.GET_PROFILE.URL,
    method: "POST",
    data: data,
    headers: {
      "content-type": "multipart/form-data",
      Authorization: `Bearer ${AuthTokenService.get()}`,
    },
  });
};
export const getTeamUserList = () => {
  return apiClient({
    method: routes.GET_TEAM_USERS_LIST.METHOD,
    url: routes.GET_TEAM_USERS_LIST.URL,
    headers: {
      Authorization: AuthTokenService.get(),
    },
  });
};
export const getAgencyUserList = () => {
  return apiClient({
    method: routes.GET_AGENCY_USERS_LIST.METHOD,
    url: routes.GET_AGENCY_USERS_LIST.URL,
    headers: {
      Authorization: AuthTokenService.get(),
    },
  });
};
export const deletetheFlow= (props) => {

  let url = routes.UPDATE_FLOW_LIST.URL + `${props.props.id}/update_status`;
  return apiClient({
    url: url,
    method: routes.UPDATE_FLOW_LIST.METHOD,
    data: { status: props.props.status },
    headers: {
      Authorization: AuthTokenService.get(),
    },
  });
};
export const getTheFlow = (props) => {
  let url = routes.ON_GET_Flow.URL + `${props}/edit`;
  return apiClient({
    method: routes.ON_GET_Flow.METHOD,
    url: url,
    data: props,
    headers: {
      Authorization: AuthTokenService.get(),
    },
  });
};


// New function to move a flow to a new folder
// export const moveFlowToFolder = async (flowId, newFolderId) => {
//   const payload = {
//     flowId,
//     newFolderId,
//   };

//   const url = routes.MOVE_FLOW_TO_FOLDER.URL;

//   return apiClient({
//     method: routes.MOVE_FLOW_TO_FOLDER.METHOD,
//     url: url,
//     data: payload,
//     headers: {
//       Authorization: AuthTokenService.get(),
//     },
//   });
// };


// export const moveFlowToFolder = (props) => {
//   let url = routes.MOVE_FLOW_TO_FOLDER.URL + props.folderId + "/assign";

//   return apiClient({
//     url: url,
//     data: {
//       konnects: props.selectedKonnects.toString(),
//     },
//     method: routes.MOVE_FLOW_TO_FOLDER.METHOD,
//     headers: {
//       Authorization: AuthTokenService.get(),
//     },
//   });
// };


////// For Custom Input Configs

// export const getAppEventConfigDetailCust = (body) => {
//   const {
//     data,
//     config_key = "",
//     input,
//     port: eventConfigId = "",
//     prevSequence = null,
//     eventSequence,
//   } = body;
//   const { id, appEvent, appEventSequences, selectedAccount } = data;
//   let source = false;
//   let url =
//     routes.GET_APP_EVENT_CONFIGS_DETAILS.URL +
//     `${id}/app_events/${appEvent}/event_config/${source ? "left" : "right"}/${
//       eventConfigId + 1
//     }/details?`;

//   let params = "";

//   if (data.appEventSequences) {
//     data.appEventSequences.map((x) => {
//       let ind = x.config_key.indexOf(">");
//       params += `&${x.config_key}=${x.id !== "" ? x.id : input}`;
//     });
//   }

//   if (prevSequence) {
//     url = `${url}${prevSequence.config_key}=${prevSequence.id}${params}`;
//   }
//   if (selectedAccount.id)
//     url += `${params}&app_account_id=${selectedAccount.id}`;

//   return apiClient({
//     method: routes.GET_APP_EVENT_CONFIGS_DETAILS.METHOD,
//     url: url,

//     headers: {
//       Authorization: AuthTokenService.get(),
//     },
//   });
// };

// export const getAppEventConfigDetailfetchuserDefined = (props) => {
//   const {
//     data,
//     nodeId,
//     appId,
//     eventId,

//     selectedEventConfigId,
//     selectedConfigKey,
//     app_account_id,
//     input,
//     nodes,
//   } = props;
//   const nodeIdx = nodes.findIndex((x) => x.id === data.nodeId);
//   let source = nodeIdx === 0;
//   let params = "";
//   if (
//     data.appEventSequences //&& data.provider !=="crove_new"
//   ) {
//     data.appEventSequences.map((x) => {
//       if (x.config_key !== "sheet_id" && x.id !== "")
//         params += `&${x.config_key}=${x.id}`;
//     });
//   }

//   if (selectedConfigKey) {
//     params = `?${selectedConfigKey.slice(
//       0,
//       selectedConfigKey.indexOf(">")
//     )}=${selectedEventConfigId}${params}`;
//   }

//   let url =
//     routes.GET_APP_EVENT_CONFIGS_DETAILS_FETCH.URL +
//     `${appId}/app_events/${eventId}/event_config/${
//       source ? "left" : "right"
//     }/${selectedEventConfigId}/fetch-fields`;

//   url += `${params}`;

//   if (app_account_id) url += `&app_account_id=${app_account_id}`;
//   return apiClient({
//     method: routes.GET_APP_EVENT_CONFIGS_DETAILS_FETCH.METHOD,
//     url: url,
//     headers: {
//       Authorization: AuthTokenService.get(),
//     },
//   });
// };

// export const getAppEventConfigDetailCustomKmap = (payload) => {
//   const {
//     data,
//     app,
//     appEvent,
//     node,
//     eventConfigId,
//     app_account_id,
//     targetPortInfo,
//     editorState,
//   } = payload;

//   const { nodes } = editorState;

//   const { config_key, id, key_value_type, label, type } = targetPortInfo;
//   const Node = nodes.find((n) => n.id === data.nodeId);
//   const port = data.configResponses.find(
//     (d) => d.config_key === config_key
//   ).portId;
//   let prevSequence = false;
//   let source = false;

//   let url =
//     routes.GET_APP_EVENT_CONFIGS.URL +
//     `${app}/app_events/${appEvent}/event_config/${
//       source ? "left" : "right"
//     }/${`${Number(port) + 1}`}/details?`;

//   let params = "";

//   if (
//     data.configResponses.filter((d) => d.config_key === config_key)[0].value
//   ) {
//     data.appEventSequences.filter(
//       (d) => d.config_key === config_key.slice(0, config_key.indexOf(">"))
//     )[0].sequence.id = data.configResponses.filter(
//       (d) => d.config_key === config_key
//     )[0].value;
//     data.appEventSequences.filter(
//       (d) => d.config_key === config_key.slice(0, config_key.indexOf(">"))
//     )[0].id = data.configResponses.filter(
//       (d) => d.config_key === config_key
//     )[0].value;
//   }
//   if (data.appEventSequences) {
//     data.appEventSequences.map((x) => {
//       let ind = x.config_key.indexOf(">");
//       params += `&${x.config_key}=${x.id !== "" ? x.id : eventConfigId}`;
//     });
//   }
//   if (prevSequence) {
//     url = `${url}${prevSequence.config_key}=${prevSequence.id}${params}`;
//   }

//   // url+=params&params

//   if (app_account_id) url += `${params}&app_account_id=${app_account_id}`;

//   return apiClient({
//     url: url,
//     data: { ...payload },
//     method: routes.GET_APP_EVENT_CONFIGS.METHOD,
//     headers: {
//       Authorization: AuthTokenService.get(),
//     },
//   });
// };

// export const getAppEventConfigDetailFetchKMap = (props) => {
//   const {
//     data,
//     nodeId,
//     appId,
//     eventId,
//     selectedEventConfigId,
//     app_account_id,
//     editorState,
//   } = props;
//   const { nodes, links } = editorState;
//   const nodeIdx = nodes.findIndex((x) => x.id === data.nodeId);
//   let source = nodeIdx === 0;
//   let params = "";
//   if (data.appEventSequences) {
//     data.appEventSequences.map((x) => {
//       if (x.config_key !== "sheet_id" && x.id !== "")
//         params += `&${x.config_key}=${x.id}`;
//     });
//   }

//   let selectedConfigKey =
//     data.appEventSequences[data.eventSequence - 1].config_key;

//   if (selectedConfigKey) {
//     params = `?${selectedConfigKey}=${selectedEventConfigId}${params}`;
//   }

//   let url =
//     routes.GET_APP_EVENT_CONFIGS_DETAILS_FETCH.URL +
//     `${appId}/app_events/${eventId}/event_config/${
//       source ? "left" : "right"
//     }/${selectedEventConfigId}/fetch-fields`;

//   url += `${params}`;

//   if (app_account_id) url += `&app_account_id=${app_account_id}`;

//   return apiClient({
//     method: routes.GET_APP_EVENT_CONFIGS_DETAILS_FETCH.METHOD,
//     url: url,
//     headers: {
//       Authorization: AuthTokenService.get(),
//     },
//   });
// };
