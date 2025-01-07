import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  userVerify,
} from "../../../store/thunk/authThunk";
import { FaUserCheck } from "react-icons/fa";
import {  useParams } from "react-router-dom";
import { AiFillCloseCircle } from "react-icons/ai";
import {
  CircularProgress,
  Flex,
  Icon,
} from "@chakra-ui/react";

export const VerifyEmailContainer = ({}) => {
  const dispatch = useDispatch();
  let { token } = useParams();
  const [status, setStatus] = useState("Verification Pending");
  useEffect(() => {
    dispatch(userVerify({ confirmation_token: token })).then((res) => {
      if (res.payload?.key === "VERIFY_EMAIL_SUCCESS") {
        setStatus("Verification Completed");
      } else if (res.payload?.key === "VERIFY_EMAIL_FAIL") {
        setStatus("Verification Failed");
      } else {
        setStatus("Verification Failed");
      }
    });
  }, []);
  return status === "Verification Completed" ? (
    <Flex
      sx={{
        flexDir: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        pt: "30px",
        gap: "20px",
      }}
    >
      <Icon
        as={FaUserCheck}
        boxSize="50px"
        id="icon"
        sx={{
          m: "auto 0px",
          color: "#33445B",
        }}
      />
      Successfully Verified. Please Login to continue.
    </Flex>
  ) : status === "Verification Failed" ? (
    <Flex
      sx={{
        flexDir: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        pt: "30px",
        gap: "20px",
      }}
    >
      <Icon
        as={AiFillCloseCircle}
        boxSize="50px"
        id="icon"
        sx={{
          m: "auto 0px",
          color: "#33445B",
        }}
      />
      We were unable to verify this account.
      <br /> Contact us to know more.
    </Flex>
  ) : (
    <Flex
      sx={{
        flexDir: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        pt: "30px",
        gap: "20px",
      }}
    >
      <CircularProgress
        isIndeterminate
        color="#33455b"
        size="50px"
        sx={{ m: "auto 0px" }}
      />
      Please Wait
    </Flex>
  );
};
