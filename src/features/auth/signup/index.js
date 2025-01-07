import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import {  userExist, userSignup } from "../../../store/thunk/authThunk";
import { FaUserEdit } from "react-icons/fa";
import { MdMarkEmailUnread } from "react-icons/md";
import {
  Button,
  Flex,
  FormControl,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  useToast,
} from "@chakra-ui/react";
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";

export const SignupContainer = ({}) => {
  const loading = useSelector((state) => state.auth.loading);
  const [view, setView] = useState("verify");
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const toast = useToast();
  const formik = useFormik({
    initialValues: {
      email: email,
      first_name: "",
      last_name: "",
      password: "",
      is_admin: false,
      password_confirmation: "",
    },
    onSubmit: (values) => {
      handleSubmit();
    },
  });
  const handleSubmit = async () => {
    const payload =
      view == "verify"
        ? {
            email: formik.values.email,
          }
        : {
            email: email,
            first_name: formik.values.first_name,
            last_name: formik.values.last_name,
            password: formik.values.password,
            is_admin: false,
            password_confirmation: formik.values.password_confirmation,
          };
    if (view == "verify") {
      dispatch(userExist(payload)).then((res) => {
        if (!res.error) {
          if (res.payload.key === "USER_EXISTS") {
            toast({
              position: "top",
              status: "error",
              variant: "solid",
              title: "E-mail address already in use.",
              duration: 2500,
              containerStyle: {
                fontWeight: "300 !important",
              },
            });
          } else if (res.payload.key === "NO_USER") {
            setEmail(formik.values.email);
            setView("verified");
          }
        }
      });
    } else {
      if (payload.password === payload.password_confirmation) {
        dispatch(userSignup(payload)).then((res) => {
          if (!res.error) {
            if (res.payload.key === "SIGNUP_SUCCESS") {
              setView("signed-up");
            } else {
              toast({
                position: "top",
                status: "error",
                variant: "solid",
                title: "Something went wrong!",
                duration: 2500,
                containerStyle: {
                  fontWeight: "300 !important",
                },
              });
            }
          }
        });
      } else
        toast({
          position: "top",
          status: "error",
          variant: "solid",
          title: "Password do not match. Try again!",
          duration: 2500,
          containerStyle: {
            fontWeight: "300 !important",
          },
        });
    }
  };
  return view == "signed-up" ? (
    <Flex
      sx={{
        flexDir: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        pt: "30px",
        gap: "20px"
      }}
    >
      <Icon
        as={MdMarkEmailUnread}
        boxSize="50px"
        id="icon"
        sx={{
          m: "auto 0px",
          color:"#33445B"
        }}
      />
      We sent verification link on {email},<br /> verify your email address to
      continue.
    </Flex>
  ) : (
    <div>
      <form
        onSubmit={formik.handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 20,
          marginTop: "30px",
        }}
      >
        {" "}
        {view == "verify" ? (
          <>
            {" "}
            <FormControl>
              <InputGroup size="md">
                <InputLeftElement pointerEvents="none">
                  <Icon
                    as={MdEmail}
                    boxSize="0.9em"
                    id="icon"
                    sx={{
                      m: "auto 0px",
                    }}
                  />
                </InputLeftElement>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="Enter Email"
                  variant="outlined"
                  sx={{
                    fontSize: 16,
                    borderRadius: "none",
                    outline: "1px solid #33445B",
                    "&:focus-visible": {
                      outline: "2px solid #33445B",
                      border: "none !important",
                      boxShadow: "none",
                    },
                  }}
                  onChange={formik.handleChange}
                  value={formik.values.email}
                />
              </InputGroup>
            </FormControl>
            <Flex sx={{ gap: "20px", width: "100%" }}>
              <Button
                type="submit"
                sx={{
                  width: "100%",
                  bgColor: "#33445B",
                  color: "#fff",
                  borderRadius: "none",
                  fontWeight: 400,
                  boxShadow: "md",
                  "&:hover": {
                    bgColor: "#33445B",
                  },
                }}
              >
                {loading ? "Please Wait" : "Continue"}
              </Button>
            </Flex>
          </>
        ) : (
          <>
            {" "}
            <FormControl>
              <InputGroup size="md">
                <InputLeftElement pointerEvents="none">
                  <Icon
                    as={FaUserEdit}
                    boxSize="0.9em"
                    id="icon"
                    sx={{
                      m: "auto 0px",
                    }}
                  />
                </InputLeftElement>
                <Input
                  id="first_name"
                  name="first_name"
                  required
                  placeholder="Enter First Name"
                  variant="outlined"
                  sx={{
                    fontSize: 16,
                    borderRadius: "none",
                    outline: "1px solid #33445B",
                    "&:focus-visible": {
                      outline: "2px solid #33445B",
                      border: "none !important",
                      boxShadow: "none",
                    },
                  }}
                  onChange={formik.handleChange}
                  value={formik.values.first_name}
                />
              </InputGroup>
            </FormControl>{" "}
            <FormControl>
              <InputGroup size="md">
                <InputLeftElement pointerEvents="none">
                  <Icon
                    as={FaUserEdit}
                    boxSize="0.9em"
                    id="icon"
                    sx={{
                      m: "auto 0px",
                    }}
                  />
                </InputLeftElement>
                <Input
                  id="last_name"
                  name="last_name"
                  type="text"
                  required
                  placeholder="Enter Last Name"
                  variant="outlined"
                  sx={{
                    fontSize: 16,
                    borderRadius: "none",
                    outline: "1px solid #33445B",
                    "&:focus-visible": {
                      outline: "2px solid #33445B",
                      border: "none !important",
                      boxShadow: "none",
                    },
                  }}
                  onChange={formik.handleChange}
                  value={formik.values.last_name}
                />
              </InputGroup>
            </FormControl>{" "}
            <FormControl>
              <InputGroup size="md">
                <InputLeftElement pointerEvents="none">
                  <Icon
                    as={RiLockPasswordFill}
                    boxSize="0.9em"
                    id="icon"
                    sx={{
                      m: "auto 0px",
                    }}
                  />
                </InputLeftElement>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  placeholder="Enter Password"
                  variant="outlined"
                  sx={{
                    fontSize: 16,
                    borderRadius: "none",
                    outline: "1px solid #33445B",
                    "&:focus-visible": {
                      outline: "2px solid #33445B",
                      border: "none !important",
                      boxShadow: "none",
                    },
                  }}
                  onChange={formik.handleChange}
                  value={formik.values.password}
                />
              </InputGroup>
            </FormControl>{" "}
            <FormControl>
              <InputGroup size="md">
                <InputLeftElement pointerEvents="none">
                  <Icon
                    as={RiLockPasswordFill}
                    boxSize="0.9em"
                    id="icon"
                    sx={{
                      m: "auto 0px",
                    }}
                  />
                </InputLeftElement>
                <Input
                  id="password_confirmation"
                  name="password_confirmation"
                  type="password"
                  required
                  placeholder="Confirm Password"
                  variant="outlined"
                  sx={{
                    fontSize: 16,
                    borderRadius: "none",
                    outline: "1px solid #33445B",
                    "&:focus-visible": {
                      outline: "2px solid #33445B",
                      border: "none !important",
                      boxShadow: "none",
                    },
                  }}
                  onChange={formik.handleChange}
                  value={formik.values.password_confirmation}
                />
              </InputGroup>
            </FormControl>
            <Flex sx={{ gap: "20px", width: "100%" }}>
              <Button
                type="submit"
                sx={{
                  width: "100%",
                  bgColor: "#33445B",
                  color: "#fff",
                  borderRadius: "none",
                  fontWeight: 400,
                  boxShadow: "md",
                  "&:hover": {
                    bgColor: "#33445B",
                  },
                }}
              >
                {loading
                  ? "Please Wait"
                  : view == "verfied"
                  ? "Sign Up"
                  : "Continue"}
              </Button>
            </Flex>
          </>
        )}
      </form>
    </div>
  );
};
