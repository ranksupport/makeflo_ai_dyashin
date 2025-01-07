import React, { useEffect, useState } from "react";
import {  Outlet, useParams } from "react-router-dom";
import {
  Avatar,
  Flex,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Progress,
  Tooltip,
} from "@chakra-ui/react";
import { IoSettings } from "react-icons/io5";
//import { BsRobot } from "react-icons/bs"; 
import { AiOutlineUser, AiOutlineMessage, AiOutlineTool } from 'react-icons/ai';
import AuthTokenService from "../../utils/AuthTokenService";
import { useNavigate } from "react-router-dom";
import { GrAppsRounded } from "react-icons/gr";
import { RiHomeLine } from "react-icons/ri";
import { PiPassword } from "react-icons/pi";
import { PiDotsThreeOutlineDuotone } from "react-icons/pi";
import { PiStack } from "react-icons/pi";
import { Si1Password } from "react-icons/si";
import { FiLogOut } from "react-icons/fi";
import { BiHistory } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { setActiveNav } from "../../store/slices/shellSlice";
import { FaUncharted } from "react-icons/fa";
import { getProfile } from "../../store/thunk/accountThunk";
const navItem = [
  {
    icon: "",
    label: "",
  },
  {
    icon: RiHomeLine,
    label: "Home",
    route: "/dashboard",
  },
  {
    icon: PiStack,
    label: "Flows",
    route: "/flows/home",
  },
  {
    icon: AiOutlineMessage,
    label: "Chatflows",
    route: "/chatflows",
  },
  {
    icon: AiOutlineUser,
    label: "Agentflows",
    route: "/agentflows",
  },
  {
    icon: GrAppsRounded,
    label: "Applications",
    route: "/applications",
  },
  {
    icon: AiOutlineTool,
    label: "Tools",
    route: "/tools",
  },
  {
    icon: BiHistory,
    label: "History",
    route: "/logs",
  },
  // {
  //   icon: BsRobot, // Updated to use the robot icon
  //   label: "AI",
  //   route: "/ai",
  // },
  // {
  //   icon: BsRobot, // Updated to use the robot icon
  //   label: "AI",
  //   route: "/ai",
  // },
  // {
  //   icon: BsRobot, // Updated to use the robot icon
  //   label: "AI",
  //   route: "/ai",
  // },
  {
    icon: "",
    label: "",
  },
];

export const NonAuthShell = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const loading = useSelector((state) => state.auth.loading);
  const params = useParams();
  useEffect(() => {
    if (params["*"] == "login") {
      setActiveTab(0);
    } else {
      setActiveTab(1);
    }
  }, [params]);
  return (
    <Flex
      sx={{
        background:
          "linear-gradient(128deg, rgb(238,241,246) 0%, rgb(216,222,226) 74%)",
        width: "100%",
        height: "100%",
        margin: "0px",
        overflow: "hidden",
      }}
    >
      <Flex
        sx={{
          m: "auto",
          width: "400px",
          backgroundColor: "#f5f6f6",
          boxShadow: "md",
        }}
      >
        {" "}
        <Flex sx={{ width: "100%", flexDir: "column" }}>
          <Flex sx={{ width: "100%" }}>
            <Flex
              onClick={() => {
                setActiveTab(0);
                navigate("/login");
              }}
              sx={{
                p: "10px",
                justifyContent: "center",
                alignItems: "center",
                width: "35%",
                cursor: "pointer",
                fontWeight: activeTab == 0 ? 600 : 400,
                color: activeTab == 0 ? "#33445B" : "#fff",
                bgColor: activeTab == 0 ? "#F5F6F6" : "#33445B",
                transition: "color 0.5s, background 0.5s",
              }}
            >
              SIGN IN
            </Flex>
            <Flex
              onClick={() => {
                setActiveTab(1);
                params["*"] != "forgot-password" && navigate("/signup");
              }}
              sx={{
                p: "10px",
                justifyContent: "center",
                alignItems: "center",
                width: "65%",
                cursor: params["*"] != "forgot-password" && "pointer",
                fontWeight: activeTab == 1 ? 600 : 400,
                color: activeTab == 1 ? "#33445B" : "#fff",
                bgColor: activeTab == 1 ? "#F5F6F6" : "#33445B",
                transition: "color 0.5s, background 0.5s",
              }}
            >
              {params["*"] == "forgot-password"
                ? "FORGOT PASSWORD"
                : params["*"].includes("reset-password")
                ? "RESET PASSWORD"
                : params["*"].includes("verify-email")
                ? "VERIFY EMAIL"
                : "REGISTER NOW"}
            </Flex>
          </Flex>
          <Flex flexDir="column" sx={{ p: "0px 20px 20px 20px" }}>
            {/* This is where the nested route is getting rendered */}
            <Outlet />
          </Flex>

          {params["*"] != "forgot-password" &&
          params["*"] != "signup" &&
          !params["*"].includes("reset-password") &&
          !params["*"].includes("verify-email") ? (
            <Flex
              sx={{
                p: "0px 20px 20px 20px",
                justifyContent: "flex-end",
              }}
            >
              <Flex
                onClick={() => navigate("/forgot-password")}
                sx={{
                  justifyContent: "flex-end",
                  gap: "5px",
                  cursor: "pointer",
                  pl: "10px",
                  "&:hover": {
                    borderBottom: "1px solid #32445b",
                  },
                }}
              >
                <Icon
                  as={PiPassword}
                  boxSize="22px"
                  id="icon"
                  sx={{ m: "auto 0px" }}
                />
                Forgot Password
              </Flex>
            </Flex>
          ) : (
            <Flex
              sx={{
                p: "0px 20px 20px 20px",
                textAlign: "center",
                alignItems: "center",
                flexDir: "column",
                fontSize: 14,
              }}
            >
              By clicking continue, you agree our <br />
              <a
                style={{
                  color: "#33445B",
                  cursor: "pointer",
                  borderBottom: "1px solid #33445B",
                  fontSize: 16,
                }}
              >
                Terms & Conditions
              </a>
            </Flex>
          )}
          {loading ? (
            <Progress size="xs" isIndeterminate colorScheme="#32445b" />
          ) : (
            <Flex sx={{ width: "100%", height: "3px" }} />
          )}
        </Flex>
      </Flex>
    </Flex>
  );
};

