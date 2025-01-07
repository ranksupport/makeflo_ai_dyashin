import {  Flex, Icon, Tooltip as CTooltip } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
// import { PieChart, Pie, Sector, ResponsiveContainer } from "recharts";
import { GiUpgrade } from "react-icons/gi";
import { PieChart} from "react-minimal-pie-chart";
import { BsInfoSquareFill } from "react-icons/bs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  Tooltip,
} from "recharts";
import AuthTokenService from "../../utils/AuthTokenService";
import { Topbar } from "../../components/shell";
import { getWidgetDetails } from "../../store/thunk/dashboardThunk";
import { useDispatch } from "react-redux";
import { getTaskLogsList } from "../../store/thunk/historyThunk";

export const Dashboard = () => {
  return (
    <>
      <Topbar heading="DASHBOARD" />
      <Flex
        sx={{
          width: "100%",
          height: "100%",
          overflowY: "auto",
          overflowX: "hidden",
          flexDir: "column",
          gap: "40px",
          pb: "5px",
        }}
      >
        <Flex width="100%" gap="40px">
          {[1, 2, 3].map((ele, i) => {
            return i == 0 ? (
              <TotalFlow key={i} />
            ) : i == 1 ? (
              <ExtraTask key={i} />
            ) : (
              <UpradeAccount key={i} />
            );
          })}
        </Flex>
        <Flex width="100%" gap="40px">
          <HistoryChart />
          <TaskOverview />
        </Flex>
      </Flex>
    </>
  );
};

