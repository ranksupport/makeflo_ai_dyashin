import { createSlice, current } from "@reduxjs/toolkit";

const initialState = {
  active_nav: 1,
  account_nav: 0,
};

export const shellSlice = createSlice({
  name: "shell",
  initialState,
  reducers: {
    setActiveNav: (state, action) => {
      state.active_nav = action.payload;
    },
    setActiveAccNav: (state, action) => {
      state.account_nav = action.payload;
    },
  },
});

export const { setActiveNav, setActiveAccNav } = shellSlice.actions;

export default shellSlice.reducer;
