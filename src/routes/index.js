import React from "react";
import { Route, Routes } from "react-router-dom";
import { AuthShell, NonAuthShell } from "../components/shell";
import { LoginForm } from "../features/auth/login";
import { CreateFlow } from "../features/createFlow";
import { Dashboard } from "../features/dashboard";
import { Applications } from "../features/applications";
import {
  AccMembers,
  Account,
  Avatar,
  Billing,
  Password,
  Profile,
} from "../features/account";
import { Flows } from "../features/flows";
import { History } from "../features/history";
import { SignupContainer } from "../features/auth/signup";
import { ForgotContainer } from "../features/auth/forgot";
import { ResetContainer } from "../features/auth/reset";
import { VerifyEmailContainer } from "../features/auth/verify-email";
import { AppsOauthContainer } from "../features/applications/AppsOauthContainer";
import AIPage from "../features/ai";
import AgentsFlows from "../features/ai/AgentFlows";
import Chatflows from "../features/ai/Chatflows";
import Tools from "../features/ai/Tools";

const AUTH_SHELL_ROUTES = [
  {
    path: "/dashboard",
    key: "DASHBOARD",
    component: Dashboard,
  },
  {
    path: "/applications",
    key: "APPS",
    component: Applications,
  },
  {
    path: "/logs",
    key: "HISTORY",
    component: History,
  },
  {
    path: "/flows/:index",
    key: "FLOWS",
    component: Flows,
  },
  {
    path: "/agentflows",
    key: "AgentFlows",
    component: AgentsFlows,
  },
  {
    path: "/chatflows",
    key: "Chatflows",
    component: Chatflows,
  },
  {
    path: "/tools",
    key: "Tools",
    component: Tools,
  },
  // {
  //   path: "/ai/",
  //   key: "AI",
  //   component: AIPage,
  // },
  // {
  //   path: "/chatflows/",
  //   key: "AI",
  //   component: AIPage,
  // },
  // {
  //   path: "/agentflows/",
  //   key: "AI",
  //   component: AIPage,
  // },
  // {
  //   path: "/tools/",
  //   key: "AI",
  //   component: AIPage,
  // },
  {
    path: "/account/avatar",
    key: "ACCOUNT",
    component: Avatar,
  },
  {
    path: "/account/profile",
    key: "ACCOUNT",
    component: Profile,
  },
  {
    path: "/account/password",
    key: "ACCOUNT",
    component: Password,
  },
  {
    path: "/account/members",
    key: "ACCOUNT",
    component: AccMembers,
  },
  {
    path: "/account/subscription",
    key: "ACCOUNT",
    component: Billing,
  },
];

const NON_AUTH_ROUTES = [
  { path: "/", key: "ROOT", component: LoginForm },
  {
    path: "/login",
    key: "APP_LOGIN",
    component: LoginForm,
  },
  {
    path: "/logout",
    key: "APP_LOGOUT",
    component: LoginForm,
  },
  {
    path: "/signup",
    key: "APP_SIGNUP",
    component: SignupContainer,
  },
  {
    path: "/verify-email/:token",
    key: "APP_VERIFY_EMAIL",
    component: VerifyEmailContainer,
  },
  {
    path: "/forgot-password",
    key: "APP_FORGOT_PASSWORD",
    component: ForgotContainer,
  },
  {
    path: "/reset-password/:token",
    key: "APP_RESET_PASSWORD",
    component: ResetContainer,
  },
];

export const RenderRoutes = () => {
  return (
    <Routes>
      <Route element={<NonAuthShell />}>
        {NON_AUTH_ROUTES.map((route, i) => {
          return (
            <Route key={i} path={route.path} element={<route.component />} />
          );
        })}
      </Route>
      <Route element={<AuthShell />}>
        {AUTH_SHELL_ROUTES.map((route, i) => {
          return route.key == "FLOWS" ? (
            <Route key={i} path={route.path} element={<route.component />} />
          ) : route.key == "ACCOUNT" ? (
            <Route key={i} element={<Account />}>
              <Route path={route.path} element={<route.component />} />
            </Route>
          ) : (
            <Route key={i} path={route.path} element={<route.component />} />
          );
        })}
      </Route>

      <Route path="/create" element={<CreateFlow />} />
      <Route path="/create/:id" element={<CreateFlow />} />

      <Route path="/oauth/response" element={<AppsOauthContainer />} />
      <Route
        path="/oauth/response/:appId/:token"
        element={<AppsOauthContainer />}
      />
    </Routes>
  );
};
