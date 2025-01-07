import React from "react";
import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  getAppEventConfig,
  getAppEvents,
  getLinkedAccount,
  getOauthDataPost,
  getaddonapps,
  getapp,
  getapps,
  saveAuthLabelPost,
  saveOauthDataPost,
  updateAppStatusPost,
} from "../../api-client";

export const getAddonApps = createAsyncThunk(
  "getaddonapps",
  async (body, { rejectWithValue }) => {
    try {
      const response = await getaddonapps(body);
      const data = response?.data;
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const getauthdata = createAsyncThunk(
  "getauthdata",
  async (body, { rejectWithValue }) => {
    try {
      const response = await getOauthDataPost(body);
      const data = response?.data;
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const editAccountName = createAsyncThunk(
  "editAccountName",
  async (body, { rejectWithValue }) => {
    try {
      const response = await saveAuthLabelPost(body);
      const data = response?.data;
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);
export const removeAccount = createAsyncThunk(
  "removeAccount",
  async (body, { rejectWithValue }) => {
    try {
      const response = await updateAppStatusPost(body);
      const data = response?.data;
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const addAccount = createAsyncThunk(
  "addAccount",
  async (body, { rejectWithValue }) => {
    try {
      const response = await saveOauthDataPost(body);
      const data = response?.data;
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);
export const searchApp = createAsyncThunk(
  "searchApp",
  async (searchQuery, thunkAPI) => {
    try {
      const response = await getapp(searchQuery);
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const getApps = createAsyncThunk(
  "getapps",
  async (_, { rejectWithValue }) => {
    try {
      const addonResponse = await getaddonapps();
      const actionResponse = await getapps();

      const resultResponse = [
        ...addonResponse.data.apps,
        ...actionResponse.data.apps,
      ];
      return resultResponse;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const getApp = createAsyncThunk(
  "getapp",
  async (body, { rejectWithValue }) => {
    try {
      const response = await getapp(body);
      const data = response?.data;
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const getOauthData = createAsyncThunk(
  "getOauthData",
  async (body, { rejectWithValue }) => {
    try {
      const response = await getOauthDataPost(body);
      const data = response?.data;
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const saveOauthData = createAsyncThunk(
  "saveOauthData",
  async (body, { rejectWithValue }) => {
    try {
      const response = await saveOauthDataPost(body);
      const data = response?.data;
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);
