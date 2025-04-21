import React from "react";
import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  userExistPost,
  userForgotPasswordPost,
  userLoginPost,
  userLogoutPostAi,
  userRegisterPostAi,
  userResetPasswordPost,
  userSignupPost,
  userUpdatePost,
  userVerifyPost,
} from "../../api-client";

export const login = createAsyncThunk(
  "login",
  async (body, { rejectWithValue }) => {
    try {
      const response = await userLoginPost(body);
      const data = response?.data;
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const registerUserAi = createAsyncThunk(
  "auth/register",
  async (_, { rejectWithValue }) => {
    try {
      const response = await userRegisterPostAi();
      return response;
    } catch (err) {
      return rejectWithValue(err.response); 
    }
  }
);


export const logoutUserAi = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const response = await userLogoutPostAi();
      return response;
    } catch (err) {
      return rejectWithValue(err.response); 
    }
  }
);

export const userSignup = createAsyncThunk(
  "userSignup",
  async (body, { rejectWithValue }) => {
    try {
      const response = await userSignupPost(body);
      const data = response?.data;
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const userExist = createAsyncThunk(
  "userExist",
  async (body, { rejectWithValue }) => {
    try {
      const response = await userExistPost(body);
      const data = response?.data;
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const userVerify = createAsyncThunk(
  "userVerify",
  async (body, { rejectWithValue }) => {
    try {
      const response = await userVerifyPost(body);
      const data = response?.data;
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const userUpdate = createAsyncThunk(
  "userUpdate",
  async (body, { rejectWithValue }) => {
    try {
      const response = await userUpdatePost(body);
      const data = response?.data;
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);
export const userForgotPassword = createAsyncThunk(
  "userForgotPassword",
  async (body, { rejectWithValue }) => {
    try {
      const response = await userForgotPasswordPost(body);
      const data = response?.data;
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);
export const userResetPassword = createAsyncThunk(
  "userResetPassword",
  async (body, { rejectWithValue }) => {
    try {
      const response = await userResetPasswordPost(body);
      const data = response?.data;
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);
