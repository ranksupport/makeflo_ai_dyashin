import {
  CircularProgress,
  Flex,
  Icon,
  IconButton,
  Image,
  Input,
  InputGroup,
  Avatar as CAvatar,
  InputRightElement,
  Wrap,
  Tooltip,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  Select,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import { RiAccountBoxFill } from "react-icons/ri";
import { MdOutlineCancel, MdPayments } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { setActiveAccNav } from "../../store/slices/shellSlice";
import { TbArrowBadgeRightFilled } from "react-icons/tb";
import { Outlet, useNavigate } from "react-router-dom";
import { RiProfileLine } from "react-icons/ri";
import {
  fetchAgencyMemberList,
  fetchMemberList,
  getProfile,
  updatePassword,
  updateProfile,
  updateProfileAvatarPost,
} from "../../store/thunk/accountThunk";
import {
  changeEditableData,
} from "../../store/slices/accountSlice";
import ReactSelect from "react-select";
import { selectStyle } from "../../components/node/ui/configuration";
import { CgPassword } from "react-icons/cg";
import { AiFillPicture } from "react-icons/ai";
import { RiLockPasswordFill } from "react-icons/ri";
import { MdOutlineCloudUpload } from "react-icons/md";
import {  IoMdRemoveCircleOutline } from "react-icons/io";
import { RxAvatar } from "react-icons/rx";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { MdLockPerson } from "react-icons/md";
import { FaUsersBetweenLines } from "react-icons/fa6";
import { CgCarousel } from "react-icons/cg";
import { FaUsers } from "react-icons/fa";
import { LuUserPlus2 } from "react-icons/lu";
import { MdEditNote } from "react-icons/md";
import { MdPlaylistRemove } from "react-icons/md";
const accountNavItems = [
  {
    icon: RiAccountBoxFill,
    route: "/account/profile",
    label: "Profile",
  },
  {
    icon: AiFillPicture,
    route: "/account/avatar",
    label: "Avatar",
  },
  {
    icon: CgPassword,
    route: "/account/password",
    label: "Password",
  },
  {
    icon: FaUsersBetweenLines,
    route: "/account/members",
    label: "Members",
  },
  {
    icon: MdPayments,
    route: "/account/subscription",
    label: "Billing & Usage",
  },
];

export const Account = () => {
  const activeRoute = useSelector((state) => state.shell.account_nav);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    accountNavItems.map((item, i) => {
      if (item.route === location.pathname) {
        dispatch(setActiveAccNav(i));
      }
    });
  }, []);
  return (
    <Flex
      sx={{
        width: "100%",
        height: "100%",
        borderRadius: "12px",
        bgColor: "#fff",
        boxShadow: "lg",
      }}
    >
      <Flex
        sx={{
          width: "350px",
          bgColor: "#fff",
          p: "20px 0px 20px 0px",
          borderBottomLeftRadius: "12px",
          borderTopLeftRadius: "12px",
          height: "100%",
          flexDir: "column",
          gap: "60px",
          borderRight: "2px solid #e9ecf0",
        }}
      >
        <Flex sx={{ width: "100%" }}>
          <Flex
            sx={{
              width: "100%",
              alignItems: "center",
              bgColor: "#e9ecf1",
              borderBottom: "1px solid black",
              p: "10px",
              gap: "10px",
              fontWeight: 600,
            }}
          >
            <Icon
              as={TbArrowBadgeRightFilled}
              boxSize="36px"
              id="icon"
              sx={{
                m: "auto 0px",
              }}
            />
            Manage Account
          </Flex>
        </Flex>
        <Flex
          sx={{
            // gap: "20px",
            flexDir: "column",
            justifyContent: "center",
            pl: "35px",
          }}
        >
          {accountNavItems.map((item, i) => {
            return (
              <Flex
                key={i}
                onClick={() => {
                  navigate(item.route);
                  dispatch(setActiveAccNav(i));
                }}
                sx={{
                  cursor: "pointer",
                  alignItems: "center",
                  background: activeRoute == i ? "#e9ecf1" : "#fff",
                  p: "15px 20px",
                  gap: "20px",
                  borderTopLeftRadius: activeRoute == i ? "26px" : "none",
                  borderBottomLeftRadius: activeRoute == i ? "26px" : "none",
                  transition:
                    "border 0.5s, background 0.5s, border-radius 0.5s",
                  "#icon": {
                    transform: activeRoute == i ? "scale(1.2)" : "none",
                  },
                }}
              >
                <Icon
                  as={item.icon}
                  boxSize="26px"
                  id="icon"
                  sx={{
                    m: "auto 0px",
                    cursor: "pointer",
                  }}
                />
                {item.label}
              </Flex>
            );
          })}
        </Flex>
      </Flex>
      <Flex sx={{ width: "100%" }}>
        {/* This is where the nested route is getting rendered */}
        <Outlet />
      </Flex>
    </Flex>
  );
};

