import React, { useEffect, useState } from "react";
import {  useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { userForgotPassword } from "../../../store/thunk/authThunk";
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

export const ForgotContainer = ({  }) => {
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.auth.loading);
  const toast = useToast();
  const formik = useFormik({
    initialValues: {
      email: "",
    },
    onSubmit: (values) => {
      handleSubmit();
    },
  });
  const handleSubmit = async () => {
    const payload = {
      email: formik.values.email,
    };
    dispatch(userForgotPassword(payload)).then((res) => {
      if (!res.error) {
        if (res.payload.key === "SENT_RESET_INSTRUCTIONS_FAIL") {
          toast({
            position: "top",
            status: "error",
            variant: "solid",
            title: "User doesn't exist!",
            duration: 2500,
            containerStyle: {
              fontWeight: 400,
            },
          });
        } else {
          toast({
            position: "top",
            status: "success",
            variant: "solid",
            title: `We sent forgot password link on ${formik.values.email}`,
            duration: 2500,
            containerStyle: {
              fontWeight: 400,
            },
          });
        }
      } else {
        toast({
          position: "top",
          status: "error",
          variant: "solid",
          title: res.payload.message || "Something Went Wrong",
          duration: 2500,
          containerStyle: {
            fontWeight: 400,
          },
        });
      }
    });
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
            {loading ? "Please Wait" : "Get Forgot Password Link"}
          </Button>
        </Flex>
      </form>
    </div>
  );
};
