import { createSlice, current } from "@reduxjs/toolkit";
import {
  fetchAgencyMemberList,
  fetchMemberList,
  getProfile,
  updatePassword,
  updateProfile,
  updateProfileAvatarPost,
} from "../thunk/accountThunk";
import timezones from "timezones-list";
import { countries } from "countries-list";
const initialState = {
  loading: true,
  profileData: {},
  teamData: [],
  agencyData: {},
  editableProfile: [],
  account_nav: 0,
};

export const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    changeEditableData: (state, action) => {
      state.editableProfile = state.editableProfile.map((item) => {
        if (item.key == action.payload.key) {
          return {
            ...item,
            value: action.payload.value,
            selectedOption: action.payload.value,
          };
        } else return item;
      });
    },
    updateProfileData: (state, action) => {
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProfile.fulfilled, (state, action) => {
        const countries_arr = Object.entries(countries).map(([key, value]) => ({
          id: value.name,
          label: value.name,
          value: value.name,
        }));
        state.loading = false;
        state.profileData = action.payload;
        state.editableProfile = Object.entries(action.payload)
          .filter(([key, value]) => {
            if (
              key !== "is_admin" &&
              key !== "current_plan" &&
              key !== "free_task" &&
              key !== "paddle_customer_id" &&
              key != "preferred_language" &&
              key !== "image_url"
            ) {
              return true; // Include this key-value pair in the filtered array
            }
            return false; // Exclude this key-value pair from the filtered array
          })
          .map(([key, value]) => {
            return {
              label: key
                .split("_")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" "),
              value,
              key: key,
              options:
                key == "timezone"
                  ? timezones.map((zone) => ({
                      ...zone,
                      value: zone.label.match(/GMT[-+]\d+:\d+/)[0],
                    }))
                  : key == "country"
                  ? countries_arr
                  : [],
              selectedOption: null,
            };
          });
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.loading = false;
      })
      .addCase(fetchMemberList.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(fetchMemberList.fulfilled, (state, action) => {
        state.teamData = action.payload.team_users;
        state.loading = false;
      })
      .addCase(fetchAgencyMemberList.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(fetchAgencyMemberList.fulfilled, (state, action) => {
        state.loading = false;
        state.agencyData = action.payload;
      })
      .addCase(updateProfile.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(updateProfileAvatarPost.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(updateProfileAvatarPost.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(updatePassword.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(updatePassword.fulfilled, (state, action) => {
        state.loading = false;
      });
  },
});

export const { changeEditableData, updateProfileData } = accountSlice.actions;

export default accountSlice.reducer;
