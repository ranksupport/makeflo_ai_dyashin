import { createSlice } from "@reduxjs/toolkit";
import {
  login,
  userExist,
  userForgotPassword,
  userSignup,
} from "../thunk/authThunk";

const initialState = {
  user: null,
  forgotApiError: false,
  loading: false,
  verifyLoading: true,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload ? action.payload.response : {};
        state.loading = false;
      })
      .addCase(login.pending, (state, action) => {
        state.user = null;
        state.loading = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.user = null;
        state.loading = false;
      })
      .addCase(userForgotPassword.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(userForgotPassword.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(userExist.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(userExist.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(userSignup.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(userSignup.pending, (state, action) => {
        state.loading = true;
      });
  },
});

export const {} = authSlice.actions;

export default authSlice.reducer;
