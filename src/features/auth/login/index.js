import React, { useEffect, useState } from "react";
import {  useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../../store/thunk/authThunk";
import AuthTokenService from "../../../utils/AuthTokenService";
import { useNavigate } from "react-router-dom";
import { MdEmail } from "react-icons/md";
import {
  Button,
  Checkbox,
  Flex,
  FormControl,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  useToast,
} from "@chakra-ui/react";
import {  ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { RiLockPasswordFill } from "react-icons/ri";
import ReCAPTCHA from "react-google-recaptcha";
// Creating schema
const schema = Yup.object().shape({
  email: Yup.string()
    .required("Email is a required field")
    .email("Invalid email format"),
  password: Yup.string()
    .required("Password is a required field")
    .min(8, "Password must be at least 8 characters"),
});

export const LoginForm = ({  }) => {
  const loading = useSelector((state) => state.auth.loading);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();
  const [captcha, setCaptcha] = useState(false);
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
    onSubmit: (values) => {
      handleSubmit();
    },
  });
  useEffect(() => {
    if (AuthTokenService.get()) {
      navigate("/dashboard");
    } else navigate("/login");
  }, []);
  function displayError(e) {
    toast({
      position: "top",
      status: "error",
      variant: "solid",
      title: "Captcha is not verified.",
      duration: 2500,
      containerStyle: {
        fontWeight: 400,
      },
    });
  }
  const handleSubmit = async () => {
    const payload = {
      email: formik.values.email,
      password: formik.values.password,
      rememberMe: formik.values.rememberMe,
    };
    dispatch(login(payload)).then((res) => {
      if (!res.error) {
        AuthTokenService.storeToken({
          token: res.payload.auth_token,
          keepMeLoggedIn: payload.rememberMe,
          lang: res.payload.preferred_language,
          email: payload.email,
        });
        navigate("/dashboard");
      } else {
        toast({
          position: "top",
          status: "error",
          variant: "solid",
          title: res?.payload?.message,
          duration: 2500,
          containerStyle: {
            fontWeight: 400,
          },
        });
      }
    });
  };
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div>
      <form
        onSubmit={
          !loading
            ? captcha
              ? formik.handleSubmit
              : displayError
            : console.log("Resting")
        }
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
        <Flex sx={{ width: "360px" }}>
          <ReCAPTCHA
            style={{
              display: "flex",
              width: "360px",
              boxSizing: "none !important",
            }}
            sitekey={process.env.GOOGLE_CAPTCHA_SITE_KEY}
            onChange={(value) => {
              setCaptcha(value ? true : false);
            }}
          />
        </Flex>
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
            {loading ? "Please Wait" : "Login"}
          </Button>
          <Checkbox
            id="rememberMe"
            name="rememberMe"
            size="md"
            onChange={formik.handleChange}
            isChecked={formik.values.rememberMe}
            sx={{ fontSize: 16, width: "100%" }}
          >
            Remember Me
          </Checkbox>
        </Flex>
      </form>
    </div>
  );
};