export const AuthShell = () => {
  const [hover, setHover] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getProfile());
  });

  return (
    <Flex
      sx={{
        background:
          "linear-gradient(128deg, rgb(238,241,246) 0%, rgb(216,222,226) 74%)",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        margin: "0px",
      }}
    >
      <Flex sx={{ height: "100%" }}>
        <Sidebar />
        <Flex sx={{ width: "100%", height: "100%", justifyContent: "center" }}>
          <Flex
            sx={{
              width: "100%",
              maxWidth: "1400px",
              height: "100%",
              flexDirection: "column",
              p: "40px",
              gap: "40px",
            }}
          >
            {/* This is where the nested route is getting rendered */}
            <Outlet />
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

export const Topbar = ({ heading }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const profileData = useSelector((state) => state.account.profileData);
  return (
    <Flex
      // height="80px"
      width="100%"
      sx={{ alignItems: "center", justifyContent: "space-between" }}
    >
      <Flex
        sx={{
          width: "500px",
          justifyContent: "center",
          flexDir: "column",
        }}
      >
        <Flex sx={{ fontSize: 26, fontWeight: 600 }}>{heading}</Flex>
        <Flex
          sx={{
            width: "100%",
            height: "2px",
            background:
              "linear-gradient(90deg, rgba(50,68,91,1) 0%, rgb(228,233,237,1) 95%)",
          }}
        />
      </Flex>
      <Flex sx={{ gap: "30px" }}>
        <Flex
          onClick={() => {
            navigate("/create");
          }}
          sx={{
            bgColor: "#33445b",
            color: "#fff",
            borderRadius: "8px",
            cursor: "pointer",
            px: "30px",
            justifyContent: "center",
            alignItems: "center",
            boxShadow: "lg",
            py: "10px",
            gap: "10px",
          }}
        >
          <Icon
            as={FaUncharted}
            boxSize="22px"
            id="icon"
            sx={{ m: "auto 0px" }}
          />
          Create Flow
        </Flex>
        <Flex sx={{ gap: "10px", alignItems: "center" }}>
          <Avatar
            size="md"
            name={profileData.first_name}
            src={profileData.image_url}
            sx={{ border: "2px solid black", bgColor: "#33445B" }}
          />
          <Menu>
            <MenuButton>
              <Icon
                as={PiDotsThreeOutlineDuotone}
                boxSize="22px"
                id="icon"
                sx={{
                  m: "auto 0px",
                  transform: "rotate(90deg)",
                  cursor: "pointer",
                }}
              />
            </MenuButton>
            <MenuList sx={{ p: "10px", mt: "10px" }}>
              <MenuItem
                onClick={() => {
                  dispatch(setActiveNav(-2));
                  navigate("/account/profile");
                }}
                sx={{
                  justifyContent: "start",
                  paddingY: "10px",
                  "&:hover": {
                    "& #label": {
                      color: "#000",
                    },
                  },
                }}
              >
                <Flex
                  sx={{
                    gap: "10px",
                    cursor: "pointer",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  onClick={() => navigate("/account/profile")}
                >
                  <Flex
                    id="label"
                    sx={{
                      m: "auto 0px",
                      fontSize: 16,
                      gap: "10px",
                      fontWeight: 600,
                    }}
                  >
                    <Icon
                      as={IoSettings}
                      boxSize="18px"
                      id="icon"
                      sx={{
                        m: "auto 0px",
                        cursor: "pointer",
                      }}
                    />
                    Manage Account
                  </Flex>
                </Flex>
              </MenuItem>
            </MenuList>
          </Menu>{" "}
        </Flex>{" "}
      </Flex>
    </Flex>
  );
};

export const Ctopbar = ({ heading }) => {
  return (
    <Flex
      // height="80px"
      width="100%"
      sx={{ alignItems: "center", justifyContent: "space-between" }}
    >
      <Flex
        sx={{
          width: "500px",
          justifyContent: "center",
          flexDir: "column",
        }}
      >
        <Flex sx={{ fontSize: 26, fontWeight: 600 }}>{heading}</Flex>
        <Flex
          sx={{
            width: "100%",
            height: "2px",
            background:
              "linear-gradient(90deg, rgba(50,68,91,1) 0%, rgb(228,233,237,1) 95%)",
          }}
        />
      </Flex>
    </Flex>
  );
};


const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const activeRoute = useSelector((state) => state.shell.active_nav);

  useEffect(() => {
    navItem.map((item, i) => {
      if (item.route === location.pathname) {
        dispatch(setActiveNav(i));
      } else if (location.pathname.includes("/account")) {
        dispatch(setActiveNav(-2));
      } else if (location.pathname.includes("/flow")) {
        dispatch(setActiveNav(3));
      }
    });
  }, []);
  return (
    <Flex
      width="100px"
      sx={{
        zIndex: 1,
        bgColor: "#fff",
        height: "100%",
        flexDir: "column",
        justifyContent: "space-between",
      }}
    >
      <Flex gap="40px" flexDir="column">
        <Flex
          sx={{
            height: "80px",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Icon as={Si1Password} boxSize="40px" />
        </Flex>
        <Flex flexDir="column" width="100%" pl="5px" position="relative">
          <Flex
            sx={{
              position: "absolute",
              top: "0px",
              right: "0px",
              width: "40px",
              height: "100%",
              bgColor: "#e9ecf1",
              zIndex: 2,
            }}
          />
          {navItem.map((item, i) => {
            return (
              <Tooltip
                label={item.label}
                key={i}
                placement="right"
                sx={{ p: "10px", fontSize: 13, px: "20px" }}
              >
                <Flex
                  zIndex={3}
                  width="100%"
                  onClick={() => {
                    dispatch(setActiveNav(i));
                    navigate(item.route);
                  }}
                  key={i}
                  sx={{
                    cursor:
                      i === 0 || i === navItem.length - 1
                        ? "default"
                        : "pointer",
                    justifyContent: "center",
                    alignItems: "center",
                    background: activeRoute == i ? "#e9ecf1" : "#fff",
                    py: "30px",
                    borderTopLeftRadius: activeRoute == i ? "26px" : "none",
                    borderTopRightRadius:
                      activeRoute == i - 1 ? "26px" : "none",
                    borderBottomLeftRadius: activeRoute == i ? "26px" : "none",
                    borderBottomRightRadius:
                      activeRoute == i + 1 ? " 26px" : "none",
                    transition:
                      "border 0.5s, background 0.5s, border-radius 0.5s",
                    "#icon": {
                      transform: activeRoute == i ? "scale(1.2)" : "none",
                    },
                  }}
                >
                  {i == 0 || i == navItem.length - 1 ? (
                    <Flex height="22px" width="22px" />
                  ) : (
                    <Icon
                      as={item.icon}
                      boxSize="22px"
                      id="icon"
                      sx={{ transition: "transform 0.5s" }}
                    />
                  )}
                </Flex>
              </Tooltip>
            );
          })}
        </Flex>
      </Flex>
      <Tooltip
        label="Logout"
        placement="right"
        sx={{ p: "10px", fontSize: 13, px: "20px" }}
      >
        <Flex
          onClick={() => {
            AuthTokenService.clear();
            navigate("/logout");
          }}
          sx={{
            height: "80px",
            justifyContent: "center",
            cursor: "pointer",
            alignItems: "center",
            "&:hover": {
              "#icon": {
                transform: "scale(1.2)",
              },
            },
          }}
        >
          <Icon
            as={FiLogOut}
            boxSize="22px"
            id="icon"
            sx={{ transition: "transform 0.5s" }}
          />
        </Flex>
      </Tooltip>
    </Flex>
  );
};
