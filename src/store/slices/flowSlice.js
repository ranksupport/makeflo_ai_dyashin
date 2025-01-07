import { createSlice, current } from "@reduxjs/toolkit";
import { applyEdgeChanges, applyNodeChanges } from "reactflow";
import { nanoid } from "@reduxjs/toolkit";
import {
  captureWebHookResponse,
  get_Events,
  get_accounts,
  get_app_event_config_detail,
  get_app_configs,
  get_app_event_config_detail_fetch,
  onTest,
  getFlow,
} from "../thunk/flowThunk";
import { FlattenJSON } from "../../commonFunctions";
import { isEqual } from "lodash";

const GenerateCoupon = {
  expiryNum: "",
  duration: [
    { id: 1, name: "Days", label: "Days", selected: true, value: 1 },
    { id: 2, name: "Week", label: "Week", selected: false, value: 2 },
    { id: 3, name: "Months", label: "Months", selected: false, value: 3 },
    { id: 4, name: "Years", label: "Years", selected: false, value: 4 },
  ],
};
const SplitText = {
  segmentIndex: [
    { id: 1, name: "First", label: "First", selected: true, value: 1 },
    { id: 2, name: "Second", label: "Second", selected: false, value: 2 },
    { id: 3, name: "Last", label: "Last", selected: false, value: 3 },
    {
      id: 4,
      name: "Second to Last",
      label: "Second to Last",
      selected: false,
      value: 4,
    },
    { id: 5, name: "All", label: "All", selected: false, value: 5 },
  ],
};

const initialState = {
  user: null,
  forgotApiError: false,
  loading: false,
  verifyLoading: true,
  trashNodes: [],
  inHouseAppConfig: {
    coupon: GenerateCoupon,
    Splitter: SplitText,
  },
  triggerPopUp: false,
  flowState: {
    apps: [],
    links: [],
    dataForSelect: [],
    flowName: "",
  },
  triggerSearch: false,
  canPublish: false,
  canSave: false,
  isOnEditMode: false,
  history: {
    past: [],
    future: [],
    present: {
      apps: [],
      links: [],
    },
  },
};

const appType = ({ element, length }) => {
  let NodeType;
  switch (element.app_type.toLowerCase()) {
    case "webhook":
      NodeType = "WebhookInner";
      break;
    case "api":
      if (length > 0) {
        NodeType = "ActionNode";
      } else NodeType = "TriggerNode";
      break;
    case "add_on":
      switch (element.provider.toLowerCase()) {
        case "textformatter":
          NodeType = "Formatter";
          break;
        case "iterator":
          NodeType = "InHouse";
          break;
        case "converter":
          NodeType = "Formatter";
          break;
        case "numberformatter":
          NodeType = "Formatter";
          break;
        case "dateformatter":
          NodeType = "Formatter";
          break;
        case "generator":
          NodeType = "Generator";
          break;
        case "conditioner":
          NodeType = "Filter";
          break;
        case "api":
          NodeType = "Api";
          break;
        case "scheduler":
          NodeType = "Scheduler";
          break;
        case "textsplitter":
          NodeType = "InHouse";
          break;
        default:
          NodeType = "InHouse";
      }
      break;
    case "webhook_api":
      if (length > 0) {
        NodeType = "ActionNode";
      } else NodeType = "WebhookInner";
      break;
  }
  return NodeType;
};

