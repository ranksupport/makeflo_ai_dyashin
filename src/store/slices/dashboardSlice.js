import { createSlice } from "@reduxjs/toolkit";
import {
  getLogsList,
  getTaskDetails,
  getTaskLogsList,
} from "../thunk/historyThunk";

const initialState = {
  loading: true,
  flow_data: null,
  extra_task: null,
  task_data: null,
  task_logs: null
};

export const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getTaskLogsList.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getTaskLogsList.fulfilled, (state, action) => {
        state.loading = false;
        state.konnects = action.payload.konnects;
        state.totalKonnects = action.payload.total_konnects;
      })
      .addCase(getLogsList.pending, (state, action) => {
        state.taskLoading = true;
      })
      .addCase(getLogsList.fulfilled, (state, action) => {
        state.taskLoading = false;
        state.taskList = action.payload.task_logs;
        state.taskLog = [];
      })
      .addCase(getTaskDetails.pending, (state, action) => {
        state.taskLogLoading = true;
      })
      .addCase(getTaskDetails.fulfilled, (state, action) => {
        state.taskLogLoading = false;
        state.taskLog = action.payload.tasks;
      });
  },
});

export const {} = dashboardSlice.actions;

export default dashboardSlice.reducer;
