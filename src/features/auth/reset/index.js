import React, { useState } from "react";
import {  useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import {
  userResetPassword,
} from "../../../store/thunk/authThunk";
import { useNavigate, useParams } from "react-router-dom";
import {
  Button,
  Flex,
  FormControl,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  useToast,
} from "@chakra-ui/react";
import { RiLockPasswordFill } from "react-icons/ri";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";

export const ResetContainer = ({}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loading = useSelector((state) => state.auth.loading);
  const toast = useToast();
  let { token } = useParams();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    onSubmit: (values) => {
      handleSubmit();
    },
  });
  const handleSubmit = async () => {
    const payload = {
      reset_password_token: token,
      password: formik.values.password,
      password_confirmation: formik.values.confirmPassword,
    };
    if (payload.password === payload.password_confirmation) {
      dispatch(userResetPassword(payload)).then((res) => {
        if (res.payload.key === "PASSWORD_NOT_UPDATED") {
          toast({
            position: "top",
            status: "error",
            variant: "solid",
            title: res.payload.message,
            duration: 2500,
            containerStyle: {
              fontWeight: 400,
            },
          });
        } else if (res.payload.key === "PASSWORD_UPDATED") {
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
          setTimeout(() => {
            navigate("/login");
          }, 3000);
        }
      });
    } else {
      toast({
        position: "top",
        status: "error",
        variant: "solid",
        title: "Password do not match. Try again!",
        duration: 2500,
        containerStyle: {
          fontWeight: 400,
        },
      });
    }
  };
  return (
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
              type={showPassword ? "text" : "password"}
              placeholder="Enter Password"
              required
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
            <InputRightElement
              onClick={() => setShowPassword((c) => !c)}
              sx={{ cursor: "pointer" }}
            >
              {showPassword ? (
                <ViewOffIcon color="#33445B" boxSize="1.1em" />
              ) : (
                <ViewIcon color="#33445B" boxSize="1.1em" />
              )}
            </InputRightElement>
          </InputGroup>
        </FormControl>
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
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirm ? "text" : "password"}
              placeholder="Confirm Password"
              variant="outlined"
              autoComplete="off"
              required
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
              value={formik.values.confirmPassword}
            />
            <InputRightElement
              onClick={() => setShowConfirm((c) => !c)}
              sx={{ cursor: "pointer" }}
            >
              {showConfirm ? (
                <ViewOffIcon color="#33445B" boxSize="1.1em" />
              ) : (
                <ViewIcon color="#33445B" boxSize="1.1em" />
              )}
            </InputRightElement>
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
            {loading ? "Please Wait" : "Create Password"}
          </Button>
        </Flex>
      </form>
    </div>
  );
};