export const Profile = () => {
  const dispatch = useDispatch();
  const profileData = useSelector((state) => state.account.profileData);
  const editableProfile = useSelector((state) => state.account.editableProfile);
  const loading = useSelector((state) => state.account.loading);
  const toast = useToast();
  return (
    <Flex
      sx={{
        p: "20px",
        width: "100%",
        position: "relative",
        height: "100%",
        alignItems: "flex-start",
        gap: "20px",
        flexDir: "column",
      }}
    >
      <Flex
        sx={{
          width: "100%",
          alignItems: "center",
          borderBottom: "1px solid black",
          p: "1px 10px 10px 10px",
          gap: "10px",
          fontSize: 30,
          fontWeight: 600,
        }}
      >
        <Icon
          as={RiProfileLine}
          boxSize="40px"
          id="icon"
          sx={{
            m: "auto 0px",
          }}
        />
        My Profile
      </Flex>
      <Flex sx={{ position: "relative", width: "100%", height: "100%" }}>
        <Flex
          sx={{
            position: "absolute",
            top: "0px",
            left: "0px",
            bottom: "0px",
            right: "0px",
            pl: "20px",
            overflow: "auto",
            flexDir: "column",
            gap: "10px",
            // alignItems: loading ? "center" : "flex-start",
          }}
        >
          {loading ? (
            <CircularProgress
              isIndeterminate
              color="#33455b"
              size="50px"
              sx={{ m: "auto" }}
            />
          ) : (
            <>
              {editableProfile.map((item, i) => {
                return (
                  <Flex key={i} sx={{ gap: "20px", alignItems: "center" }}>
                    <Flex sx={{ width: "200px" }}>{item.label}</Flex>
                    {item.options.length > 0 ? (
                      <Flex sx={{ width: "500px" }}>
                        <ReactSelect
                          options={item.options}
                          styles={selectStyle}
                          value={
                            item.selectedOption
                              ? item.selectedOption
                              : {
                                  id: item.value,
                                  label: item.value,
                                  value: item.value,
                                }
                          }
                          onChange={(e) =>
                            dispatch(
                              changeEditableData({
                                key: item.key,
                                value: e,
                              })
                            )
                          }
                          placeholder={
                            item.key == "country"
                              ? "Choose Country"
                              : "Choose Time Zone"
                          }
                        />{" "}
                      </Flex>
                    ) : (
                      <Input
                        value={item.value || ""}
                        sx={{ width: "500px" }}
                        placeholder={item.label}
                        isDisabled={item.key == "email" ? true : false}
                        onChange={(e) =>
                          dispatch(
                            changeEditableData({
                              key: item.key,
                              value: e.target.value,
                            })
                          )
                        }
                      />
                    )}
                  </Flex>
                );
              })}
              <Flex
                width="720px"
                sx={{ justifyContent: "flex-end", mt: "20px" }}
              >
                <Flex
                  onClick={() => {
                    dispatch(updateProfile()).then((res) => {
                      if (res.payload.key == "UPDATE_SUCCESS") {
                        toast({
                          position: "top",
                          status: "success",
                          variant: "solid",
                          title: res?.payload?.message,
                          duration: 2500,
                          containerStyle: {
                            fontWeight: 400,
                          },
                        });
                      }
                      dispatch(getProfile());
                    });
                  }}
                  sx={{
                    bgColor: "#edf2f6",
                    justifyContent: "center",
                    cursor: "pointer",
                    borderRadius: "6px",
                    border: "1px solid #33454e",
                    p: "10px",
                    fontSize: 15,
                    gap: "7px",
                    color: "#000",
                  }}
                >
                  <Icon
                    as={MdOutlineCloudUpload}
                    boxSize={"16px"}
                    sx={{
                      m: "auto 0px",
                      color: "#000",
                    }}
                  />
                  Save Changes
                </Flex>
              </Flex>
            </>
          )}
        </Flex>
      </Flex>
    </Flex>
  );
};

