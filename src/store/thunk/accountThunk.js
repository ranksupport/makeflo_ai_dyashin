import React from "react";
import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  getAgencyUserList,
  getOauthDataPost,
  getProfileGet,
  getTeamUserList,
  updatePasswordPost,
  updateProfileAvatar,
  updateProfilePost,
  userLoginPost,
} from "../../api-client";

export const getProfile = createAsyncThunk(
  "getProfile",
  async (_, thunkAPI) => {
    try {
      const response = await getProfileGet();
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const updateProfileAvatarPost = createAsyncThunk(
  "updateProfileAvatarPost",
  async (data, thunkAPI) => {
    try {
      const response = await updateProfileAvatar(data);
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const updatePassword = createAsyncThunk(
  "updatePassword",
  async (data, thunkAPI) => {
    try {
      const response = await updatePasswordPost(data);
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const updateProfile = createAsyncThunk(
  "updateProfile",
  async (_, thunkAPI) => {
    try {
      const { account } = thunkAPI.getState();
      let data = {};
      account.editableProfile.forEach((obj) => {
        if (obj.key != "timezone" && obj.key != "country") {
          data[obj.key] = obj.value;
        } else {
          if (typeof obj.value == "string") data[obj.key] = obj.value;
          else data[obj.key] = obj.value.value;
        }
      });
      const response = await updateProfilePost(data);
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);
export const fetchMemberList = createAsyncThunk(
  "fetchMemberList",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getTeamUserList();
      return response?.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const fetchAgencyMemberList = createAsyncThunk(
  "fetchAgencyMemberList",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAgencyUserList();
      return response?.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);
