import React, { useState, useEffect } from "react";
import { Flex } from "@chakra-ui/react";
import queryString from "query-string";
import { useLocation, useParams } from "react-router-dom";
import { getOauthData, saveOauthData } from "../../store/thunk/appThunk";
import { useDispatch, useSelector } from "react-redux";
import AuthTokenService from "../../utils/AuthTokenService";
export const AppsOauthContainer = () => {
  const [data, setData] = useState({});
  const OAUTH_REDIRECT_URL = process.env.APP_BASE_URL + "oauth/response";
  console.log("outh:", OAUTH_REDIRECT_URL)
  const location = useLocation();
  const params = useParams();
  const dispatch = useDispatch();
  // const credentails = useSelector((state) => state.auth.twitter_cred);
  const values = location.search
    ? queryString.parse(location.search)
    : queryString.parse(location.hash);
  if (data && data.type) {
    window.location.href = data.auth_url;
  }
  const idd = localStorage.getItem("app_user_id");
  const id = Number(idd);
  const reAut = localStorage.getItem("re-auth");
  const reAuth = Boolean(reAut);
  useEffect(() => {
    if (params.appId) {
      AuthTokenService.storeToken({
        token: params.token,
        keepmeLoggedIn: false,
        appId: params.appId,
      });
      window.appId = params.appId;
      dispatch(
        getOauthData({
          app_id: params.appId,
          redirect_url: OAUTH_REDIRECT_URL,
          // client_id: credentails.client_key,
          // client_secret: credentails.client_secret,
        })
      ).then((res) => {
        setData(res.payload);
      });
    } else if (AuthTokenService.getAppId()) {
      dispatch(
        saveOauthData(
          reAuth
            ? {
                app_id: AuthTokenService.getAppId(),
                redirect_url: OAUTH_REDIRECT_URL,
                app_user_id: id,
                auth_response: values,
              }
            : {
                app_id: AuthTokenService.getAppId(),
                redirect_url: OAUTH_REDIRECT_URL,
                auth_response: {
                  ...values,
                  // client_key: credentails.client_key,
                  // client_secret: credentails.client_secret,
                },
              }
        )
      ).then((res) => {
        window.close();
      });
      window.appId = null;
    }
  }, []);

  return (
    <Flex justifyContent="center" m="20px auto" fontSize="20px">
      <h3>Please Wait</h3>
    </Flex>
  );
};