export const Avatar = () => {
  const dispatch = useDispatch();
  const fileRef = useRef();
  const loading = useSelector((state) => state.account.loading);
  const profileData = useSelector((state) => state.account.profileData);
  const toast = useToast();
  useEffect(() => {
    dispatch(getProfile());
  }, []);
  const removeImage = () => {
    const formData = new FormData();
    formData.append("image", null);
    uploadImg(formData);
  };
  const fileUpload = (e) => {
    if (fileRef.current.files.length > 0) {
      const formData = new FormData();
      formData.append(
        "image",
        fileRef.current.files[0],
        fileRef.current.files[0].name
      );
      uploadImg(formData);
    } else
      toast({
        position: "top",
        status: "error",
        variant: "solid",
        title: "Select the image before uploading.",
        duration: 2500,
        containerStyle: {
          fontWeight: 400,
        },
      });
  };
  const uploadImg = (data) => {
    dispatch(updateProfileAvatarPost(data)).then((res) => {
      if (res.payload.key == "UPDATE_SUCCESS") {
        toast({
          position: "top",
          status: "success",
          variant: "solid",
          title: res.payload.message,
          duration: 2500,
          containerStyle: {
            fontWeight: 400,
          },
        });
      }
      dispatch(getProfile());
    });
  };
  return (
    <Flex
      sx={{
        p: "20px",
        width: "100%",
        position: "relative",
        height: "100%",
        alignItems: "flex-start",
        gap: "20px",
        flexDir: "column",
      }}
    >
      <Flex
        sx={{
          width: "100%",
          alignItems: "center",
          borderBottom: "1px solid black",
          p: "1px 10px 10px 10px",
          gap: "10px",
          fontSize: 30,
          fontWeight: 600,
        }}
      >
        <Icon
          as={RxAvatar}
          boxSize="40px"
          id="icon"
          sx={{
            m: "auto 0px",
          }}
        />
        Profile Avatar
      </Flex>
      <Flex sx={{ position: "relative", width: "100%", height: "100%" }}>
        <Flex
          sx={{
            position: "absolute",
            top: "0px",
            left: "0px",
            bottom: "0px",
            right: "0px",
            pl: "20px",
            overflow: "auto",
            flexDir: "column",
            gap: "10px",
            // alignItems: loading ? "center" : "flex-start",
          }}
        >
          {loading ? (
            <CircularProgress
              isIndeterminate
              color="#33455b"
              size="50px"
              sx={{ m: "auto" }}
            />
          ) : (
            <Flex sx={{ gap: "20px" }}>
              <Flex
                sx={{
                  width: "300px",
                  height: "300px",
                  borderRadius: "8px",
                  border: "4px solid #33455b",
                }}
              >
                <Image
                  src={
                    !profileData.image_url.includes("/missing")
                      ? profileData.image_url
                      : "https://www.iconpacks.net/icons/2/free-user-icon-3296-thumb.png"
                  }
                  sx={{ borderRadius: "4px" }}
                  alt="Avatar"
                />
              </Flex>
              <Flex sx={{ flexDir: "column", gap: "20px" }}>
                <Input
                  accept="image/*"
                  ref={fileRef}
                  type="file"
                  name="image"
                  sx={{ p: "15px 20px", width: "500px", height: "60px" }}
                />
                <Flex
                  width="100%"
                  sx={{
                    justifyContent: "flex-end",
                    mt: "20px",
                    flexDir: "column",
                    gap: "20px",
                    alignItems: "flex-end",
                  }}
                >
                  <Flex
                    onClick={fileUpload}
                    width="300px"
                    sx={{
                      bgColor: "#edf2f6",
                      justifyContent: "center",
                      cursor: "pointer",
                      borderRadius: "6px",
                      border: "1px solid #33454e",
                      p: "10px",
                      fontSize: 15,
                      gap: "7px",
                      color: "#000",
                    }}
                  >
                    <Icon
                      as={MdOutlineCloudUpload}
                      boxSize={"16px"}
                      sx={{
                        m: "auto 0px",
                        color: "#000",
                      }}
                    />
                    Upload
                  </Flex>
                  <Flex
                    width="300px"
                    onClick={removeImage}
                    sx={{
                      bgColor: "#bac5cc",
                      justifyContent: "center",
                      cursor: "pointer",
                      border: "1px solid #33454e",
                      p: "10px",
                      fontSize: 15,
                      borderRadius: "6px",
                      gap: "7px",
                      color: "#000",
                    }}
                  >
                    <Icon
                      as={IoMdRemoveCircleOutline}
                      boxSize={"16px"}
                      sx={{
                        m: "auto 0px",
                        color: "#000",
                      }}
                    />
                    Remove Picture
                  </Flex>
                </Flex>
              </Flex>
            </Flex>
          )}
        </Flex>
      </Flex>
    </Flex>
  );
};

