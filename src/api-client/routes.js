export const routes = {


  // GET_WIDGETS_ACTIVE: {
  //   URL: "/api/v1/ai",
  //   METHOD: "GET",
  // },
  // GET_WIDGETS_ACTIVE: {
  //   URL: "/api/v1/chatflows",
  //   METHOD: "GET",
  // },
  // GET_WIDGETS_ACTIVE: {
  //   URL: "/api/v1/agentflows",
  //   METHOD: "GET",
  // },
  // GET_WIDGETS_ACTIVE: {
  //   URL: "/api/v1/tools",
  //   METHOD: "GET",
  // },

  GET_AI: {
    URL: "/api/v1/ai",
    METHOD: "GET",
  },
  GET_CHATFLOWS: {
    URL: "/api/v1/chatflows",
    METHOD: "GET",
  },
  GET_AGENTFLOWS: {
    URL: "/api/v1/agentflows",
    METHOD: "GET",
  },
  GET_TOOLS: {
    URL: "/api/v1/tools",
    METHOD: "GET",
  },
  //   -----------------------Login + Signup--------------------------
  USER_LOGIN: {
    URL: "/api/v1/auth/login",
    METHOD: "POST",
  },
  USER_SIGNUP: {
    URL: "/api/v1/signup",
    METHOD: "POST",
  },
  USER_EXISTS: {
    URL: "/api/v1/users/user_exists",
    METHOD: "POST",
  },
  VERIFY_EMAIL: {
    URL: "api/v1/users/email_confirmation",
    METHOD: "POST",
  },
  UPDATE_USER: {
    URL: "api/v1/users/update_user",
    METHOD: "POST",
  },
  GET_FORGOT_PASSWORD_LINK: {
    URL: "api/v1/users/reset_password_email",
    METHOD: "POST",
  },
  RESET_PASSWORD: {
    URL: "api/v1/users/update_user_password",
    METHOD: "POST",
  },

  //   -----------------------dashboard--------------------------
  GET_WIDGETS_ACTIVE: {
    URL: "/api/v1/widgets/active",
    METHOD: "GET",
  },
  GET_WIDGETS_DETAILS: {
    URL: `api/v1/widgets/details/`,
    METHOD: "GET",
  },
  UPDATE_APP_STATUS: {
    URL: "api/v1/konnects/",
    METHOD: "POST",
  },
  GET_FOLDERS_LIST: {
    URL: "api/v1/folders/list",
    METHOD: "GET",
  },
  GET_FOLDER_KONNECTS: {
    URL: "api/v1/folders/",
    METHOD: "GET",
  },
  CREATE_FOLDER: {
    URL: "api/v1/folders/add",
    METHOD: "POST",
  },
  MOVE_KONNECTS_TO_FOLDER: {
    URL: "api/v1/folders/",
    METHOD: "POST",
  },
  RENAME_FOLDER: {
    URL: "api/v1/folders/",
    METHOD: "PUT",
  },
  DELETE_FOLDER: {
    URL: "api/v1/folders/",
    METHOD: "GET",
  },
  GET_KONNECTS_LIST: {
    URL: "api/v1/konnects",
    METHOD: "GET",
  },
  GET_AUTH_URL: {
    URL: "api/v1/auth-url",
    METHOD: "POST",
  },
  SAVE_AUTH: {
    URL: "api/v1/authorization",
    METHOD: "POST",
  },
  GET_APP_DETAILS: {
    URL: "api/v1/apps/",
    METHOD: "GET",
  },
  UPDATE_APP_STATUS_USER: {
    URL: "api/v1/app_users",
    METHOD: "POST",
  },
  SAVE_LABEL: {
    URL: "api/v1/app_users",
    METHOD: "POST",
  },
  GET_ALL_APPS: {
    //URL: "api/v1/apps",
    URL: "api/v1/apps/get_allapps",
    METHOD: "GET",
  },

  //   -----------------------history--------------------------
  GET_TASK_LOGS: {
    URL: "api/v1/task_logs/konnects",
    METHOD: "GET",
  },
  SEARCH_TASK_LOGS: {
    URL: "api/v1/task_logs/search_konnects",
    METHOD: "GET",
  },
  GET_LOGS: {
    URL: "api/v1/task_logs/logs",
    METHOD: "GET",
  },
  GET_TASK_DETAILS: {
    URL: "api/v1/task_logs/",
    METHOD: "GET",
  },
  GET_APPS: {
    URL: "api/v1/apps",
    METHOD: "GET",
  },
  GET_TRIGGERS: {
    URL: "api/v1/apps/get_triggers",
    METHOD: "GET",
  },
  GET_ALL_APPS: {
     URL: "api/v1/apps/get_allapps",
    //URL: "api/v1/apps",
    METHOD: "GET",
  },
  GET_ACTIONS: {
    URL: "api/v1/apps/get_actions",
    METHOD: "GET",
  },
  GET_ADD_ON_APPS: {
    URL: "api/v1/apps/add_on_apps",
    METHOD: "GET",
  },

  //   -----------------------Canvas--------------------------
  GET_APP_EVENTS: {
    URL: `api/v1/apps`,
    METHOD: "GET",
  },
  GET_LINKED_ACCOUNTS: {
    URL: "api/v1/apps",
    METHOD: "GET",
  },
  CAPTURE_WEBHOOK_RESPONSE: {
    URL: `api/v1/konnect_webhooks/capture_webhook_response/`,
    METHOD: "POST",
  },
  GET_APP_EVENT_CONFIGS: {
    URL: `api/v1/apps/`,
    METHOD: "GET",
  },
  ON_NODE_DELETE: {
    URL: `api/v1//konnects/delete_activity`,
    METHOD: "POST",
  },
  TEST_AND_REVIEW: {
    URL: `api/v1/konnects/test_and_review`,
    METHOD: "POST",
  },
  GET_APP_EVENT_CONFIGS_DETAILS: {
    URL: `api/v1/apps/`,
    METHOD: "GET",
  },
  GET_APP_EVENT_CONFIGS_DETAILS_FETCH: {
    URL: `api/v1/apps/`,
    METHOD: "GET",
  },
  SAVE_KONNECT: {
    URL: "api/v1/konnects/save_konnect",
    METHOD: "POST",
  },
  PUBLISH_KONNECT: {
    URL: "api/v1/konnects/publish_konnect",
    METHOD: "POST",
  },

  GET_PROFILE: {
    URL: "api/v1/users/profile",
    METHOD: "GET",
  },
  UPDATE_PASSWORD: {
    URL: "api/v1/users/change_password",
    METHOD: "POST",
  },
  //   -----------------------Account--------------------------
  GET_AGENCY_USERS_LIST: {
    URL: "api/v1/users/list_agency_users",
    METHOD: "GET",
  },
  ADD_AGENCY_MEMBER: {
    URL: "api/v1/users/add_agency_user",
    METHOD: "POST",
  },
  UPDATE_AGENCY_MEMBER: {
    URL: "api/v1/users/update_agency_user",
    METHOD: "POST",
  },
  DELETE_AGENCY_MEMBER: {
    URL: "api/v1/users/remove_agency_user?sub_account_id=",
    METHOD: "GET",
  },

  GET_RESELLER_USERS_LIST: {
    URL: "api/v1/users/list_reseller_users",
    METHOD: "GET",
  },
  ADD_RESELLER_MEMBER: {
    URL: "api/v1/users/add_reseller_user",
    METHOD: "POST",
  },
  UPDATE_RESELLER_MEMBER: {
    URL: "api/v1/users/update_reseller_user",
    METHOD: "POST",
  },
  DELETE_RESELLER_MEMBER: {
    URL: "api/v1/users/remove_reseller_user?sub_account_id=",
    METHOD: "GET",
  },

  GET_TEAM_USERS_LIST: {
    URL: "api/v1/users/list_team_users",
    METHOD: "GET",
  },
  ADD_TEAM_MEMBER: {
    URL: "api/v1/users/add_team_user",
    METHOD: "POST",
  },
  UPDATE_TEAM_MEMBER: {
    URL: "api/v1/users/update_team_user",
    METHOD: "POST",
  },
  DELETE_TEAM_MEMBER: {
    URL: "api/v1/users/remove_team_user?sub_account_id=",
    METHOD: "GET",
  },
  UPDATE_FLOW_LIST: {
    URL: `api/v1/konnects/`,
    METHOD: "POST",
  },
  ON_GET_Flow:{
    URL: `api/v1/konnects/`,
    METHOD: "GET",
  },
    MOVE_FLOW_TO_FOLDER: {
      URL: "api/v1/folders/",
      METHOD: "POST",
  }
};