export const flowSlice = createSlice({
  name: "canvas",
  initialState,
  reducers: {
    setFlowName: (state, action) => {
      state.flowState.flowName = action.payload;
    },
    resetCanvas: (state, action) => {
      state.flowState = initialState.flowState;
      state.triggerSearch = false;
    },
    onSelectTrigger: (state, action) => {
      const node = {
        id: action.payload.node_id,
        position: { x: action.payload.posX, y: action.payload.posY },
        type: appType({
          element: action.payload.app_detail,
          length: state.flowState.apps.length,
        }),
        data: {
          app_detail: {
            ...action.payload.app_detail,
            app_index: 1,
          },
          app_info: {},
          dataForSelect: [],
          providerApps: [],
          node_id: action.payload.node_id,
          app_status: {
            type: "Draft",
            account_drawer: false,
            collapseEventAccount: false,
            collapseConfiguration: false,
            app_index: 0,
            showResponse: false,
          },
        },
        draggable: true,
        dragHandle: "#drag",
      };
      if (action.payload.app_detail.app_type !== "ADD_ON" && action.payload.app_detail.app_type !== "WEBHOOK") {
        node.data.app_status.hasTimer = true;
      }
      state.flowState.apps.push(node);

      let currentStaus = {
        apps: state.flowState.apps,
        links: state.flowState.links,
      };
      {
        const previousState = state.history.present;

        if (previousState && !isEqual(previousState, currentStaus)) {
          state.history.past.push(state.history.present);
          state.history.present = currentStaus;
          state.history.future = [];
        }
      }
    },
    toggleBasicAuth: (state, action) => {
      const appNode = state.flowState.apps.find(
        (app) => app.data.node_id === action.payload.node_id
      );
      const basic_auth = {
        status: action.payload.enabled,
        apiKey: "",
        apiSecret: "",
      };
      appNode.data = { ...appNode.data, basic_auth };
    },
    setBasicAuthCredential: (state, action) => {
      const appNode = state.flowState.apps.find(
        (app) => app.data.node_id === action.payload.node_id
      );
      appNode.data.basic_auth[action.payload.id] = action.payload.value;
    },
    setAppStatus: (state, action) => {
      const appNode = state.flowState.apps.find(
        (app) => app.data.node_id === action.payload.node_id
      );
      if (appNode) {
        appNode.data.app_status.type = action.payload.status;
      }
    },
    onDeselectTrigger: (state, action) => {
      if (state.flowState.apps.length > 1) {
        action.payload.toast({
          position: "top",
          status: "warning",
          variant: "solid",
          title: "Can not be move backward as Action app exists",
          duration: 2500,
          containerStyle: {
            fontWeight: 400,
          },
        });
      } else if (state.flowState.apps.length == 1) {
        state.flowState.apps = [];
        state.triggerSearch = true;
      }
      let currentStaus = {
        apps: state.flowState.apps,
        links: state.flowState.links,
      };
      {
        const previousState = state.history.present;

        if (previousState && !isEqual(previousState, currentStaus)) {
          state.history.past.push(state.history.present);
          state.history.present = currentStaus;
        }
      }
    },
    resetNode: (state, action) => {
      const appNode = state.flowState.apps.find(
        (app) => app.data.node_id === action.payload
      );
      appNode.data = {
        node_id: appNode.data.node_id,
        providerApps: [],
        app_status: {
          type: "Draft",
          account_drawer: false,
          collapseEventAccount: false,
        },
        dataForSelect: appNode.data.dataForSelect.filter(
          (opt) => opt.nodeId !== action.payload
        ),
        app_detail: appNode.data.app_detail,
        trigger_konnect_id: appNode.data.trigger_konnect_id
          ? appNode.data.trigger_konnect_id
          : null,
        app_info: appNode.data.app_info,
        konnect_activity_id:
          appNode.data.konnect_activity_id >= 0
            ? appNode.data.konnect_activity_id
            : null,
        konnect_id: appNode.data.konnect_id ? appNode.data.konnect_id : null,
      };
      state.flowState.dataForSelect = state.flowState.dataForSelect.filter(
        (opt) => opt.nodeId !== action.payload
      );
      state.flowState.apps = state.flowState.apps.map((app, i) => {
        if (app.data.node_id !== action.payload && i !== 0) {
          return {
            ...app,
            data: {
              ...app.data,
              dataForSelect: state.flowState.dataForSelect.filter(
                (opt) => opt.nodeId !== action.payload
              ),
            },
          };
        } else return app;
      });

      if (
        appNode.data.app_detail.app_type === "ADD_ON" &&
        appNode.data.app_detail.provider.toLowerCase() === "textsplitter"
      ) {
        appNode.data.inHouseAppConfig = state.inHouseAppConfig;
        appNode.data.app_status.hasSequence = true;
        appNode.data.app_status.fetchFieldStatus = false;
      }
      if (
        appNode.data.app_detail.app_type === "ADD_ON" &&
        appNode.data.app_detail.provider.toLowerCase() === "data_forwarder"
      ) {
        appNode.data.keyList = [{ key: "" }]; 
      }

      if (
        appNode.data.app_detail.app_type === "ADD_ON" &&
        appNode.data.app_detail.provider.toLowerCase() === "conditioner"
      ) {
        appNode.data.app_status.type = "Draft";
        appNode.data.filterValues = [
          { id: nanoid(), field: "", operator: "", value: "" },
        ];
        let id = nanoid();
        appNode.data.configResponses = [
          {
            app_id: appNode.data.app_detail.id,
            config_key: "Filter_value",
            config_key_required: false,
            id: "Filter_value",
            label: "Filter Condition",
            sequence: 0,

            port: {
              id: id,
              source: id + "|" + "source",
              target: id + "|" + "target",
              nodeId: appNode.data.node_id,
            },
          },
        ];
      }

      if (
        appNode.data.app_detail.app_type === "ADD_ON" &&
        appNode.data.app_detail.provider.toLowerCase() === "generator"
      ) {
        appNode.data.inHouseAppConfig = state.inHouseAppConfig;
      }
      if (
        appNode.data.app_detail.app_type === "ADD_ON" &&
        appNode.data.app_detail.provider.toLowerCase().includes("formatter")
      ) {
        appNode.data.options = state.flowState.dataForSelect.map((data) => {
          if (data.nodeId !== appNode.data.node_id) {
            return data.options;
          }
        });

        appNode.data.app_status.hasSequence = true;
        appNode.data.app_status.fetchFieldStatus = false;
      }

      let currentStaus = {
        apps: state.flowState.apps,
        links: state.flowState.links,
      };
      {
        const previousState = state.history.present;

        if (previousState && !isEqual(previousState, currentStaus)) {
          state.history.past.push(state.history.present);
          state.history.present = currentStaus;
        }
      }
    },
    onDelete: (state, action) => {
      let appNode = state.flowState.apps.find(
        (app) => app.data.node_id === action.payload.node_id
      );
      const { data: app, ...rest } = appNode;
      if (app.app_detail.app_index === 1 && state.flowState.apps.length > 1) {
        action.payload.toast({
          position: "top",
          status: "warning",
          variant: "solid",
          title: "Trigger cannot be deleted when an action app is present.",
          duration: 2500,
          containerStyle: {
            fontWeight: 400,
          },
        });
        return;
      } else {
        state.flowState.apps = state.flowState.apps.filter(
          (app) => app.data.node_id !== action.payload.node_id
        );
        if (app.app_status.flowReady === true) {
          state.trashNodes = [...state.trashNodes, appNode];
        }
      }
      let currentStaus = {
        apps: state.flowState.apps,
        links: state.flowState.links,
      };
      {
        const previousState = state.history.present;

        if (previousState && !isEqual(previousState, currentStaus)) {
          state.history.past.push(state.history.present);
          state.history.present = currentStaus;
        }
      }
    },

    onSelectAction: (state, action) => {
      if (
        action.payload.app_detail.provider.toLowerCase() === "iterator" &&
        state.flowState.apps.some(
          (node) => node.data.app_detail.provider === "iterator"
        )
      ) {
        action.payload.toast({
          position: "top",
          status: "warning",
          variant: "solid",
          title: "The iterator can only be used once.",
          duration: 2500,
          containerStyle: {
            fontWeight: 400,
          },
        });
        return;
      } else {
        const lastNode = state.flowState.apps[state.flowState.apps.length - 1];
        const node = {
          id: action.payload.node_id,
          position: {
            x: lastNode.position.x + lastNode.width + 150,
            y: lastNode.position.y,
          },
          type: appType({
            element: action.payload.app_detail,
            length: state.flowState.apps.length,
          }),
          data: {
            app_detail: {
              ...action.payload.app_detail,
              app_index: state.flowState.apps.length + 1,
            },
            app_info: {},
            providerApps: [],
            node_id: action.payload.node_id,
            app_status: {
              type: "Loading",
              account_drawer: false,
              collapseEventAccount:
                action.payload.app_detail.provider.toLowerCase() !== "webhook"
                  ? false
                  : true,
              collapseConfiguration: false,
              showResponse: false,
            },
          },
          draggable: true,
          dragHandle: "#drag",
        };
        node.data.dataForSelect = state.flowState.dataForSelect;
        if (action.payload.app_detail.app_type !== "ADD_ON" && action.payload.app_detail.app_type !== "WEBHOOK") {
          node.data.app_status.hasTimer = true;
        }
        if (
          action.payload.app_detail.app_type === "ADD_ON" &&
          action.payload.app_detail.provider.toLowerCase() === "textsplitter"
        ) {
          node.data.inHouseAppConfig = state.inHouseAppConfig;
          node.data.app_status.hasSequence = true;
          node.data.app_status.fetchFieldStatus = false;
        }
        if (
          action.payload.app_detail.app_type === "ADD_ON" &&
          action.payload.app_detail.provider.toLowerCase() === "data_forwarder"
        ) {
          node.data.keyList = [{ key: "" }];
        }

        if (
          action.payload.app_detail.app_type === "ADD_ON" &&
          action.payload.app_detail.provider.toLowerCase() === "conditioner"
        ) {
          node.data.app_status.type = "Draft";
          node.data.filterValues = [
            { id: nanoid(), field: "", operator: "", value: "" },
          ];
          let id = nanoid();
          node.data.configResponses = [
            {
              app_id: action.payload.app_detail.id,
              config_key: "Filter_value",
              config_key_required: false,
              id: "Filter_value",
              label: "Filter Condition",
              sequence: 0,

              port: {
                id: id,
                source: id + "|" + "source",
                target: id + "|" + "target",
                nodeId: node.data.node_id,
              },
            },
          ];
        }

        if (
          action.payload.app_detail.app_type === "ADD_ON" &&
          action.payload.app_detail.provider.toLowerCase() === "generator"
        ) {
          node.data.inHouseAppConfig = state.inHouseAppConfig;
        }
        if (
          action.payload.app_detail.app_type === "ADD_ON" &&
          action.payload.app_detail.provider.toLowerCase().includes("formatter")
        ) {
          node.data.options = state.flowState.dataForSelect.map((data) => {
            if (data.nodeId !== node.data.node_id) {
              return data.options;
            }
          });

          node.data.app_status.hasSequence = true;
          node.data.app_status.fetchFieldStatus = false;
        }
        let currentStaus = {
          apps: state.flowState.apps,
          links: state.flowState.links,
        };
        {
          const previousState = state.history.present;

          if (previousState && !isEqual(previousState, currentStaus)) {
            state.history.past.push(state.history.present);
            state.history.present = currentStaus;
          }
        }
        state.flowState.apps.push(node);
      }
    },
    onCollapseEventAcount: (state, action) => {
      const appNode = state.flowState.apps.find(
        (app) => app.data.node_id === action.payload.node_id
      );
      appNode.data.app_status.collapseEventAccount = action.payload.status;
    },
    onCollapseEventConfig: (state, action) => {
      const appNode = state.flowState.apps.find(
        (app) => app.data.node_id === action.payload.node_id
      );
      appNode.data.app_status.collapseConfiguration = action.payload.status;
    },
    onAccountDraw: (state, action) => {
      const appNode = state.flowState.apps.find(
        (app) => app.data.node_id === action.payload.node_id
      );
      appNode.data.app_status.account_drawer = action.payload.status;
    },
    onStatusChange: (state, action) => {
      const appNode = state.flowState.apps.find(
        (app) => app.data.node_id === action.payload.node_id
      );
      appNode.data.app_status.type = action.payload.status;
    },
    onTriggerSearch: (state, action) => {
      state.triggerSearch = true;
    },
    onNodesChange: (state, action) => {
      state.flowState.apps = applyNodeChanges(
        action.payload,
        state.flowState.apps
      );
    },
    onEdgesChange: (state, action) => {
      state.flowState.links = applyEdgeChanges(
        action.payload,
        state.flowState.links
      );
    },

    setSelectedEvent: (state, action) => {
      const appNode = state.flowState.apps.find(
        (app) => app.data.node_id === action.payload.nodeId
      );
      if (
        appNode.data.selectedEvent &&
        appNode.data.selectedEvent.id === action.payload.value.id
      ) {
        return;
      } else {
        appNode.data.selectedEvent = action.payload.value;
        appNode.data.appEvent = action.payload.value.id;
        delete appNode.data.additionalResponses;
        appNode.data.app_info.app_Event_Configurations = [];
        delete appNode.data.app_status.hasSequence;
        let unique_port = nanoid();
        if (appNode.data.app_detail.provider == "api") {
          appNode.data.configResponses = [
            {
              id: "endpointURL",
              app_id: appNode.data.app_detail.id,
              app_event_id: appNode.data.selectedEvent.id,
              config_key: "endpointURL",
              config_key_required: true,
              label: "Endpoint URL",
              side: "right",
              key_value_type: "input",
              fetch_fields: false,

              uiKey: unique_port,
              nodeId: appNode.id,
              port: {
                id: unique_port,
                source: unique_port + "|source",
                target: unique_port + "|target",
                nodeId: appNode.id,
              },
              visible: true,
            },
          ];
          appNode.data.selectedValue = {
            payload_type: null,
            wrap_in_array: null,
            apiDetails: {
              wrapRequestInArray: [
                { id: 1, value: 1, label: "NO", name: "NO", selected: false },
                { id: 2, value: 2, label: "NO", name: "YES", selected: false },
              ],
              payloadType: [
                {
                  id: 1,
                  name: "JSON",
                  selected: false,
                  label: "JSON",
                  value: 1,
                },
              ],
              headers: [
                {
                  key: "",
                },
              ],
              params: [
                {
                  key: "",
                },
              ],
              endpointURL: {
                type: "",
                value: "",
                konnect_activity_id: "",
              },
            },
          };
        }
        if (appNode.data.app_detail.name === "Scheduler") {
          delete appNode.data.selectedValue;
          switch (action.payload.value.name) {
            case "Days of the week":
              appNode.data.selectedValue = {
                schedule_type: "DaysOfTheWeek",
                days: "",
                schedule_time: "",
                localData: {
                  time: "",
                  days: [],
                },
              };
              break;
            case "Days of the month":
              appNode.data.selectedValue = {
                schedule_type: "DaysOfTheMonth",
                dates: "",
                schedule_time: "",
                localData: {
                  time: "",
                  dates: [],
                },
              };
              break;
            case "At regular intervals":
              appNode.data.selectedValue = {
                time_span: "",
                schedule_type: "AtRegularIntervals",
                every: "",
                interval: "",
                schedule_time: "",
                days: null,
                time: "",
                localData: {
                  every: "",
                  dates: [],
                  days: [],
                  timespan: "",
                  time: "",
                },
              };
          }
        }
      }
      let currentStaus = {
        apps: state.flowState.apps,
        links: state.flowState.links,
      };
      {
        const previousState = state.history.present;

        if (previousState && !isEqual(previousState, currentStaus)) {
          state.history.past.push(state.history.present);
          state.history.present = currentStaus;
        }
      }
    },
    setLinkedAccount: (state, action) => {
      const appNode = state.flowState.apps.find(
        (app) => app.data.node_id === action.payload.nodeId
      );
      if (
        appNode.data.selectedAccount &&
        appNode.data.selectedAccount.id === action.payload.value.id
      ) {
        return;
      } else {
        delete appNode.data.additionalResponses;
        appNode.data.selectedAccount = action.payload.value;
        delete appNode.data.app_info.app_Event_Configurations;
        delete appNode.data.app_status.hasSequence;
        appNode.data.configResponses = [];
      }
      let currentStaus = {
        apps: state.flowState.apps,
        links: state.flowState.links,
      };
      {
        const previousState = state.history.present;

        if (previousState && !isEqual(previousState, currentStaus)) {
          state.history.past.push(state.history.present);
          state.history.present = currentStaus;
        }
      }
    },

    setEventsConfig: (state, action) => {
      const { selectedValue, selectedConfig, nodeId } = action.payload;
      const node = state.flowState.apps.find((x) => x.data.node_id === nodeId);

      delete node.data.additionalResponses;
      const eventConfig = node.data.app_info.app_Event_Configurations?.find(
        (con) => con.sequence === selectedConfig.sequence
      );

      let selected = { ...eventConfig.selected, ...selectedValue };

      node.data.app_info.app_Event_Configurations =
        node.data.app_info.app_Event_Configurations.map((config) => {
          if (eventConfig.sequence < config.sequence) {
            const { selected, config_details, custom_field, ...rest } = config;
            return rest;
          } else if (eventConfig.sequence === config.sequence) {
            return {
              ...eventConfig,
              selected: selected,
            };
          } else return config;
        });

      if (node.data.app_detail.provider.toLowerCase() === "datetime") {
        node.data.app_status.showTestButton = true;
      }
      let currentStaus = {
        apps: state.flowState.apps,
        links: state.flowState.links,
      };
      {
        const previousState = state.history.present;

        if (previousState && !isEqual(previousState, currentStaus)) {
          state.history.past.push(state.history.present);
          state.history.present = currentStaus;
        }
      }
    },
    onTextInputChange: (state, action) => {
      const { value, config } = action.payload;
      const node = state.flowState.apps.find(
        (node) => node.data.node_id === config.nodeId
      );

      let configOfNodeToBeChanged = node.data.configResponses.find(
        (configs) => configs.uiKey === config.uiKey
      );
      let linksFromLeft = state.flowState.links.find(
        (link) => link.targetHandle === configOfNodeToBeChanged.port.target
      );

      if (linksFromLeft) {
        let numberOfLinks = state.flowState.links.filter(
          (link) => link.sourceHandle === linksFromLeft.sourceHandle
        )?.length;
        let sourceNode = state.flowState.apps
          .find((node) => node.data.node_id === linksFromLeft.source)
          ?.data.configResponses.find(
            (c) => c.port.source === linksFromLeft.sourceHandle
          );
        if (sourceNode && numberOfLinks == 1) {
          sourceNode.sourceLinked = false;
        }
      }

      state.flowState.links = state.flowState.links.filter(
        (link) => link.targetHandle !== configOfNodeToBeChanged.port.target
      );
      configOfNodeToBeChanged.targetLinked = false;
      configOfNodeToBeChanged.value = {
        value: value.value,
        label: value.value,
        id: value.value,
      };
      configOfNodeToBeChanged.valueForTest = {
        type: "user-defined",
        value: value.value,
      };
      if (
        node.data.app_detail.app_type === "ADD_ON" &&
        node.data.app_detail.provider.toLowerCase() === "api" &&
        config.config_key === "endpointURL"
      ) {
        node.data.selectedValue.apiDetails.endpointURL = {
          type: "user-defined",
          value: value.value,
        };
      }

      let currentStaus = {
        apps: state.flowState.apps,
        links: state.flowState.links,
      };
      {
        const previousState = state.history.present;

        if (previousState && !isEqual(previousState, currentStaus)) {
          state.history.past.push(state.history.present);
          state.history.present = currentStaus;
        }
      }
    },

    onSelectedValue: (state, action) => {
      const { value, config } = action.payload;
      const node = state.flowState.apps.find(
        (node) => node.data.node_id === config.nodeId
      );
      let thisNodeExistAsSource = state.flowState.links.some(
        (link) => link.source === node.id && link.target === value.nodeId
      );
      if (thisNodeExistAsSource === true) {
        action.payload.toast({
          position: "top",
          status: "warning",
          variant: "solid",
          title:
            "The same app cannot serve as both the source and the target for a particular app.",
          duration: 2500,
          containerStyle: {
            fontWeight: 400,
          },
        });
        return;
      }
      const configOfNodeToBeChanged = node.data.configResponses.find(
        (configs) => configs.uiKey === config.uiKey
      );

      const linksFromLeft = state.flowState.links.find(
        (link) => link.targetHandle === configOfNodeToBeChanged.port.target
      );

      if (linksFromLeft) {
        const numberOfLinks = state.flowState.links.filter(
          (link) => link.sourceHandle === linksFromLeft.sourceHandle
        )?.length;

        if (numberOfLinks === 1) {
          const sourceNode = state.flowState.apps.find(
            (node) => node.data.node_id === linksFromLeft.source
          );

          const sourceNodeConfig = sourceNode?.data.configResponses.find(
            (c) => c.port.source === linksFromLeft.sourceHandle
          );

          if (sourceNodeConfig) {
            sourceNodeConfig.sourceLinked = false;
          }
        }
      }
      if (value) {
        const sourceNode = state.flowState.apps.find(
          (node) => node.data.node_id === value.nodeId
        );

        const configOfsourceNode = sourceNode?.data.configResponses.find(
          (configs) => configs.uiKey === value.uiKey
        );
        if (configOfsourceNode) {
          configOfsourceNode.visible = true;
          configOfsourceNode.sourceLinked = true;

          const visibleConfigResponses = sourceNode.data.configResponses.filter(
            (config) => config.visible
          ).length;

          sourceNode.data.app_status.visibleConfigResponses =
            visibleConfigResponses;

          configOfNodeToBeChanged.targetLinked = true;

          if (node.data?.providerApps?.length) {
            if (sourceNode.data?.providerApps?.length) {
              node.data.providerApps = [
                ...sourceNode.data?.providerApps,
                ...node.data?.providerApps,
                sourceNode.data.node_id,
              ];
              node.data.providerApps = [...new Set(node.data.providerApps)];
            } else {
              node.data.providerApps = [
                ...node.data?.providerApps,
                sourceNode.data.node_id,
              ];
              node.data.providerApps = [...new Set(node.data.providerApps)];
            }
          } else {
            if (sourceNode.data?.providerApps?.length) {
              node.data.providerApps = [
                ...sourceNode.data?.providerApps,

                sourceNode.data.node_id,
              ];
              node.data.providerApps = [...new Set(node.data.providerApps)];
            } else {
              node.data.providerApps = [sourceNode.data.node_id];
              node.data.providerApps = [...new Set(node.data.providerApps)];
            }
          }
          if (sourceNode?.parentApps?.length) {
            configOfNodeToBeChanged.parentApp = [
              ...sourceNode.data.parentApps,
              sourceNode.data.node_id,
            ];
          } else {
            configOfNodeToBeChanged.parentApp = [sourceNode.data.node_id];
          }
          configOfNodeToBeChanged.value =
            typeof value.value === "string"
              ? { value: value.value, label: value.value, id: value.value }
              : value.value;
          configOfNodeToBeChanged.type = "map";
          configOfNodeToBeChanged.valueForTest = {
            konnect_activity_id: value.konnect_activity_id,
            type: "key-map",
            value: value.config_key,
          };

          if (
            node.data.app_detail.app_type === "ADD_ON" &&
            config.config_key === "endpointURL" &&
            node.data.app_detail.provider.toLowerCase() === "api"
          ) {
            node.data.selectedValue.apiDetails.endpointURL = {
              type: "key-map",
              value: value.config_key,
              konnect_activity_id: value.konnect_activity_id,
            };
          }

          if (
            sourceNode.data.app_detail.provider.toLowerCase() === "iterator"
          ) {
            configOfNodeToBeChanged.valueForTest.iterator = true;
            configOfNodeToBeChanged.iterator = true;
          }

          if (configOfsourceNode.iterator === true) {
            configOfNodeToBeChanged.valueForTest.iterator = true;
            configOfNodeToBeChanged.iterator = true;
          }

          state.flowState.links = state.flowState.links.filter(
            (link) => link.targetHandle !== config.port.target
          );

          state.flowState.links.push({
            id: nanoid(),
            source: sourceNode.id,
            target: node.id,
            sourceHandle: value.port.source,
            targetHandle: config.port.target,
            type: "buttonedge",
          });

          state.flowState.links = state.flowState.links.map((link) =>
            link.target === node.id ? { ...link, animated: false } : link
          );

          if (
            node.data.app_detail.app_type === "ADD_ON" &&
            node.data.app_detail.provider.toLowerCase() === "api" &&
            config.config_key === "endpointURL"
          ) {
            node.data.selectedValue.apiDetails.endpointURL = {
              type: "key-map",
              value: value.config_key,
              konnect_activity_id: value.konnect_activity_id,
            };
          }
        }
      } else {
        delete configOfNodeToBeChanged.value;
        delete configOfNodeToBeChanged.targetLinked;

        state.flowState.links = state.flowState.links.filter(
          (link) => link.targetHandle !== config.port.target
        );

        if (
          node.data.app_detail.app_type === "ADD_ON" &&
          node.data.app_detail.provider.toLowerCase() === "api"
        ) {
          node.data.selectedValue.apiDetails.endpointURL = {
            type: "",
            value: "",
            konnect_activity_id: "",
          };
        }

        state.flowState.links = state.flowState.links.map((link) =>
          link.target === node.id ? { ...link, animated: false } : link
        );
      }
      // let providerApps = state.flowState.links
      //   .filter((x) => x.target === node.data.node_id)
      //   .map((x) => {
      //     return x.source;
      //   });
      // node.data.providerApps = [...new Set(providerApps)];
      node.data.configResponses = node.data.configResponses.map((conf) => {
        let findConf = state.flowState.links.find(
          (link) => link.targetHandle === conf.port.target
        )
          ? true
          : false;
        if (findConf === true) {
          return { ...conf, configType: "map" };
        } else return conf;
      });

      const currentStatus = {
        apps: state.flowState.apps,
        links: state.flowState.links,
      };

      const previousState = state.history.present;

      if (previousState && !isEqual(previousState, currentStatus)) {
        state.history.past.push(state.history.present);
        state.history.present = currentStatus;
      }
    },
    onLinkDelete: (state, action) => {
      let link = state.flowState.links.find(
        (link) => link.id === action.payload.edge
      );
      const { target, targetHandle, source, sourceHandle } = link;

      let response = state.flowState.apps
        .find((app) => app.data.node_id === target)
        ?.data.configResponses.find((x) => x.port.target === targetHandle);

      if (response) {
        const { value, valueForTest, targetLinked, type, ...rest } = response;

        delete response.value;
        delete response.targetLinked;
        delete response.valueForTest;
        delete response.type;
      }

      let numberOfLinks = state.flowState.links.filter(
        (link) => link.sourceHandle === sourceHandle
      )?.length;
      let sourceNode = state.flowState.apps
        .find((node) => node.data.node_id === source)
        ?.data.configResponses.find((c) => c.port.source === sourceHandle);
      if (sourceNode && numberOfLinks == 1) {
        sourceNode.sourceLinked = false;
      }
      state.flowState.links = state.flowState.links.filter(
        (link) => link.id !== action.payload.edge
      );
    },
    addMoreResponses: (state, action) => {
      let node = state.flowState.apps.find(
        (app) => app.data.node_id === action.payload
      );
      if (node.data.app_status.showMoreConfig === true) {
        node.data.app_status.showMoreConfig = false;
        node.data.configResponses = node.data.configResponses.map((config) => {
          if (!config.additional) {
            return {
              ...config,
              visible: true,
            };
          } else {
            return config;
          }
        });
      } else {
        node.data.app_status.showMoreConfig = true;

        node.data.configResponses = node.data.configResponses.map((config) => {
          if (
            !config.additional &&
            (config.targetLinked || config.sourceLinked || config.value)
          ) {
            return {
              ...config,
              visible: true,
            };
          } else if (!config.additional) {
            return {
              ...config,
              visible: false,
            };
          } else {
            return config;
          }
        });
      }
      let currentStaus = {
        apps: state.flowState.apps,
        links: state.flowState.links,
      };
      {
        const previousState = state.history.present;

        if (previousState && !isEqual(previousState, currentStaus)) {
          state.history.past.push(state.history.present);
          state.history.present = currentStaus;
        }
      }
    },
    saveCouponExpNum: (state, action) => {
      let node = state.flowState.apps.find(
        (app) => app.data.node_id === action.payload.nodeId
      );
      if (node.data.app_status.flowReady === true) {
        node.data.configResponses = node.data.configResponses.filter(
          (conf) => !conf.additional
        );
        delete node.data.response_payload.raw_response;
        node.data.app_status.type = "Draft";
        delete node.data.additionalResponses;
        node.data.app_status.showResponse = false;
        delete node.data?.response_payload?.raw_response;
      }
      node.data.inHouseAppConfig.coupon.expiryNum = action.payload.value;
      let currentStaus = {
        apps: state.flowState.apps,
        links: state.flowState.links,
      };
      {
        const previousState = state.history.present;

        if (previousState && !isEqual(previousState, currentStaus)) {
          state.history.past.push(state.history.present);
          state.history.present = currentStaus;
        }
      }
    },
    saveCouponDuration: (state, action) => {
      let node = state.flowState.apps.find(
        (app) => app.data.node_id === action.payload.nodeId
      );
      if (node.data.app_status.flowReady === true) {
        node.data.configResponses = node.data.configResponses.filter(
          (conf) => !conf.additional
        );
        delete node.data.response_payload.raw_response;
        node.data.app_status.type = "Draft";
        delete node.data.additionalResponses;
        delete node.data?.response_payload?.raw_response;
        node.data.app_status.showResponse = false;
      }
      node.data.inHouseAppConfig.coupon.duration =
        node.data.inHouseAppConfig.coupon.duration.map((x) => {
          if (x.id === action.payload.value.id) {
            return { ...x, selected: true };
          } else {
            return { ...x, selected: false };
          }
        });
      node.data.selectedAddonsValue =
        node.data.inHouseAppConfig.coupon.duration.find(
          (dur) => dur.selected === true
        );
      let currentStaus = {
        apps: state.flowState.apps,
        links: state.flowState.links,
      };
      {
        const previousState = state.history.present;

        if (previousState && !isEqual(previousState, currentStaus)) {
          state.history.past.push(state.history.present);
          state.history.present = currentStaus;
        }
      }
    },
    setSchedulerData: (state, action) => {
      const node = state.flowState.apps.find(
        (node) => node.id === action.payload.nodeId
      );
      const { value, type, label } = action.payload;
      switch (node.data.selectedEvent.name) {
        case "Once":
          const date = `${value.substring(8, 10)}-${value.substring(
            5,
            7
          )}-${value.substring(0, 4)}`;
          const time = value.substring(11);
          node.data.selectedValue = {
            schedule_type: "Once",
            schedule_time: date + " " + time,
            localData: { date: value },
          };
          break;
        case "Every day":
          node.data.selectedValue = {
            schedule_type: "Everyday",
            schedule_time: value,
            localData: { time: value },
          };
          break;
        case "Days of the week":
          if (type === "select") {
            let days = [];
            value.map((e) => days.push(e.value));
            node.data.selectedValue["days"] = days.toString();
            node.data.selectedValue.localData["days"] = value;
          } else {
            node.data.selectedValue.schedule_time = value;
            node.data.selectedValue.localData["time"] = value;
          }
          break;
        case "Days of the month":
          if (type === "select") {
            let dates = [];
            value.map((e) => dates.push(e.value));
            node.data.selectedValue["dates"] = dates.toString();
            node.data.selectedValue.localData["dates"] = value;
          } else {
            node.data.selectedValue.schedule_time = value;
            node.data.selectedValue.localData["time"] = value;
          }
          break;
        case "At regular intervals":
          if (type === "select" && label === "timespan") {
            const { time_span, interval, localData, ...rest } =
              node.data.selectedValue;
            node.data.selectedValue = {
              ...rest,
              time_span: "",
              every: "",
              days: "",
              interval: "",
              localData: {
                every: "",
                dates: [],
                days: [],
                timespan: "",
                time: "",
              },
            };
            node.data.selectedValue.time_span = value.value;
            node.data.selectedValue.interval = value.value;
            node.data.selectedValue.localData.timespan = value;
          } else if (type === "input" && label !== "time") {
            node.data.selectedValue.every = value;
            node.data.selectedValue.localData.every = value;
          } else if (type === "input" && label === "time") {
            node.data.selectedValue.schedule_time = value;
            node.data.selectedValue.localData.time = value;
          } else if (type === "select" && label === "week") {
            let days = [];
            value.map((e) => days.push(e.value));
            node.data.selectedValue.days = days.toString();
            node.data.selectedValue.localData.days = value;
          }
          break;
      }
    },
    setApiData: (state, action) => {
      const node = state.flowState.apps.find(
        (node) => node.id === action.payload.node_id
      );
      if (action.payload?.panelData) {
        let headerList = [],
          paramsList = [];
        action.payload.headers.map((obj) => {
          if (obj.key !== "") {
            let id = nanoid();
            headerList.push({
              sequence: 0,
              config_key: obj.key,
              key_value_type: "input",
              value: "",
              label: `Header - ${obj.key}`,
              side: "right",
              app_id: node.data.app_detail.id,
              config_key_required: true,
              app_event_id: node.data.selectedEvent.id,
              fetch_fields: false,
              ts: new Date().getTime(),
              uiKey: id,
              nodeId: node.data.node_id,
              port: {
                id: id,
                source: id + "|" + "source",
                target: id + "|" + "target",
                nodeId: node.data.node_id,
              },
              visible: true,
            });
          }
        });
        action.payload.params.map((obj) => {
          if (obj.key !== "") {
            let id = nanoid();
            paramsList.push({
              sequence: 0,
              config_key: obj.key,
              key_value_type: "input",
              value: "",
              label: `Params - ${obj.key}`,
              side: "right",
              app_id: node.data.app_detail.id,
              config_key_required: true,
              app_event_id: node.data.selectedEvent.id,
              fetch_fields: false,
              ts: new Date().getTime(),
              uiKey: id,
              nodeId: node.data.node_id,
              port: {
                id: id,
                source: id + "|" + "source",
                target: id + "|" + "target",
                nodeId: node.data.node_id,
              },
              visible: true,
            });
          }
        });
        node.data.configResponses = [
          node.data.configResponses.find(
            (config) => config.id == "endpointURL"
          ),
          ...headerList,
          ...paramsList,
        ];
        node.data.selectedValue.apiDetails.headers = action.payload.headers;
        node.data.selectedValue.apiDetails.params = action.payload.params;
      } else {
        const { value, id } = action.payload;
        if (id == "Wrap") {
          node.data.selectedValue.wrap_in_array = value;
          node.data.selectedValue.apiDetails.wrapRequestInArray =
            node.data.selectedValue.apiDetails.wrapRequestInArray.map((obj) => {
              if (obj.id == value.id) {
                return { ...obj, selected: true };
              } else return { ...obj, selected: false };
            });
        }

        if (id == "Payload") {
          node.data.selectedValue.payload_type = value;
          node.data.selectedValue.apiDetails.payloadType =
            node.data.selectedValue.apiDetails.payloadType.map((obj) => {
              if (obj.id == value.id) {
                return { ...obj, selected: true };
              } else return { ...obj, selected: false };
            });
        }
      }
    },
    setSegementIndex: (state, action) => {
      let node = state.flowState.apps.find(
        (app) => app.data.node_id === action.payload.nodeId
      );
      if (node.data.app_status.flowReady === true) {
        node.data.configResponses = node.data.configResponses.filter(
          (conf) => !conf.additional
        );
        delete node.data.response_payload.raw_response;
        node.data.app_status.type = "Draft";
        delete node.data.additionalResponses;
        delete node.data?.response_payload?.raw_response;
        node.data.app_status.showResponse = false;
      }
      node.data.inHouseAppConfig.Splitter.segmentIndex =
        node.data.inHouseAppConfig.Splitter.segmentIndex.map((x) => {
          if (x.id === action.payload.value.id) {
            return { ...x, selected: true };
          } else {
            return { ...x, selected: false };
          }
        });
      node.data.selectedAddonsValue =
        node.data.inHouseAppConfig.Splitter.segmentIndex.find(
          (dur) => dur.selected === true
        );
      let currentStaus = {
        apps: state.flowState.apps,
        links: state.flowState.links,
      };
      {
        const previousState = state.history.present;

        if (previousState && !isEqual(previousState, currentStaus)) {
          state.history.past.push(state.history.present);
          state.history.present = currentStaus;
        }
      }
    },
    addNewFilter: (state, action) => {
      const app = state.flowState.apps.find(
        (app) => app.data.node_id === action.payload.nodeId
      );
      let totalFilter = app.data.filterValues.length;
      app.data.filterValues[totalFilter - 1].joinWith = action.payload.joinWith;
      app.data.filterValues = [
        ...app.data.filterValues,
        { id: nanoid(), field: "", operator: "", value: "" },
      ];
      let currentStaus = {
        apps: state.flowState.apps,
        links: state.flowState.links,
      };
      {
        const previousState = state.history.present;

        if (previousState && !isEqual(previousState, currentStaus)) {
          state.history.past.push(state.history.present);
          state.history.present = currentStaus;
        }
      }
    },
    removeFilter: (state, action) => {
      const app = state.flowState.apps.find(
        (app) => app.data.node_id === action.payload.nodeId
      );
      app.data.filterValues = app.data.filterValues.filter(
        (entity) => entity.id !== action.payload.id
      );
      if (app.data.filterValues.length === 0) {
        app.data.filterValues = [
          { id: nanoid(), field: "", operator: "", value: "" },
        ];
      }

      let sourceConfigs = app.data?.filterValues
        .map((x) => {
          return [x.linkFrom1, x.linkFrom2];
        })
        .flat(2)
        .filter(
          (item, index, self) => index === self.findIndex((t) => t === item)
        )
        .filter((con) => con !== undefined);

      const links = sourceConfigs.map((sourcecon) => ({
        id: nanoid(),
        source: state.flowState.apps.find((app) =>
          app.data.configResponses.find(
            (conf) => conf.port.source === sourcecon
          )
        ).id,
        target: action.payload.nodeId,
        sourceHandle: sourcecon,
        targetHandle: app.data.configResponses[0].port.target,
        type: "buttonedge",
      }));

      state.flowState.links = state.flowState.links.filter(
        (link) => link.target !== action.payload.nodeId
      );

      state.flowState.links = [...state.flowState.links, ...links];

      let currentStaus = {
        apps: state.flowState.apps,
        links: state.flowState.links,
      };
      {
        const previousState = state.history.present;

        if (previousState && !isEqual(previousState, currentStaus)) {
          state.history.past.push(state.history.present);
          state.history.present = currentStaus;
        }
      }
    },
    onInputInMentionInput: (state, action) => {
      const appNode = state.flowState.apps.find(
        (app) => app.data.node_id === action.payload.portInfo.nodeId
      );
      const app = state.flowState.apps
        .find((app) => app.data.node_id === action.payload.portInfo.nodeId)
        .data.configResponses.find(
          (conf) => conf.uiKey === action.payload.portInfo.uiKey
        );

      app.value = action.payload.input;
      let arrayOfConfigs = [];
      let string = action.payload.input.replace(
        /(@\[[^\]]+\])\(([^)]+)\)/g,
        (match, p1, p2) => {
          // Here you can modify the content inside the parentheses ({})
          let parsedConfigs = JSON.parse(p2);
          appNode.data.providerApps = [
            ...appNode.data.providerApps,
            parsedConfigs.nodeId,
          ];
          let mapValue = {
            type: "key-map",
            value: parsedConfigs.id,
            konnect_activity_id: parsedConfigs.konnect_activity_id,
            iterator: parsedConfigs.iterator ? parsedConfigs.iterator : false,
          };
          app.iterator = parsedConfigs.iterator ? parsedConfigs.iterator : null;
          arrayOfConfigs.push({
            ...parsedConfigs,
          });

          const modifiedContent = JSON.stringify(mapValue); // Example modification
          return `${p1}(${modifiedContent})`;
        }
      );
      appNode.data.providerApps = [...new Set(appNode.data.providerApps)];
      app.targetLinked = true;
      app.gggg = string;
      let uniqueData = arrayOfConfigs.filter(
        (item, index, self) =>
          index === self.findIndex((t) => t.uiKey === item.uiKey)
      );
      state.flowState.links = state.flowState.links.filter(
        (x) => x.target !== action.payload.portInfo.nodeId
      );
      uniqueData.map((x) => {
        let sourceConfig = state.flowState.apps
          .find((y) => y.data.node_id === x.nodeId)
          .data.configResponses.find(
            (con) => con.port.source === x.port.source
          );
        sourceConfig.sourceLinked = true;
        sourceConfig.visible = true;

        state.flowState.links.push({
          id: nanoid(),
          source: x.nodeId,
          target: action.payload.portInfo.nodeId,
          sourceHandle: x.port.source,
          targetHandle: action.payload.portInfo.port.target,
          //  animated: true,
          type: "buttonedge",
        });
      });
      let linkTothisNode = state.flowState.links.filter(
        (link) => link.target === action.payload.portInfo.nodeId
      );

      if (linkTothisNode.length > 0) {
        app.targetLinked = true;
      } else {
        app.targetLinked = false;
      }
      state.flowState.links = state.flowState.links.map((y) => {
        let source = state.flowState.apps.find(
          (x) => x.data.node_id === y.source
        );
        source.data.configResponses.map((con) => {
          if (
            state.flowState.links.find(
              (x) => x.sourceHandle === con.port.source
            )
          ) {
            return {
              ...con,
              sourceLinked: true,
            };
          } else {
            return {
              ...con,
              sourceLinked: false,
            };
          }
        });
        return y;
      });
      let currentStaus = {
        apps: state.flowState.apps,
        links: state.flowState.links,
      };
      {
        const previousState = state.history.present;

        if (previousState && !isEqual(previousState, currentStaus)) {
          state.history.past.push(state.history.present);
          state.history.present = currentStaus;
        }
      }
    },
    onSettingNode: (state, action) => {
      const node = state.flowState.apps.find(
        (x) => x.data.node_id === action.payload.node_id
      );
      node.className = action.payload.focused;
    },
    redo: (state, action) => {
      const history = state.history;
      const currentstat = state.flowState;

      if (!history.past.length && !history.future.length && history.present) {
        state = state;
      }

      if (!history.future.length) {
        state = state;
      }

      history.past.push(history.present);
      history.present = history.future.pop();

      const currentCanvas = {
        ...currentstat,
        ...history.present,
      };

      state.flowState = currentCanvas;
      state.history = history;
    },
    undo: (state, action) => {
      const history = state.history;
      const currentchart = state.flowState;

      if (!history.past.length && !history.future.length && history.present) {
        state = state;
      }

      if (!history.past.length) {
        state = state;
      }

      history.future.push(history.present);
      history.present = history.past.pop();
      if (state.trashNodes.length) {
        let result;

        history.present.apps = history.present?.apps?.map((n) => {
          state.trashNodes.map((r) => {
            let id = nanoid();
            if (n.id === r.id) {
              return (result = {
                ...n,
                data: {
                  app_detail: n.data.app_detail,
                  node_id: n.data.node_id,
                  app_status: {
                    type: "Loading",
                    account_drawer: false,
                    collapseEventAccount:
                      n.data.app_detail.provider.toLowerCase() !== "webhook"
                        ? false
                        : true,
                    collapseConfiguration: false,
                    hasSequence: true,
                    fetchFieldStatus: false,
                  },
                  dataForSelect: n.data.dataForSelect,
                  appDetails: state.inHouseAppConfig,
                  app_info: n.data.app_info,
                  configResponses:
                    n.data.app_detail.provider === "conditioner"
                      ? [
                          {
                            app_id: action.payload.app_detail.id,
                            config_key: "Filter_value",
                            config_key_required: false,
                            id: "Filter_value",
                            label: "Filter Condition",
                            sequence: 0,

                            port: {
                              id: id,
                              source: id + "|" + "source",
                              target: id + "|" + "target",
                              nodeId: node.data.node_id,
                            },
                          },
                        ]
                      : [],

                  filterValues:
                    n.data.app_detail.provider === "conditioner"
                      ? [{ id: nanoid(), field: "", operator: "", value: "" }]
                      : null,
                },
              });
            } else {
              return (result = { ...n });
            }
          });

          return result;
        });
        history.present.links = history.present.links.filter((l) => {
          return state.trashNodes.find((n) => {
            return n.id !== l.target;
          });
        });
      }

      const currentChart = {
        ...currentchart,
        ...history.present,
      };

      state.flowState = currentChart;
      state.history = history;
    },

    onUpdateFilter: (state, action) => {
      const { selectedConfig, nodeId } = action.payload;
      const appNode = state.flowState.apps.find(
        (app) => app.data.node_id === action.payload.nodeId
      );
      if (appNode.data.app_status.flowReady === true) {
        appNode.data.configResponses = appNode.data.configResponses.filter(
          (conf) => !conf.additional
        );
        delete appNode.data.response_payload.raw_response;
        appNode.data.app_status.type = "Draft";
        delete appNode.data.additionalResponses;
      }
      if (action.payload.nullValue) {
        appNode.data.filterValues = [action.payload.value];
        appNode.data.configResponses = appNode.data.configResponses
          .filter((conf) => !conf.additional)
          .map(({ targetLinked, ...rest }) => rest);

        state.flowState.links = state.flowState.links.filter(
          (link) => link.target !== action.payload.nodeId
        );

        delete appNode.data.dataForCondition;
        delete appNode.data.sourceApp;
        delete appNode.data.sourceConfigsOfLinks;
      } else {
        if (action.payload.conditionIndex === 0) {
          appNode.data.filterValues = [action.payload.value];
          appNode.data.dataForCondition = appNode.data?.dataForSelect.filter(
            (x) => x.nodeId === action.payload.value.selectedNodeId
          );
          appNode.data.sourceApp = action.payload.value.selectedNodeId;
        } else {
          appNode.data.filterValues[action.payload.conditionIndex] =
            action.payload.value;
        }

        if (selectedConfig !== "custom") {
          const sourceConfig = state.flowState.apps
            .find((app) => app.data.node_id === selectedConfig.nodeId)
            ?.data.configResponses.find(
              (con) => con.uiKey === selectedConfig.uiKey
            );

          if (sourceConfig) {
            sourceConfig.sourceLinked = true;
            sourceConfig.visible = true;
          }

          appNode.data.configResponses[0].targetLinked = true;
        }
      }

      let sourceConfigs = appNode.data.filterValues
        .map((x) => {
          return [x.linkFrom1, x.linkFrom2];
        })
        .flat(2)
        .filter(
          (item, index, self) => index === self.findIndex((t) => t === item)
        )
        .filter((con) => con !== undefined);

      const links = sourceConfigs.map((sourcecon) => ({
        id: nanoid(),
        source: state.flowState.apps.find((app) =>
          app.data.configResponses.find(
            (conf) => conf.port.source === sourcecon
          )
        ).id,
        target: action.payload.nodeId,
        sourceHandle: sourcecon,
        targetHandle: appNode.data.configResponses[0].port.target,
        type: "buttonedge",
      }));

      state.flowState.links = state.flowState.links.filter(
        (link) => link.target !== action.payload.nodeId
      );

      state.flowState.links = [...state.flowState.links, ...links];
      let currentStaus = {
        apps: state.flowState.apps,
        links: state.flowState.links,
      };
      {
        const previousState = state.history.present;

        if (previousState && !isEqual(previousState, currentStaus)) {
          state.history.past.push(state.history.present);
          state.history.present = currentStaus;
        }
      }
    },

    updateFilters: (state, action) => {
      const appNode = state.flowState.apps.find(
        (app) => app.data.node_id === action.payload.nodeId
      );
      let filterText = appNode.data.filterValues.map((condition) => {
        let queryOperatorText =
          condition.queryOperator === undefined
            ? ""
            : condition.queryOperator.toUpperCase();
        return (
          "<h1>" +
          condition.field.label +
          " " +
          condition.operator +
          " " +
          condition.value.name +
          " " +
          queryOperatorText +
          "\r\n" +
          "</h1>"
        );
      });
      appNode.data.filterText = filterText;
    },
    resetConfig: (state, action) => {
      const appNode = state.flowState.apps.find(
        (app) => app.data.node_id === action.payload.node_id
      );
      let nodesTobeFiltered = state.flowState.apps.filter((x) =>
        x.data?.providerApps?.includes(action.payload.node_id)
      );
      let filteredNodeWithCurrent = [];
      let nodeTofilter = [...nodesTobeFiltered, appNode];
      if (action.payload.type === "Normal") {
        filteredNodeWithCurrent = [
          ...nodesTobeFiltered.map((r) => {
            return r.id;
          }),
        ];
        nodeTofilter = nodesTobeFiltered;
        appNode.data.app_status = {
          type: "Draft",
          account_drawer: false,
          collapseEventAccount: appNode.data.app_status.collapseEventAccount,
          collapseConfiguration: appNode.data.app_status.collapseConfiguration,
          hasSequence: appNode.data.app_status.hasSequence,
          fetchFieldStatus: appNode.data.app_status.fetchFieldStatus,
          app_index: appNode.data.app_detail.app_index,
        };
        if (appNode.data?.configResponses) {
          appNode.data.configResponses = appNode.data?.configResponses
            .filter((con) => !con.additional)
            .map((x) => {
              return {
                ...x,
                visible: true,
              };
            });
        }

        delete appNode.data?.app_status.data?.app_status?.showAddResponseButton;
        delete appNode.data?.additionalconfigResponses;
        delete appNode.data?.response_payload?.raw_response;
      } else {
        filteredNodeWithCurrent = [
          ...nodesTobeFiltered.map((r) => {
            return r.id;
          }),
          action.payload.node_id,
        ];
        nodeTofilter = [...nodesTobeFiltered, appNode];
      }

      if (nodeTofilter.length) {
        state.flowState.apps = state.flowState.apps.map((n) => {
          // Initialize result
          let result = n;

          nodeTofilter?.forEach((r) => {
            let id = nanoid();
            if (n.data.node_id === r.data.node_id) {
              result = {
                ...n,
                data: {
                  app_detail: n.data.app_detail,
                  node_id: n.data.node_id,
                  app_status: {
                    type: "Draft",
                    account_drawer: false,
                    collapseEventAccount:
                      n.data.app_detail.provider.toLowerCase() !== "webhook"
                        ? false
                        : true,
                    collapseConfiguration: false,
                    hasSequence: true,
                    fetchFieldStatus: false,
                  },
                  konnect_activity_id: n.data.konnect_activity_id,
                  konnect_id: n.data.konnect_id,
                  trigger_konnect_id: n.data?.trigger_konnect_id
                    ? n.data?.trigger_konnect_id
                    : null,
                  dataForSelect: [],
                  inHouseAppConfig: state.inHouseAppConfig,
                  selectedEvent: n.data.selectedEvent,
                  selectedAccount: n.data.selectedAccount,
                  app_info: n.data.app_info,
                  configResponses: n.data?.configResponses
                    ?.map((r) => {
                      const {
                        sourceLinked,
                        targetLinked,
                        type,
                        value,
                        configType,
                        valueForTest,
                        gggg,
                        ...rest
                      } = r;
                      return { ...rest, visible: true };
                    })
                    .filter((con) => !con.additional),

                  filterValues:
                    n.data.app_detail.provider === "conditioner"
                      ? [{ id: nanoid(), field: "", operator: "", value: "" }]
                      : null,
                },
              };
            }
          });

          return result;
        });

        state.flowState.dataForSelect = state.flowState.dataForSelect.filter(
          (element) => {
            const shouldKeepData = !nodeTofilter?.some((r) => {
              return r.data.node_id === element.nodeId;
            });

            return shouldKeepData;
          }
        );
        state.flowState.apps = state.flowState.apps.map((app, i) => {
          return {
            ...app,
            data: {
              ...app.data,
              dataForSelect:
                i !== 0
                  ? state.flowState.dataForSelect.filter(
                      (ele) => ele.nodeId !== app.data.node_id
                    )
                  : [],
            },
          };
        });
      }

      state.flowState.links = state.flowState.links.filter((link) => {
        // Check if neither the source nor the target nodes of the link are in nodesTobeFiltered
        const sourceNotInFiltered = !filteredNodeWithCurrent?.some(
          (r) => r === link.source
        );
        const targetNotInFiltered = !filteredNodeWithCurrent?.some(
          (r) => r === link.target
        );

        // Return true to keep the link if neither the source nor the target nodes are in nodesTobeFiltered, otherwise return false
        return sourceNotInFiltered && targetNotInFiltered;
      });
      let currentStaus = {
        apps: state.flowState.apps,
        links: state.flowState.links,
      };
      {
        const previousState = state.history.present;

        if (previousState && !isEqual(previousState, currentStaus)) {
          state.history.past.push(state.history.present);
          state.history.present = currentStaus;
        }
      }
    },
    updateTriggerPop: (state, action) => {
      state.triggerPopUp = false;
    },
    showResponseShowInNode: (state, action) => {
      const appNode = state.flowState.apps.find(
        (app) => app.data.node_id === action.payload.node_id
      );
      appNode.data.app_status.showResponse = action.payload.status;
    },
    closeAllAdditionalResponse: (state, action) => {
      state.flowState.apps = state.flowState.apps.map((app) => {
        return {
          ...app,
          data: {
            ...app.data,
            app_status: {
              ...app.data.app_status,
              showResponse: false,
            },
          },
        };
      });
    },
    handleToggle: (state, action) => {
      state.flowState.apps = state.flowState.apps.map((app) => {
        return {
          ...app,
          data: {
            ...app.data,
            configResponses: app.data?.configResponses?.map((conf) => {
              return {
                ...conf,
                targetLinked: state.flowState.links.some(
                  (ele) => ele.targetHandle === conf.port.target
                ),
                sourceLinked: state.flowState.links.some(
                  (ele) => ele.sourceHandle === conf.port.source
                ),
              };
            }),
          },
        };
      });
    },
    addKeys: (state, action) => {
      const appNode = state.flowState.apps.find(
        (node) => node.id === action.payload.node_id
      );
      const newConfigDetails = (list, text) => {
        const nodes = [];

        list.forEach((obj) => {
          let id = nanoid();
          if (obj.key !== "") {
            nodes.push({
              sequence: 0,
              customAdded: true,
              config_key: obj.key,
              error: null,
              key_value_type: "input",
              value: "",
              mapped: true,
              label: `${obj.key}`,
              side: "left",
              app_id: appNode.data.app_detail.id,
              checked: true,
              id: id,
              config_key_required: true,
              app_event_id: appNode.data?.selectedEvent.id,
              fetch_fields: false,
              ts: new Date().getTime(),
              nodeId:appNode.id,
              uiKey:id,
              port: {
                id: id,
                source: id + "|" + "source",
                target: id + "|" + "target",
                nodeId:appNode.id,
              },
            });
          }
        });
        return nodes;
      };
      let newConfigResponses = newConfigDetails(
        action.payload.inputList,
        "inputKeys"
      );
      appNode.data.configResponses = appNode.data.configResponses.filter(
        (conf) => !conf.customAdded
      );
      appNode.data.keyList = action.payload.inputList;
      let newResponses = newConfigResponses.map((n) => {
        return {
          ...n,
          visible: true,
        };
      });
      appNode.data.configResponses = [
        ...appNode.data.configResponses,
        ...newResponses,
      ];
    },
    setTimerConfig:(state,action)=>{
      const appNode = state.flowState.apps.find(
        (node) => node.id === action.payload.nodeId
      ).data
      if(action.payload.timerSeq==="First"){
        appNode.app_info.timerConfigs={
          delay_unit: "",
          delay_value: "",
          delay_type: action.payload.value,
        }
      }
      if(action.payload.timerSeq==="Second"){
        appNode.app_info.timerConfigs={
          ...appNode.app_info.timerConfigs,
          delay_unit: action.payload.value,
        }
      }
      if (action.payload.delay_type === "input") {
        appNode.app_info.timerConfigs= {
          ...appNode.app_info.timerConfigs,
          delay_value: action.payload.value,
        };
      }
    },
    cancelTimer:(state,action)=>{
      let appNode = state.flowState.apps.find((n) => n.id === action.payload);
      delete appNode.data.app_info?.delayReady;
      delete appNode.data.app_info?.timerConfigs;
      delete appNode.data.app_info?.timerConfigsForTest;
    },
    setTimerConfigInApp:(state,action)=>{
      let appNode = state.flowState.apps.find(
        (n) => n.id === action.payload.nodeId
      );
      appNode.data.app_info.delayReady = true;
      if (action.payload.type === "delayUntil") {
        appNode.data.app_info.timerConfigs = action.payload.timerConfigs;
        appNode.data.app_info.timerConfigsForTest = {
          ...appNode.data.app_info.timerConfigs,
          delay_type: appNode.data.app_info.timerConfigs.delay_type.label,
        };
      } else {
        appNode.data.app_info.timerConfigs = action.payload.timerConfigs;
        appNode.data.app_info.timerConfigsForTest = {
          value: Number(appNode.data.app_info.timerConfigs.delay_value),
          delay_type: appNode.data.app_info.timerConfigs.delay_type.label,
          delay_unit: appNode.data.app_info.timerConfigs.delay_unit.label,
        };
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(captureWebHookResponse.pending, (state, action) => {
        const appNode = state.flowState.apps.find(
          (app) => app.data.node_id === action.meta.arg.node_id
        );
        appNode.data.app_status.flowReady = false;

        delete appNode.data.response_payload;
        delete appNode.data.configResponses;
      })
      .addCase(captureWebHookResponse.fulfilled, (state, action) => {
        const appNode = state.flowState.apps.find(
          (app) => app.data.node_id === action.meta.arg.node_id
        );
        if (appNode) {
          if (action.payload.test_status == "Success") {
            appNode.data.response_payload = action.payload;
            appNode.data.app_status.flowReady = true;
            appNode.data.app_status.type = "Success";
            let responsesForDropDown = FlattenJSON(
              action.payload.raw_response
            ).map((response, i) => {
              const id = response.uiKey;
              return {
                ...response,
                additional: true,
                visible: i > 2 ? false : true,
                nodeId: appNode.data.node_id,
                konnect_activity_id: action.payload.konnect_activity_id,
                port: {
                  id: id,
                  source: id + "|" + "source",
                  target: id + "|" + "target",
                  nodeId: appNode.data.node_id,
                },
              };
            });
            appNode.data.configResponses = responsesForDropDown;
            appNode.data.app_status.totalConfigResponses =
              responsesForDropDown.length;
            appNode.data.app_status.visibleConfigResponses = 3;
            let dataToStore = {
              label: appNode.data.app_detail.name,
              appName: appNode.data.app_detail.name,
              value: appNode.data.app_detail.name,
              id: appNode.data.app_detail.name,
              nodeId: appNode.data.node_id,
              options: responsesForDropDown,
              nodeIdx: 1,
            };
            state.flowState.apps = state.flowState.apps.map((app, i) => {
              if (app.data.node_id !== action.meta.arg.node_id) {
                const filteredDataForStore =
                  state.flowState.dataForSelect.filter(
                    (data) => data.nodeId !== app.data.node_id
                  );

                app.data.dataForSelect = [
                  ...filteredDataForStore,
                  { ...dataToStore },
                ];
                app.data.dataForSelect = app.data.dataForSelect.filter(
                  (item, index, self) =>
                    index === self.findIndex((t) => t.nodeId === item.nodeId)
                );
                return app;
              } else return app;
            });
            appNode.data.konnect_activity_id =
              action.payload.konnect_activity_id;
            appNode.data.konnect_id = action.payload.konnect_id;
            state.flowState.dataForSelect = [{ ...dataToStore }];
          }
        }
      })
      .addCase(captureWebHookResponse.rejected, (state, action) => {
        const appNode = state.flowState.apps.find(
          (node) => node.data.node_id === action.meta.arg.node_id
        );
        if (appNode) {
          appNode.data.app_status.flowReady = false;
          appNode.data.app_status.type = "error";
          action.meta.arg.toast({
            position: "top",
            status: "warning",
            variant: "solid",
            title:
              "Sorry, we couldn't catch the webhook! Could you please try again?",
            duration: 2500,
            containerStyle: {
              fontWeight: 400,
            },
          });
        }
      })
      .addCase(get_Events.pending, (state, action) => {
        const appNode = state.flowState.apps.find(
          (app) => app.data.node_id === action.meta.arg.nodeId
        );
        appNode.data.app_status.type = "Loading";
      })
      .addCase(get_Events.fulfilled, (state, action) => {
        const appNode = state.flowState.apps.find(
          (app) => app.data.node_id === action.meta.arg.nodeId
        );
        if (appNode) {
          appNode.data.app_status.type = "Draft";

          const appIdx = state.flowState.apps.findIndex(
            (app) => app.id === action.meta.arg.nodeId
          );
          let _events;
          if (appIdx === 0) {
            _events = action.payload.filter((x) => x.side === "left");
          } else {
            _events = action.payload.filter((x) => x.side === "right");
          }
          appNode.data.app_info.app_Events = _events;
        }
      })
      .addCase(get_Events.rejected, (state, action) => {
        const appNode = state.flowState.apps.find(
          (app) => app.data.node_id === action.meta.arg.nodeId
        );
        if (appNode) {
          appNode.data.app_status.type = "error";

          appNode.data.app_status.flowReady = false;
          action.meta.arg.toast({
            position: "top",
            status: "warning",
            variant: "solid",
            title:
              "Couldn't find any events linked with this app! Please give it another try.",
            duration: 2500,
            containerStyle: {
              fontWeight: 400,
            },
          });
        }
      })
      .addCase(get_accounts.pending, (state, action) => {
        const appNode = state.flowState.apps.find(
          (app) => app.data.node_id === action.meta.arg.nodeId
        );
        appNode.data.app_status.type = "Loading";
      })
      .addCase(get_accounts.fulfilled, (state, action) => {
        if (action.meta.arg.nodeId) {
          const appNode = state.flowState.apps.find(
            (app) => app.data.node_id === action.meta.arg.nodeId
          );

          if (appNode) {
            appNode.data.app_info.app_accounts = action.payload;

            appNode.data.app_status.type = "Draft";
          }
        }
      })
      .addCase(get_accounts.rejected, (state, action) => {
        if (action.meta.arg.nodeId) {
          const appNode = state.flowState.apps.find(
            (app) => app.data.node_id === action.meta.arg.nodeId
          );
          if (appNode) {
            appNode.data.app_status.type = "error";
            action.meta.arg.toast({
              position: "top",
              status: "warning",
              variant: "solid",
              title:
                "App events linked with this app couldn't be found! Please Authorize it.",
              duration: 2500,
              containerStyle: {
                fontWeight: 400,
              },
            });
          }
        }
      })
      .addCase(get_app_configs.pending, (state, action) => {
        const appNode = state.flowState.apps.find(
          (node) => node.data.node_id === action.meta.arg.nodeId
        );
        appNode.data.app_status.type = "Loading";
      })
      .addCase(get_app_configs.fulfilled, (state, action) => {
        const node = state.flowState.apps.find(
          (node) => node.data.node_id === action.meta.arg.nodeId
        );
        if (node) {
          const nodeIdx = state.flowState.apps.findIndex(
            (app) => app.data.node_id === action.meta.arg.nodeId
          );
          node.data.app_status.type = "Draft";
          node.data.app_status.collapseEventAccount = true;
          const configs = action.payload.sort((x, y) => {
            return x.sequence - y.sequence;
          });
          const hasSeqZero = configs.filter((x) => x.sequence === 0).length;
          if (hasSeqZero) {
            node.data.app_status.fetchFieldStatus = false;
            const _configs = configs.filter((x) => x.sequence === 0);
            let configRes = _configs.map((c) => {
              let id = nanoid();
              return {
                ...c,
                uiKey: id,
                nodeId: node.data.node_id,
                port: {
                  id: id,
                  source: id + "|" + "source",
                  target: id + "|" + "target",
                  nodeId: node.data.node_id,
                },
                visible: true,
              };
            });

            node.data.configResponses = configRes;
            if (nodeIdx === 0) {
              node.data.configResponses = configRes.map((c, i) => {
                if (i === 0) {
                  return c;
                } else return { ...c, visible: false };
              });
              if (node.data.configResponses.length > 1) {
                node.data.app_status.showTestButton = true;
              }
            }
          } else {
            node.data.app_status.fetchFieldStatus = true;
          }

          /* ----- SETTING TITLE OF LABEL FOR APP EVENT CONFIGURATION (SEQUENCE > 0)  ------ */
          const selectedTrigger = !node.data.app_info.app_Event_Configuration
            ? "Choose"
            : configs?.find(
                (x) => x.id === node.data.app_info.app_Event_Configuration
              )?.service_name;
          node.data.app_info.app_Event_Configurations = configs
            .filter((x) => x.sequence !== 0)
            .map((x) => {
              let title = x.config_key_required
                ? `${selectedTrigger} ${x.label} *`
                : `${selectedTrigger} ${x.label}`;
              return { ...x, title: title };
            });
          let hasSequence =
            node.data.app_info.app_Event_Configurations &&
            node.data.app_info.app_Event_Configurations.filter(
              (x) => x.sequence !== 0
            ).length
              ? true
              : false;
          node.data.app_status.hasSequence = hasSequence;
        }
        let currentStaus = {
          apps: state.flowState.apps,
          links: state.flowState.links,
        };
        {
          const previousState = state.history.present;

          if (previousState && !isEqual(previousState, currentStaus)) {
            state.history.past.push(state.history.present);
            state.history.present = currentStaus;
          }
        }
      })
      .addCase(get_app_configs.rejected, (state, action) => {
        const node = state.flowState.apps.find(
          (node) => node.data.node_id === action.meta.arg.nodeId
        );
        action.meta.arg.toast({
          position: "top",
          status: "warning",
          variant: "solid",
          title:
            "Oops! Something went wrong; we couldn't retrieve the configs. Please try again.",
          duration: 2500,
          containerStyle: {
            fontWeight: 400,
          },
        });
        node.datadata.app_status.type = "error";
      })
      .addCase(get_app_event_config_detail.pending, (state, action) => {
        const appNode = state.flowState.apps.find(
          (app) => app.data.node_id === action.meta.arg.nodeId
        );
        appNode.data.app_status.type = "Loading";
      })
      .addCase(get_app_event_config_detail.fulfilled, (state, action) => {
        const appNode = state.flowState.apps.find(
          (app) => app.data.node_id === action.meta.arg.nodeId
        );
        if (appNode) {
          appNode.data.app_status.collapseConfiguration = false;
          appNode.data.app_status.type = "Draft";
          const prevValue = action.meta.arg.prevValue;
          appNode.data.configResponses = appNode.data?.configResponses?.filter(
            (config) => !config.additional && config.fetch_fields !== true
          );
          let configDetails = [],
            config_key = action.meta.arg.config_key,
            selectedConfig =
              appNode.data.app_info.app_Event_Configurations?.find(
                (config) => config.config_key === action.meta.arg.config_key
              );
          if (prevValue) {
            selectedConfig =
              appNode.data.app_info.app_Event_Configurations.find(
                (config) => config.sequence === prevValue.sequence + 1
              );
            config_key = selectedConfig.config_key;
          }
          if (action.payload.data !== true) {
            if (action.payload.data.length === 0) {
              // node.data.captureMessage = `No ${selectedConfig.label}s Found`;
            }
            configDetails = action.payload.data?.map((x) => {
              return {
                ...x,
                config_key: config_key,
                sequence: selectedConfig.sequence,
                label: x.name,
                value: x.id,
              };
            });
            selectedConfig.config_details = configDetails;
          }
        }
        let currentStaus = {
          apps: state.flowState.apps,
          links: state.flowState.links,
        };
        {
          const previousState = state.history.present;

          if (previousState && !isEqual(previousState, currentStaus)) {
            state.history.past.push(state.history.present);
            state.history.present = currentStaus;
          }
        }
      })
      .addCase(get_app_event_config_detail.rejected, (state, action) => {
        const appNode = state.flowState.apps.find(
          (app) => app.data.node_id === action.meta.arg.nodeId
        );
        appNode.data.app_status.type = "error";
        action.meta.arg.toast({
          position: "top",
          status: "warning",
          variant: "solid",
          title:
            "Oops! We couldn't fetch app details. Please provide the appropriate inputs.",
          duration: 2500,
          containerStyle: {
            fontWeight: 400,
          },
        });
      })

      .addCase(get_app_event_config_detail_fetch.pending, (state, action) => {
        const appNode = state.flowState.apps.find(
          (app) => app.data.node_id === action.meta.arg.nodeId
        );
        appNode.data.app_status.type = "Loading";
      })
      .addCase(get_app_event_config_detail_fetch.fulfilled, (state, action) => {
        const appNode = state.flowState.apps.find(
          (app) => app.data.node_id === action.meta.arg.nodeId
        );
        if (appNode) {
          const nodeIdx = state.flowState.apps.findIndex(
            (app) => app.data.node_id === action.meta.arg.nodeId
          );
          appNode.data.app_status.type = "Draft";
          const sourceFields = action.payload.map((x) => {
            return {
              app_event_id: appNode.data.selectedEvent.id,
              app_id: appNode.data.id,
              config_key: x.config_key ? x.config_key : x.name,
              config_key_required:
                x.config_key_required === true
                  ? true
                  : x.id == "row_index"
                  ? true
                  : false,
              id: x.id,
              label: x.name,
              fetch_fields: true,
              visible: true,
              placeholder: x.placeholder || x.name,
              key_value_type: x.key_value_type ? x.key_value_type : "display",
              type: "source",
            };
          });
          appNode.data.configResponses = [
            ...appNode.data.configResponses.filter(
              (config) => config.fetch_fields !== true
            ),
            ...sourceFields.map((c) => {
              let id = nanoid();
              return {
                ...c,
                sequence: 0,
                checked: c.config_key_required,
                nodeId: appNode.data.node_id,
                uiKey: id,
                port: {
                  id: id,
                  source: id + "|" + "source",
                  target: id + "|" + "target",
                  nodeId: appNode.data.node_id,
                },
              };
            }),
          ];
          let configRes = appNode.data.configResponses.map((c) => {
            return {
              ...c,
              checked: true,
            };
          });

          appNode.data.configResponses = configRes;
          if (nodeIdx === 0) {
            appNode.data.configResponses = appNode.data.configResponses.map(
              (c, i) => {
                if (i === 0) {
                  return c;
                } else return { ...c, visible: false };
              }
            );
            if (appNode.data.configResponses.length > 1) {
              appNode.data.app_status.showTestButton = true;
            }
          }
        }

        let currentStaus = {
          apps: state.flowState.apps,
          links: state.flowState.links,
        };
        {
          const previousState = state.history.present;

          if (previousState && !isEqual(previousState, currentStaus)) {
            state.history.past.push(state.history.present);
            state.history.present = currentStaus;
          }
        }
      })
      .addCase(get_app_event_config_detail_fetch.rejected, (state, action) => {
        const appNode = state.flowState.apps.find(
          (app) => app.data.node_id === action.meta.arg.nodeId
        );
        appNode.data.app_status.type = "error";
        action.meta.arg.toast({
          position: "top",
          status: "warning",
          variant: "solid",
          title:
            "Apologies, we couldn't fetch app details/configs. Please provide the necessary inputs.",
          duration: 2500,
          containerStyle: {
            fontWeight: 400,
          },
        });
      })
      .addCase(onTest.pending, (state, action) => {
        const appNode = state.flowState.apps.find(
          (app) => app.data.node_id === action.meta.arg.nodeId
        );
        delete appNode.data?.response_payload?.raw_response;
        appNode.data.app_status.type = "Loading";
      })
      .addCase(onTest.fulfilled, (state, action) => {
        const appNode = state.flowState.apps.find(
          (app) => app.data.node_id === action.meta.arg.nodeId
        );
        if (appNode) {
          if (action.payload?.test_status === "Success") {
            const {
              display_message,
              konnect_id,
              raw_response,
              test_status,
              konnect_activity_id,
              condition_activity_id,
            } = action.payload;
            const appNode = state.flowState.apps.find(
              (x) => x.data.node_id === action.meta.arg.nodeId
            );
            appNode.data.app_status.flowReady = true;
            appNode.data.app_status.showMoreConfig = true;

            appNode.data.app_status.type = "Success";
            appNode.data.app_status.collapseConfiguration = true;
            appNode.data.response_payload = action.payload;
            appNode.data.additionalResponses = 0;
            appNode.data.configResponses = appNode.data?.configResponses?.map(
              (config) => {
                if (
                  config.sourceLinked ||
                  config.targetLinked ||
                  config.value
                ) {
                  return {
                    ...config,
                    konnect_activity_id: konnect_activity_id,
                  };
                } else {
                  return {
                    ...config,
                    visible: false,
                    konnect_activity_id: konnect_activity_id,
                  };
                }
              }
            );
            appNode.data.additionalconfigResponses = [
              ...FlattenJSON(raw_response).map((response, i) => {
                appNode.data.additionalResponses += 1;
                let id = nanoid();
                return {
                  ...response,
                  additional: true,
                  nodeId: appNode.data.node_id,
                  value: response.value,
                  visible: i > 2 ? false : true,
                  konnect_activity_id: konnect_activity_id,
                  port: {
                    id: id,
                    target: id + "|" + "target",
                    source: id + "|" + "source",
                    nodeId: appNode.data.node_id,
                  },
                };
              }),
            ];
            appNode.data.app_status.totalConfigResponses =
              appNode.data.additionalconfigResponses.length;
            appNode.data.app_status.visibleConfigResponses = 3;
            let normalFields = appNode.data?.configResponses?.length;
            let linkedFields = appNode.data?.configResponses?.filter(
              (x) => x.targetLinked || x.sourceLinked
            )?.length;
            if (normalFields > linkedFields) {
              appNode.data.app_status.showAddResponseButton = true;
            }
            if (appNode.data?.configResponses) {
              appNode.data.configResponses = [
                ...appNode.data?.configResponses.filter((x) => !x.additional),
                ...appNode.data.additionalconfigResponses,
              ];
            } else {
              appNode.data.configResponses = [
                ...appNode.data.additionalconfigResponses,
              ];
            }

            if (
              appNode.data.app_detail.app_type === "ADD_ON" &&
              appNode.data.app_detail.provider === "conditioner"
            ) {
              if (appNode.data.configResponses.length === 1) {
                let parentApp = state.flowState.apps.find(
                  (app) => app.data.node_id === appNode.data.sourceApp
                );
                const newConfigResponses = parentApp.data.configResponses.map(
                  (x) => {
                    const props = _.pick(x, [
                      "app_event_id",
                      "app_id",
                      "config_key",
                      "id",
                      "label",
                      "type",
                      "value",

                      "children",
                    ]);
                    return props;
                  }
                );

                appNode.data.configResponses = [
                  ...appNode.data.configResponses,
                  ...newConfigResponses.map((n) => {
                    let id = nanoid();
                    return {
                      ...n,
                      additional: true,
                      konnect_activity_id: konnect_activity_id,
                      nodeId: appNode.data.node_id,
                      visible: true,
                      uiKey: id,
                      port: {
                        id: id,
                        source: id + "|" + "source",
                        target: id + "|" + "target",
                        nodeId: appNode.data.node_id,
                      },
                    };
                  }),
                ];
                appNode.data.additionalResponses = newConfigResponses.length;

                appNode.data.response_payload.pass_through_condition = true;
                appNode.data.response_payload.condition_activity_id =
                  konnect_activity_id;
              }
            }
            if (appNode.data.pass_through_condition) {
              appNode.data.pass_through_condition = true;
              appNode.data.condition_activity_id = condition_activity_id
                ? condition_activity_id
                : konnect_activity_id;
              appNode.data.konnect_activity_id = konnect_activity_id;
            }

            let iteratorKey = appNode.data.configResponses.find(
              (x) => x.iterator === true
            )
              ? true
              : false;
            if (
              iteratorKey === true ||
              appNode.data.app_detail.provider.toLowerCase() === "iterator"
            ) {
              appNode.data.configResponses = appNode.data.configResponses.map(
                (conf) => {
                  return {
                    ...conf,
                    iterator: true,
                  };
                }
              );
            }

            let dataToStore = {
              label: appNode.data.app_detail.name,
              appName: appNode.data.app_detail.name,
              value: appNode.data.app_detail.name,
              id: appNode.data.app_detail.name,
              nodeId: appNode.data.node_id,
              options: appNode.data.configResponses?.filter(
                (c) => c.value && c.additional
              ),
              nodeIdx: appNode.data.app_detail.app_index,
            };
            state.flowState.dataForSelect =
              state.flowState.dataForSelect.filter(
                (data) => data.nodeId !== appNode.data.node_id
              );
            state.flowState.dataForSelect = [
              ...state.flowState.dataForSelect,
              { ...dataToStore },
            ];

            state.flowState.apps = state.flowState.apps.map((app, i) => {
              if (app.data.node_id !== action.meta.arg.nodeId && i !== 0) {
                const filteredDataForStore =
                  state.flowState.dataForSelect.filter(
                    (data) => data.nodeId !== app.data.node_id
                  );
                app.data.dataForSelect = [
                  ...filteredDataForStore,
                  { ...dataToStore },
                ];
                app.data.dataForSelect = app.data.dataForSelect.filter(
                  (item, index, self) =>
                    index === self.findIndex((t) => t.nodeId === item.nodeId)
                );
                return app;
              } else return app;
            });

            if (state.flowState.apps.length > 1) {
              state.flowState.apps = state.flowState.apps.map((app, i) => {
                if (i !== 0) {
                  app.data.trigger_konnect_id = konnect_id;
                  return app;
                } else return app;
              });
            }

            if (
              (appNode.data.app_detail.provider === "google-form" ||
                appNode.data.app_detail.provider === "google_sheet") &&
              appNode.data.response_payload.konnect_custom
            ) {
              state.triggerPopUp = true;
            }
            state.flowState.links = state.flowState.links.map((link) => {
              if (link.target == appNode.id) {
                return { ...link, animated: true };
              } else return link;
            });
          } else {
            appNode.data.app_status.type = "Error";
            appNode.data.response_payload={}
            appNode.data.response_payload.konnect_activity_id= action.payload?.konnect_activity_id;
            appNode.data.response_payload.delay_activity_id_activity_id = action.payload?.delay_activity_id;
            state.flowState.links = state.flowState.links.map((link) => {
              if (link.target == appNode.id) {
                return { ...link, data: { error: true } };
              } else return link;
            });
          }
        }
        let currentStaus = {
          apps: state.flowState.apps,
          links: state.flowState.links,
        };
        {
          const previousState = state.history.present;

          if (previousState && !isEqual(previousState, currentStaus)) {
            state.history.past.push(state.history.present);
            state.history.present = currentStaus;
          }
        }
      })
      .addCase(onTest.rejected, (state, action) => {
        const appNode = state.flowState.apps.find(
          (app) => app.data.node_id === action.meta.arg.nodeId
        );
        appNode.data.app_status.flowReady = false;
        appNode.data.app_status.type = "error";
        action.meta.arg.toast({
          position: "top",
          status: "warning",
          variant: "solid",
          title: action?.payload?.message
            ? action?.payload?.message
            : "Unable to process the test with these inputs. Please provide appropriate inputs.",
          duration: 2500,
          containerStyle: {
            fontWeight: 400,
          },
        });
      })
      .addCase(getFlow.pending, (state, action) => {})

      .addCase(getFlow.fulfilled, (state, action) => {
        const { apps, links } = action.payload?.canvas_json;
        state.flowState.apps = apps;
        state.flowState.links = links;
        state.flowState.dataForSelect =
          action.payload.canvas_json?.dataForSelect;
        state.flowState.flowName = action.payload.canvas_json?.flowName;
      })
      .addCase(getFlow.rejected, (state, action) => {});
      
  },
});

export const {
  onNodesChange,
  toggleBasicAuth,
  onEdgesChange,
  resetNode,
  setSelectedEvent,
  setLinkedAccount,
  setEventsConfig,
  onTextInputChange,
  onSelectedValue,
  onStatusChange,
  onDeselectTrigger,
  onTriggerSearch,
  setSchedulerData,
  onSelectTrigger,
  onSelectAction,
  onAccountDraw,
  onCollapseEventAcount,
  setAppStatus,
  onDelete,
  setBasicAuthCredential,
  onCollapseEventConfig,
  addMoreResponses,
  onLinkDelete,
  setFlowName,
  resetCanvas,
  saveCouponExpNum,
  saveCouponDuration,
  setSegementIndex,
  addNewFilter,
  removeFilter,
  onInputInMentionInput,
  onSettingNode,
  redo,
  undo,
  onUpdateFilter,
  updateFilters,
  setApiData,
  resetConfig,
  updateTriggerPop,
  showResponseShowInNode,
  closeAllAdditionalResponse,
  handleToggle,
  addKeys,setTimerConfig,cancelTimer,setTimerConfigInApp
} = flowSlice.actions;

export default flowSlice.reducer;