export const Password = () => {
  const dispatch = useDispatch();
  const toast = useToast();
  const [passwordState, setPasswordState] = useState({
    current_password: "",
    password: "",
    password_confirmation: "",
  });
  const PasswordInput = ({ password, setPasswordState, placeholder, id }) => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };

    return (
      <InputGroup sx={{ width: "500px" }}>
        <Input
          pr="4.5rem" // Padding right to accommodate the eye icon button
          type={showPassword ? "text" : "password"} // Toggle input type based on showPassword state
          placeholder={placeholder}
          value={password || ""}
          onChange={(e) =>
            setPasswordState((c) => ({ ...c, [id]: e.target.value }))
          }
        />
        <InputRightElement width="4.5rem">
          <IconButton
            h="1.75rem"
            size="sm"
            variant="ghost"
            colorScheme="black"
            onClick={togglePasswordVisibility}
            icon={showPassword ? <FaEyeSlash /> : <FaEye />}
          />
        </InputRightElement>
      </InputGroup>
    );
  };
  return (
    <Flex
      sx={{
        p: "20px",
        width: "100%",
        position: "relative",
        height: "100%",
        alignItems: "flex-start",
        gap: "20px",
        flexDir: "column",
      }}
    >
      <Flex
        sx={{
          width: "100%",
          alignItems: "center",
          borderBottom: "1px solid black",
          p: "1px 10px 10px 10px",
          gap: "10px",
          fontSize: 30,
          fontWeight: 600,
        }}
      >
        <Icon
          as={RiLockPasswordFill}
          boxSize="40px"
          id="icon"
          sx={{
            m: "auto 0px",
          }}
        />
        Configure Password
      </Flex>
      <Flex sx={{ position: "relative", width: "100%", height: "100%" }}>
        <Flex
          sx={{
            position: "absolute",
            top: "0px",
            left: "0px",
            bottom: "0px",
            right: "0px",
            pl: "20px",
            overflow: "auto",
            flexDir: "column",
            gap: "10px",
            // alignItems: loading ? "center" : "flex-start",
          }}
        >
          <Flex sx={{ gap: "20px", alignItems: "center" }}>
            <Flex sx={{ width: "200px" }}>Current Password</Flex>
            <PasswordInput
              placeholder="Enter the current Password"
              password={passwordState?.current_password || ""}
              setPasswordState={setPasswordState}
              id="current_password"
            />
          </Flex>
          <Flex sx={{ gap: "20px", alignItems: "center" }}>
            <Flex sx={{ width: "200px" }}>New Password</Flex>
            <PasswordInput
              placeholder="Enter the new Password"
              password={passwordState?.password || ""}
              setPasswordState={setPasswordState}
              id="password"
            />{" "}
          </Flex>
          <Flex sx={{ gap: "20px", alignItems: "center" }}>
            <Flex sx={{ width: "200px" }}>Confirm Password</Flex>
            <PasswordInput
              placeholder="Renter the new Password"
              password={passwordState?.password_confirmation || ""}
              setPasswordState={setPasswordState}
              id="password_confirmation"
            />{" "}
          </Flex>
          <Flex width="720px" sx={{ justifyContent: "flex-end", mt: "20px" }}>
            <Flex
              onClick={() =>
                dispatch(updatePassword(passwordState)).then((res) => {
                  toast({
                    position: "top",
                    status:
                      res.payload.key == "UPDATE_SUCCESS" ? "success" : "error",
                    variant: "solid",
                    title: res?.payload?.message,
                    duration: 2500,
                    containerStyle: {
                      fontWeight: 400,
                    },
                  });
                })
              }
              sx={{
                bgColor: "#edf2f6",
                justifyContent: "center",
                cursor: "pointer",
                borderRadius: "6px",
                border: "1px solid #33454e",
                p: "10px",
                fontSize: 15,
                gap: "7px",
                color: "#000",
              }}
            >
              <Icon
                as={MdOutlineCloudUpload}
                boxSize={"16px"}
                sx={{
                  m: "auto 0px",
                  color: "#000",
                }}
              />
              Save Changes
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

export const AccMembers = () => {
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.account.loading);
  const profileData = useSelector((state) => state.account.profileData);
  const teamData = useSelector((state) => state.account.teamData);
  const agencyData = useSelector((state) => state.account.agencyData);
  const [editData, setEditData] = useState();
  useEffect(() => {
    if (profileData.current_plan == "Team") dispatch(fetchMemberList());
    if (profileData.current_plan == "Agency") dispatch(fetchAgencyMemberList());
  }, [profileData]);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const AccountView = ({ userData }) => {
    const [data, setData] = useState(userData);
    return (
      <Modal onClose={onClose} isOpen={isOpen} isCentered size="xl">
        <ModalOverlay sx={{ background: "rgb(0,0,0, 0.2)" }} />
        <ModalContent sx={{ gap: "20px" }}>
          <Flex
            sx={{
              width: "100%",
              borderBottom: "1.5px solid #343a45",
              p: "20px 20px 5px 20px",
              fontSize: 20,
            }}
          >
            {data?.new ? "New Account" : "Edit Account"}
          </Flex>
          <Flex sx={{ flexDir: "column", gap: "10px", p: "20px" }}>
            <Flex sx={{ alignItems: "center", gap: "10px" }}>
              <Flex sx={{ width: "150px" }}>First Name</Flex>
              <Input
                value={data.first_name || ""}
                placeholder="First Name"
                onChange={(e) =>
                  setData((c) => ({ ...c, first_name: e.target.value }))
                }
              />
            </Flex>
            <Flex sx={{ alignItems: "center", gap: "10px" }}>
              <Flex sx={{ width: "150px" }}>Last Name</Flex>
              <Input
                value={data.last_name || ""}
                placeholder="Last Name"
                onChange={(e) =>
                  setData((c) => ({ ...c, last_name: e.target.value }))
                }
              />
            </Flex>
            <Flex sx={{ alignItems: "center", gap: "10px" }}>
              <Flex sx={{ width: "150px" }}>Email Address</Flex>
              <Input
                value={data.email || ""}
                placeholder="Email Address"
                onChange={(e) =>
                  setData((c) => ({ ...c, email: e.target.value }))
                }
              />
            </Flex>
            <Flex sx={{ alignItems: "center", gap: "10px" }}>
              {profileData.current_plan == "Team" ? (
                <>
                  <Flex sx={{ width: "150px" }}>Access Role</Flex>
                  <Select
                    onChange={(e) => {
                      setData((c) => ({ ...c, access: e.target.value }));
                    }}
                    value={data.access}
                  >
                    <option value="Create">Create</option>
                    <option value="Create/Delete">Create/Delete</option>
                    <option value="FULL">FULL</option>
                  </Select>
                </>
              ) : (
                <>
                  <Flex sx={{ width: "150px" }}>Task Assigned</Flex>
                  <Input
                    value={data.task || ""}
                    placeholder="Task Assigned"
                    onChange={(e) =>
                      setData((c) => ({ ...c, task: e.target.value }))
                    }
                  />
                </>
              )}
            </Flex>
          </Flex>
          <Flex p="0px 20px 20px 20px">
            <Flex
              width="100%"
              sx={{
                border: "1px solid #33454e",
                borderBottomLeftRadius: "6px",
                borderBottomRightRadius: "6px",
              }}
            >
              <Flex
                width="50%"
                sx={{
                  bgColor: "#edf2f6",
                  justifyContent: "center",
                  cursor: "pointer",
                  borderBottomLeftRadius: "6px",
                  p: "10px",
                  fontSize: 15,
                  gap: "7px",
                  color: "#000",
                }}
              >
                <Icon
                  as={MdOutlineCloudUpload}
                  boxSize={"16px"}
                  sx={{
                    m: "auto 0px",
                    color: "#000",
                  }}
                />
                Submit
              </Flex>
              <Flex
                onClick={onClose}
                width="50%"
                sx={{
                  bgColor: "#bac5cc",
                  justifyContent: "center",
                  cursor: "pointer",
                  p: "10px",
                  fontSize: 15,
                  borderBottomRightRadius: "6px",
                  gap: "7px",
                  color: "#000",
                }}
              >
                <Icon
                  as={MdOutlineCancel}
                  boxSize={"16px"}
                  sx={{
                    m: "auto 0px",
                    color: "#000",
                  }}
                />
                Cancel
              </Flex>
            </Flex>
          </Flex>
        </ModalContent>
      </Modal>
    );
  };

  return profileData.current_plan == "Team" ? (
    <Flex
      sx={{
        p: "20px",
        width: "100%",
        position: "relative",
        height: "100%",
        alignItems: "flex-start",
        gap: "20px",
        flexDir: "column",
      }}
    >
      <Flex
        sx={{
          width: "100%",
          alignItems: "center",
          borderBottom: "1px solid black",
          p: "1px 10px 10px 10px",
          gap: "10px",
          fontSize: 30,
          fontWeight: 600,
        }}
      >
        <Icon
          as={FaUsers}
          boxSize="40px"
          id="icon"
          sx={{
            m: "auto 0px",
          }}
        />
        Members - {profileData.current_plan}
      </Flex>
      <Flex sx={{ position: "relative", width: "100%", height: "100%" }}>
        <Flex
          sx={{
            position: "absolute",
            top: "0px",
            left: "0px",
            bottom: "0px",
            right: "0px",
            px: "20px",
            overflow: "auto",
            flexDir: "column",
            gap: "10px",
            // alignItems: loading ? "center" : "flex-start",
          }}
        >
          {loading ? (
            <CircularProgress
              isIndeterminate
              color="#33455b"
              size="50px"
              sx={{ m: "auto" }}
            />
          ) : profileData.current_plan != "Team" &&
            profileData.current_plan != "Agency" ? (
            <Flex
              sx={{
                p: "20px 20px 20px 20px",
                boxShadow: "md",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Flex
                sx={{
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "20px",
                  flexDir: "column",
                }}
              >
                <Icon
                  as={MdLockPerson}
                  boxSize="26px"
                  id="icon"
                  sx={{
                    m: "auto 0px",
                  }}
                />
                <Flex>
                  This feature is not available for{" "}
                  <a style={{ color: "#0285ff", paddingLeft: "4px" }}>
                    {profileData.current_plan}
                  </a>
                </Flex>
              </Flex>
            </Flex>
          ) : (
            <Flex
              sx={{
                width: "100%",
                flexDir: "column",
                gap: "20px",
                height: "100%",
              }}
            >
              <Flex
                sx={{
                  width: "100%",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Flex>Total Team Accounts: {teamData.length}</Flex>
                <Flex
                  onClick={() => {
                    setEditData({
                      first_name: "",
                      last_name: "",
                      email: "",
                      access: "",
                      new: true,
                    });
                    onOpen();
                  }}
                  sx={{
                    bgColor: "#edf2f6",
                    justifyContent: "center",
                    cursor: "pointer",
                    borderRadius: "6px",
                    border: "1px solid #33454e",
                    p: "10px 20px",
                    fontSize: 15,
                    gap: "7px",
                    color: "#000",
                  }}
                >
                  <Icon
                    as={LuUserPlus2}
                    boxSize={"16px"}
                    sx={{
                      m: "auto 0px",
                      color: "#000",
                    }}
                  />
                  Add Account
                </Flex>
              </Flex>
              <Flex
                sx={{ width: "100%", height: "100%", position: "relative" }}
              >
                <Flex
                  sx={{
                    position: "absolute",
                    height: "100%",
                    right: 0,
                    left: 0,
                    top: 0,
                    bottom: 0,
                    overflowY: "auto",
                    flexWrap: "wrap",
                    rowGap: "10px",
                    width: "100%",
                  }}
                >
                  <Wrap
                    sx={{
                      ".chakra-wrap__list": {
                        gap: "0px",
                      },
                    }}
                    width="100%"
                  >
                    {teamData.map((user, i) => {
                      return (
                        <Flex
                          key={i}
                          width={"50%"}
                          p={2}
                          sx={{
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          <Flex
                            sx={{
                              alignItems: "center",
                              gap: "8px",
                              justifyContent: "space-between",
                              width: "100%",
                              p: "10px",
                              borderRadius: "6px",
                              boxShadow: "md",
                              "&:hover": {},
                            }}
                          >
                            <Flex sx={{ alignItems: "center", gap: "8px" }}>
                              <CAvatar
                                name={user.name}
                                sx={{ border: "1px solid black" }}
                              />
                              <Flex sx={{ flexDir: "column", gap: "5px" }}>
                                {" "}
                                <Flex> {user.name} </Flex>{" "}
                                <Flex sx={{ fontSize: 13 }}>
                                  {" "}
                                  {user.email}{" "}
                                </Flex>
                              </Flex>
                            </Flex>
                            <Flex sx={{ gap: "10px" }}>
                              <Tooltip placement="bottom" label="Edit Account">
                                <Flex
                                  onClick={() => {
                                    onOpen();
                                    setEditData({ ...user, new: false });
                                  }}
                                  sx={{ p: "5px", cursor: "pointer" }}
                                >
                                  <Icon
                                    as={MdEditNote}
                                    boxSize="26px"
                                    id="icon"
                                    sx={{
                                      m: "auto 0px",
                                    }}
                                  />
                                </Flex>
                              </Tooltip>
                              <Tooltip
                                placement="bottom"
                                label="Delete Account"
                              >
                                <Flex sx={{ p: "5px", cursor: "pointer" }}>
                                  <Icon
                                    as={MdPlaylistRemove}
                                    boxSize="26px"
                                    id="icon"
                                    sx={{
                                      m: "auto 0px",
                                    }}
                                  />
                                </Flex>
                              </Tooltip>
                            </Flex>
                          </Flex>{" "}
                        </Flex>
                      );
                    })}
                  </Wrap>
                </Flex>
              </Flex>
            </Flex>
          )}
        </Flex>
      </Flex>{" "}
      {isOpen ? <AccountView userData={editData} /> : null}
    </Flex>
  ) : (
    <Flex
      sx={{
        p: "20px",
        width: "100%",
        position: "relative",
        height: "100%",
        alignItems: "flex-start",
        gap: "20px",
        flexDir: "column",
      }}
    >
      <Flex
        sx={{
          width: "100%",
          alignItems: "center",
          borderBottom: "1px solid black",
          p: "1px 10px 10px 10px",
          gap: "10px",
          fontSize: 30,
          fontWeight: 600,
        }}
      >
        <Icon
          as={FaUsers}
          boxSize="40px"
          id="icon"
          sx={{
            m: "auto 0px",
          }}
        />
        Members - {profileData.current_plan}
      </Flex>
      <Flex sx={{ position: "relative", width: "100%", height: "100%" }}>
        <Flex
          sx={{
            position: "absolute",
            top: "0px",
            left: "0px",
            bottom: "0px",
            right: "0px",
            px: "20px",
            overflow: "auto",
            flexDir: "column",
            gap: "10px",
            // alignItems: loading ? "center" : "flex-start",
          }}
        >
          {loading ? (
            <CircularProgress
              isIndeterminate
              color="#33455b"
              size="50px"
              sx={{ m: "auto" }}
            />
          ) : profileData.current_plan != "Team" &&
            profileData.current_plan != "Agency" ? (
            <Flex
              sx={{
                p: "20px 20px 20px 20px",
                boxShadow: "md",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Flex
                sx={{
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "20px",
                  flexDir: "column",
                }}
              >
                <Icon
                  as={MdLockPerson}
                  boxSize="26px"
                  id="icon"
                  sx={{
                    m: "auto 0px",
                  }}
                />
                <Flex>
                  This feature is not available for{" "}
                  <a style={{ color: "#0285ff", paddingLeft: "4px" }}>
                    {profileData.current_plan}
                  </a>
                </Flex>
              </Flex>
            </Flex>
          ) : (
            <Flex
              sx={{
                width: "100%",
                flexDir: "column",
                gap: "20px",
                height: "100%",
              }}
            >
              <Flex
                sx={{
                  width: "100%",
                  bgColor: "#E7EBF0",
                  borderRadius: "8px",
                  p: "20px 20px",
                  boxShadow: "md",
                  justifyContent: "space-between",
                }}
              >
                <Flex>Total Tasks: {agencyData.total_tasks}</Flex>{" "}
                <Flex>Tasks Consumed: {agencyData.task_consumed}</Flex>{" "}
                <Flex>
                  Total Sub-Accounts: {agencyData.total_subaccounts}/
                  {agencyData.allowed_subaccount_limit}
                </Flex>
              </Flex>
              <Flex
                sx={{
                  width: "100%",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Flex>
                  Total Sub Accounts: {agencyData?.sub_accounts?.length}
                </Flex>
                <Flex
                  onClick={() => {
                    setEditData({
                      first_name: "",
                      last_name: "",
                      email: "",
                      access: "",
                      new: true,
                    });
                    onOpen();
                  }}
                  sx={{
                    bgColor: "#edf2f6",
                    justifyContent: "center",
                    cursor: "pointer",
                    borderRadius: "6px",
                    border: "1px solid #33454e",
                    p: "10px 20px",
                    fontSize: 15,
                    gap: "7px",
                    color: "#000",
                  }}
                >
                  <Icon
                    as={LuUserPlus2}
                    boxSize={"16px"}
                    sx={{
                      m: "auto 0px",
                      color: "#000",
                    }}
                  />
                  Add Account
                </Flex>
              </Flex>
              <Flex
                sx={{ width: "100%", height: "100%", position: "relative" }}
              >
                <Flex
                  sx={{
                    position: "absolute",
                    height: "100%",
                    right: 0,
                    left: 0,
                    top: 0,
                    bottom: 0,
                    overflowY: "auto",
                    flexWrap: "wrap",
                    rowGap: "10px",
                    width: "100%",
                  }}
                >
                  <Wrap
                    sx={{
                      ".chakra-wrap__list": {
                        gap: "0px",
                      },
                    }}
                    width="100%"
                  >
                    {agencyData?.sub_accounts?.map((user, i) => {
                      return (
                        <Flex key={i} width={"50%"} p={2}>
                          <Flex
                            sx={{
                              flexDir: "column",
                              alignItems: "center",
                              justifyContent: "space-between",
                              width: "100%",
                              p: "10px",
                              borderRadius: "6px",
                              boxShadow: "md",
                              gap: "10px",
                            }}
                          >
                            <Flex
                              sx={{
                                alignItems: "center",
                                gap: "8px",
                                justifyContent: "space-between",
                                width: "100%",
                              }}
                            >
                              <Flex sx={{ alignItems: "center", gap: "8px" }}>
                                <CAvatar
                                  name={user.name}
                                  sx={{ border: "1px solid black" }}
                                />
                                <Flex sx={{ flexDir: "column", gap: "5px" }}>
                                  {" "}
                                  <Flex> {user.name} </Flex>{" "}
                                  <Flex sx={{ fontSize: 13 }}>
                                    {" "}
                                    {user.email}{" "}
                                  </Flex>
                                </Flex>
                              </Flex>
                              <Flex sx={{ gap: "10px" }}>
                                <Tooltip
                                  placement="bottom"
                                  label="Edit Account"
                                >
                                  <Flex
                                    onClick={() => {
                                      onOpen();
                                      setEditData({ ...user, new: false });
                                    }}
                                    sx={{ p: "5px", cursor: "pointer" }}
                                  >
                                    <Icon
                                      as={MdEditNote}
                                      boxSize="26px"
                                      id="icon"
                                      sx={{
                                        m: "auto 0px",
                                      }}
                                    />
                                  </Flex>
                                </Tooltip>
                                <Tooltip
                                  placement="bottom"
                                  label="Delete Account"
                                >
                                  <Flex sx={{ p: "5px", cursor: "pointer" }}>
                                    <Icon
                                      as={MdPlaylistRemove}
                                      boxSize="26px"
                                      id="icon"
                                      sx={{
                                        m: "auto 0px",
                                      }}
                                    />
                                  </Flex>
                                </Tooltip>
                              </Flex>
                            </Flex>
                            <Flex
                              width="100%"
                              sx={{
                                justifyContent: "space-between",
                                fontSize: 12,
                                pr: "40px",
                                pl: "10px",
                              }}
                            >
                              <Flex>Tasks Assigned: {user.task}</Flex>{" "}
                              <Flex>Tasks Consumed: {user.task_consumed}</Flex>{" "}
                              <Flex>
                                Tasks Remaining:{" "}
                                {user.task - user.task_consumed}
                              </Flex>
                            </Flex>
                          </Flex>
                        </Flex>
                      );
                    })}
                  </Wrap>
                </Flex>
              </Flex>
            </Flex>
          )}
        </Flex>
      </Flex>{" "}
      {isOpen ? <AccountView userData={editData} /> : null}
    </Flex>
  );
};

export const Billing = () => {
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.account.loading);
  const profileData = useSelector((state) => state.account.profileData);
  const [passwordState, setPasswordState] = useState({
    current_password: "",
    password: "",
    password_confirmation: "",
  });
  return (
    <Flex
      sx={{
        p: "20px",
        width: "100%",
        position: "relative",
        height: "100%",
        alignItems: "flex-start",
        gap: "20px",
        flexDir: "column",
      }}
    >
      <Flex
        sx={{
          width: "100%",
          alignItems: "center",
          borderBottom: "1px solid black",
          p: "1px 10px 10px 10px",
          gap: "10px",
          fontSize: 30,
          fontWeight: 600,
        }}
      >
        <Icon
          as={CgCarousel}
          boxSize="40px"
          id="icon"
          sx={{
            m: "auto 0px",
          }}
        />
        Billing and Usage
      </Flex>
      <Flex sx={{ position: "relative", width: "100%", height: "100%" }}>
        <Flex
          sx={{
            position: "absolute",
            top: "0px",
            left: "0px",
            bottom: "0px",
            right: "0px",
            p: "20px",
            overflow: "auto",
            flexDir: "column",
            gap: "10px",
            // alignItems: loading ? "center" : "flex-start",
          }}
        >
          {loading ? (
            <CircularProgress
              isIndeterminate
              color="#33455b"
              size="50px"
              sx={{ m: "auto" }}
            />
          ) : profileData.current_plan != "Team" ? (
            <Flex
              sx={{
                p: "20px 20px 20px 20px",
                boxShadow: "md",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {profileData.current_plan}
            </Flex>
          ) : (
            <>Complete</>
          )}
        </Flex>
      </Flex>
    </Flex>
  );
};
