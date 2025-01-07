import { nanoid } from "@reduxjs/toolkit";

export const FlattenJSON = (json) => {
  let newData = [];
  const extract = (obj, parentKey = []) => {
    if (!obj) return;
    Object.keys(obj).map((key) => {
      const __key = nanoid();
      if (typeof obj[key] === "object") {
        const k = `${[...parentKey, key].join(".$")}`;
        const _parentKey = parentKey.map(
          (x) => `${x[0].toUpperCase()}${x.slice(1)}`
        );
        const nodeLabel = `${[
          ..._parentKey,
          key[0] ? `${key[0].toUpperCase()}${key.slice(1)}` : "Undefined",
        ].join(" > ")}`;
        obj[key]?.length &&
          Array.isArray(obj[key]) === false &&
          newData.push({
            id: k,

            label: nodeLabel,
            name: nodeLabel,
            k,
            children: Object.keys(obj[key]).map((z) => `${[k, z].join(".$")}`),
            uiKey: __key,
          });

        extract(obj[key], [...parentKey, key]);
      } else {
        const k = `${[...parentKey, key].join(".$")}`;
        let label = k.replace("$", "");
        label = label.charAt(0).toUpperCase() + label.slice(1);
        newData.push({
          id: k,
          label: key[0] ? label : "Undefined",
          value: obj[key],
          config_key: k,

          uiKey: __key,
        });
      }
      return false;
    });
  };
  extract(json);

  return newData;
};

export const juiceMaker = (props) => {
  const { appNode, apps, links } = props;
  let payload = {
    app_account_id: appNode.data.selectedAccount?.id
      ? appNode.data.selectedAccount?.id
      : null,
    app_event_id: appNode.data.selectedEvent?.id
      ? appNode.data.selectedEvent?.id
      : null,
    app_id: appNode.data.app_detail.id,
    konnect_id: apps[0].data?.response_payload?.konnect_id ? apps[0].data.response_payload.konnect_id : null,
    config: {},
    konnect_activity_id:appNode.data?.response_payload?.konnect_activity_id?appNode.data?.response_payload?.konnect_activity_id:null,
    provider: appNode.data.app_detail.provider,
  };
  appNode.data.app_info.app_Event_Configurations?.map((config) => {
    if (config?.selected) {
      payload.config[config.config_key] = config.selected.id;
    }
  });
  appNode.data?.configResponses?.map((config) => {
    if (!config.additional && config.sequence == 0 && config.value && !config.customAdded) {
      payload.config[config.config_key] = {
        ...config.valueForTest,
      };
      if (appNode.data.konnect_activity_id) {
        if (
          config.valueForTest.konnect_activity_id >
          appNode.data.konnect_activity_id
        ) {
          payload.konnect_activity_id = null;
        } else payload.konnect_activity_id = payload.konnect_activity_id;
      } else {
        payload.konnect_activity_id = null;
      }
    }
  });

  if (
    appNode.data.app_detail.app_type === "ADD_ON" &&
    (appNode.data.app_detail.provider.toLowerCase() === "textformatter" ||
      appNode.data.app_detail.provider.toLowerCase() === "numberformatter" ||
      appNode.data.app_detail.provider.toLowerCase() === "dateformatter")
  ) {
    let string;
    appNode.data.configResponses.map((x) => {
      if(!x.additional){

     
      string = x.value.replace(/(@\[[^\]]+\])\(([^)]+)\)/g, (match, p1, p2) => {
        // Here you can modify the content inside the parentheses ({})
        let parsedConfigs = JSON.parse(p2);

        let mapValue = {
          type: "key-map",
          value: parsedConfigs.id,
          konnect_activity_id: parsedConfigs.konnect_activity_id,
          iterator: parsedConfigs.iterator ? parsedConfigs.iterator : false,
        };

        const modifiedContent = JSON.stringify(mapValue); // Example modification
        return `${p1}(${modifiedContent})`;
      }); }
    });
    if (string !== undefined) {
      payload.config.text.type = "user-defined";
      payload.config.text.value = string;
    }
  }

  if (
    appNode.data.app_detail.app_type === "ADD_ON" &&
    appNode.data.app_detail.provider === "generator"
  ) {
    payload.config.appDetails = appNode.data.inHouseAppConfig;
  } else if (
    appNode.data.app_detail.app_type === "ADD_ON" &&
    appNode.data.app_detail.provider.toLowerCase() === "textsplitter"
  ) {
    if (appNode.data.inHouseAppConfig.Splitter)
      payload.config.segmentIndex =
        appNode.data.inHouseAppConfig.Splitter.segmentIndex;
  }
  const filterConfigForTest = [];

  if (
    appNode.data.app_detail.app_type === "ADD_ON" &&
    appNode.data.app_detail.provider === "conditioner"
  ) {
    let operator = null;
    appNode.data.filterValues.map((e) => {
      const filter = {
        attribute: {
          type: "key-map",
          value: e.field.value,
          konnect_activity_id: e.field.konnect_activity_id,
        },
        condition: e.operator,
        condition_value: e.value.value
          ? e.value
          : {
              type: "user-defined",
              value: e.value,
            },
      };
      if (operator) filter.concat_value = operator;
      operator = e.joinWith ? e.joinWith.toUpperCase() : null;
      filterConfigForTest.push(filter);
    });
    payload.config = [...filterConfigForTest];
  }
  if (
    appNode.data.app_detail.app_type === "ADD_ON" &&
    appNode.data.app_detail.provider === "data_forwarder"
  ) {
    let forwardDetails = {};
    appNode.data.configResponses
      .filter((x) => x.customAdded === true)
      ?.map((config) => {
        forwardDetails[config.config_key] = {
          ...config.valueForTest,
        };
        if (appNode.data.konnect_activity_id) {
          if (
            config.valueForTest.konnect_activity_id >
            appNode.data.konnect_activity_id
          ) {
            payload.konnect_activity_id = null;
          } else payload.konnect_activity_id = payload.konnect_activity_id;
        } else {
          payload.konnect_activity_id = null;
        }
      });
    payload.config.forwardDetails = { details: forwardDetails };
  }
  if (
    appNode.data.app_detail.app_type === "ADD_ON" &&
    appNode.data.app_detail.provider.toLowerCase() === "api"
  ) {
    payload.config.apiDetails = appNode.data.selectedValue.apiDetails;
  }
  if(appNode.data.app_info.delayReady){
    payload.delay_config=appNode.data.app_info.timerConfigsForTest
  }
  links.map((link) => {
    const fromNode = apps.find((n) => n.data.node_id === link.source);

    if (
      fromNode.data.response_payload?.pass_through_condition === true &&
      link.target === appNode.data.node_id
    ) {
      payload.config.pass_through_condition =
        fromNode.data.response_payload?.pass_through_condition;
      payload.config.condition_activity_id = fromNode.data.response_payload
        ?.pass_through_condition
        ? fromNode.data.response_payload?.condition_activity_id
        : null;
    }
  });
  return payload;
};
