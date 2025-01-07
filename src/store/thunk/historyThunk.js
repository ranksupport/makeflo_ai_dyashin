import React from "react";
import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  getLogsGet,
  getTaskDetailsGet,
  getTaskLogsGet,
} from "../../api-client";

export const getTaskLogsList = createAsyncThunk(
  "getTaskLogsList",
  async (body, { rejectWithValue }) => {
    try {
      const response = await getTaskLogsGet(body);
      const data = response?.data;
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const getLogsList = createAsyncThunk(
  "getLogsList",
  async (body, { rejectWithValue }) => {
    try {
      const response = await getLogsGet(body);
      const data = response?.data;
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const getTaskDetails = createAsyncThunk(
  "getTaskDetails",
  async (body, { rejectWithValue }) => {
    try {
      const response = await getTaskDetailsGet(body);
      const data = response?.data;
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

