import React from "react";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { widgetsDetailsGet } from "../../api-client";


export const getWidgetDetails = createAsyncThunk(
    "getWidgetDetails",
    async (body, { rejectWithValue }) => {
      try {
        const response = await widgetsDetailsGet(body);
        const data = response?.data;
        return data;
      } catch (err) {
        return rejectWithValue(err.response.data);
      }
    }
  );
  