const TotalFlow = () => {
  const [flowData, setFlowData] = useState({
    total_konnects: "",
    active_konnects: "",
    inactive_konnects: "",
  });
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getWidgetDetails("total_konnectz")).then((res) => {
      if (res.error) {
        dispatch(setRoute("Dashboard"));
        AuthTokenService.clear();
        navigate("/login");
      } else setFlowData(res.payload);
    });
  }, []);
  return (
    <Flex
      width={1 / 3}
      height="180px"
      sx={{
        bgColor: "#fff",
        borderRadius: "8px",
        boxShadow: "md",
        p: "20px",
        gap: "15px",
        flexDir: "column",
      }}
    >
      <Flex sx={{ fontSize: 18, fontWeight: 600 }}>Total Flows</Flex>
      <Flex sx={{ flexDir: "column" }}>
        {/* <Flex sx={{ fontSize: "10px" }}>Total Flows</Flex>{" "} */}
        <Flex sx={{ fontSize: 36 }}>{flowData.total_konnects}</Flex>
      </Flex>
      <Flex gap="20px">
        <Flex sx={{ alignItems: "flex-end" }}>
          Active Flow:{" "}
          <Flex sx={{ pl: "4px", fontSize: 20, alignItems: "flex-end" }}>
            {flowData.active_konnects}
          </Flex>
        </Flex>
        <Flex sx={{ alignItems: "flex-end" }}>
          Inactive Flow:{" "}
          <Flex sx={{ pl: "4px", fontSize: 20, alignItems: "flex-end" }}>
            {flowData.inactive_konnects}
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

const ExtraTask = () => {
  return (
    <Flex
      width={1 / 3}
      height="180px"
      sx={{
        bgColor: "#fff",
        boxShadow: "md",
        borderRadius: "8px",
        p: "20px",
        gap: "15px",
        flexDir: "column",
      }}
    >
      <Flex sx={{ fontSize: 18, fontWeight: 600 }}>Extra Tasks</Flex>
      <Flex sx={{ flexDir: "column" }}>
        {/* <Flex sx={{ fontSize: "10px" }}>Total Flows</Flex>{" "} */}
        <Flex sx={{ fontSize: 36 }}>0</Flex>
      </Flex>
      <Flex gap="20px">
        <Flex sx={{ alignItems: "flex-end" }}>
          Consumed Task:{" "}
          <Flex sx={{ pl: "4px", fontSize: 20, alignItems: "flex-end" }}>
            0
          </Flex>
        </Flex>
        <Flex sx={{ alignItems: "flex-end" }}>
          Remaining Task:{" "}
          <Flex sx={{ pl: "4px", fontSize: 20, alignItems: "flex-end" }}>
            0
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

const UpradeAccount = () => {
  return (
    <Flex
      width={1 / 3}
      height="180px"
      sx={{
        bgColor: "#fff",
        borderRadius: "8px",
        p: "20px",
        gap: "20px",
        boxShadow: "md",
        justifyContent: "space-between",
        flexDir: "column",
      }}
    >
      <Flex sx={{ flexDir: "column", gap: "10px" }}>
        <Flex sx={{ fontSize: 18, fontWeight: 800 }}>Upgrade to Premium</Flex>
        <Flex sx={{ fontSize: 14 }}>
          Only $99/Year, you can manage like a pro.
        </Flex>
      </Flex>

      <Flex
        sx={{
          gap: "10px",
          alignItems: "center",
          cursor: "pointer",
          fontSize: 20,
          borderTopRightRadius: "14px",
          borderBottomRightRadius: "14px",
          borderTopLeftRadius: "22px",
          borderBottomLeftRadius: "22px",
          bgColor: "#dce2e5",
          height: "44px",
        }}
      >
        <Flex
          sx={{
            borderRadius: "50%",
            bgColor: "#32445b",
            width: "48px",
            height: "48px",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Icon
            as={GiUpgrade}
            boxSize="24px"
            id="icon"
            sx={{
              color: "#fff",
            }}
          />
        </Flex>
        Upgrade Account
      </Flex>
    </Flex>
  );
};

const TaskOverview = () => {
  const [flowData, setFlowData] = useState({
    task_limit: "",
    task_consumed: "",
    task_available: "",
  });
  const [data, setData] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getWidgetDetails("task_consumption")).then((res) => {
      if (res.error) {
      } else {
        setFlowData(res.payload);
        setData([
          {
            title: "Task Consumed",
            value: res.payload.task_consumed,
            // color: "#84A7A1",
            color: "#0E2954",
          },
          {
            title: "Task Available",
            value: res.payload.task_available,
            color: "#2E8A99",
          },
        ]);
      }
    });
  }, []);
  return (
    <Flex
      width={1 / 3}
      sx={{
        bgColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
        flexDir: "column",
        boxShadow: "md",
        borderRadius: "8px",
        px: "10px",
        py: "20px",
        gap: "20px",
      }}
    >
      <Flex sx={{ fontSize: 18, fontWeight: 600 }}>Tasks Overview</Flex>
      <Flex sx={{ m: "0px auto" }}>
        <PieChart
          data={data}
          lineWidth={20}
          paddingAngle={18}
          rounded
          label={({ dataEntry }) => dataEntry.value}
          labelStyle={(index) => ({
            fill: data[index].color,
            fontSize: "5px",
            fontFamily: "sans-serif",
          })}
          labelPosition={60}
        />
      </Flex>
      <Flex
        sx={{
          flexDir: "column",
          width: "100%",
          justifyContent: "center",
          gap: "20px",
        }}
      >
        <Flex width="100%">
          <Flex width="50%" sx={{ flexDir: "column", alignItems: "center" }}>
            <Flex sx={{ fontSize: 26, fontWeight: 800 }}>
              {flowData.task_consumed}
            </Flex>
            <Flex sx={{ fontSize: 12 }}>Task Consumed</Flex>
          </Flex>
          <Flex width="50%" sx={{ flexDir: "column", alignItems: "center" }}>
            <Flex sx={{ fontSize: 26, fontWeight: 800 }}>
              {flowData.task_available}
            </Flex>
            <Flex sx={{ fontSize: 12 }}>Task Available</Flex>
          </Flex>
        </Flex>
        <Flex sx={{ flexDir: "column", alignItems: "center" }}>
          <Flex sx={{ fontSize: 26, fontWeight: 800 }}>
            {flowData.task_limit}
          </Flex>
          <Flex sx={{ fontSize: 12 }}>Total Task Limit</Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

const HistoryChart = () => {
  const dispatch = useDispatch();
  const [data, setData] = useState([]);
  useEffect(() => {
    dispatch(
      getTaskLogsList({
        searching: false,
        searchData: {
          page_size: 30,
        },
      })
    ).then((res) => {
      const result = res.payload.konnects
        .filter((kon, i) => {
          if (i < 10) {
            return true;
          }
        })
        .map((kon) => ({
          name: kon.konnect_name,
          success: kon.success_task_count,
          error: kon.error_task_count,
        }));
      setData(result);
    });
  }, []);
  return (
    <Flex
      width={2 / 3}
      sx={{
        p: "20px",
        justifyContent: "space-between",
        flexDir: "column",
      }}
    >
      <Flex
        sx={{ fontSize: 18, fontWeight: 600, justifyContent: "space-between" }}
      >
        <Flex>Recent Task Logs</Flex>
        <CTooltip label="Success/Error Tasks in the lastest 10 flows are shown here. To know more, visit History.">
          <Flex sx={{ cursor: "pointer" }}>
            <Icon
              as={BsInfoSquareFill}
              boxSize="24px"
              id="icon"
              sx={{
                color: "#32445b",
                boxShadow: "md",
              }}
            />
          </Flex>
        </CTooltip>
      </Flex>
      <Flex sx={{ alignItems: "flex-end", justifyContent: "center" }}>
        {data.length > 0 && (
          <BarChart width={800} height={450} data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="success" fill="#0E2954" />
            <Bar dataKey="error" fill="#2E8A99" />
          </BarChart>
        )}
      </Flex>
    </Flex>
  );
};
