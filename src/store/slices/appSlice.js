import { createSlice, current } from "@reduxjs/toolkit";

import { getAddonApps, getApp, getApps } from "../thunk/appThunk";

const initialState = {
  triggers: [],
  actions: [],
  addOnloading: true,
  appsLoading: true,
  addOnList: [],
  appsList: [],
  modalData: null,
  getOauthData: null,
};

export const appsSlice = createSlice({
  name: "apps",
  initialState,
  reducers: {
    setAppList: (state, action) => {
      state.addOnList = action.payload;
    },
    setModalData: (state, action) => {
      state.modalData = action.payload;
    },
    refreshAccounts: (state, action) => {
      state.modalData.accounts = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAddonApps.fulfilled, (state, action) => {
        // state.addOnloading = false;
        // state.addOnList = action.payload.apps;
      })
      .addCase(getAddonApps.rejected, (state, action) => {
        // state.addOnloading = false;
      })
      .addCase(getApps.fulfilled, (state, action) => {
        state.triggers = action.payload.filter((app) => {
          if (app.side.toLowerCase() != "right") return app;
        });
        state.actions = action.payload.filter((app) => {
          if (app.side.toLowerCase() != "left" && app.app_type != "ADD_ON") return app;
        });
        state.addOnList = action.payload.filter((app) => {
          if (app.app_type == "ADD_ON") return app;
        });
      })
      .addCase(getApp.fulfilled, (state, action) => {
        state.appsLoading = false;
        state.appsList = action.payload.apps;
      })
      .addCase(getApps.rejected, (state, action) => {
        // state.appsLoading = false;
      });
    // .addCase(editAuthLabelPost.fulfilled, (state, action) => {
    //   const accounts = state.modalData.accounts;
    //   accounts.map((acc) => {
    //     if (acc.id === action.meta.arg.id) {
    //       acc.name = action.meta.arg.label;
    //     }
    //   });
    // })
    // .addCase(updateAppAccountStatus.fulfilled, (state, action) => {
    //   if (action.payload.message === "SUCCESS") {
    //     const accounts = state.modalData.accounts;
    //     const newAccount = accounts.filter(
    //       (acc) => acc.id !== action.meta.arg.appId
    //     );
    //     state.modalData.accounts = newAccount;
    //   }
    // });
    // .addCase(getOauthData.fulfilled, (state, action) => {
    //   if (state.modalData) {
    //     state.modalData.addingAccount = action.payload;
    //   }
    //   state.getOauthData = action.payload;
    // });
  },
});

export const { setModalData, refreshAccounts } = appsSlice.actions;

export default appsSlice.reducer;
