import { createSlice, current } from "@reduxjs/toolkit";
import { moveFlowsToFolder } from '../thunk/dashflowThunk';
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
import {
  createFolder,
  deleteFolder,
  fetchFolder,
  getKonnectsByFolder,
  getKonnectsList,
  renameFolderCall,
  searchKonnectz,
} from "../thunk/dashflowThunk";
const initialState = {
  loading: true,
  folder_loading: false,
  konnects_loading: true,
  folders: [],
  flows: [],
  konnects: [],
  total_konnects: null,
  flow_nav: -1,
};

export const dashflowSlice = createSlice({
  name: "dashflow",
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
    setFlowNav: (state, action) => {
      state.flow_nav = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFolder.pending, (state, action) => {
        state.folder_loading = true;
      })
      .addCase(fetchFolder.fulfilled, (state, action) => {
        state.folder_loading = false;
        state.loading = false;
        state.folders = action.payload.folders;
      })
      .addCase(getKonnectsList.pending, (state, action) => {
        state.konnects_loading = true;
      })
      // .addCase(getKonnectsList.fulfilled, (state, action) => {
      //   state.konnects_loading = false;
      //   state.konnects = action.payload.konnects;
      //   state.total_konnects = action.payload.total_konnects;
      // })
      .addCase(getKonnectsList.fulfilled, (state, action) => {
        state.konnects_loading = false;
        state.konnects = action.payload.konnects.map(konnect => ({
          ...konnect,
          created_at: konnect.created_at // Ensure this field is included
        }));
        state.total_konnects = action.payload.total_konnects;
      })
      .addCase(getKonnectsByFolder.pending, (state, action) => {
        state.konnects_loading = true;
      })
      .addCase(getKonnectsByFolder.fulfilled, (state, action) => {
        state.konnects_loading = false;
        state.konnects = action.payload.konnects;
      })
      .addCase(searchKonnectz.pending, (state, action) => {
        state.konnects_loading = true;
      })
      .addCase(searchKonnectz.fulfilled, (state, action) => {
        state.konnects_loading = false;
      })
      .addCase(createFolder.pending, (state, action) => {
        state.folder_loading = true;
      })
      .addCase(createFolder.fulfilled, (state, action) => {
        state.folder_loading = false;
      })
      .addCase(deleteFolder.pending, (state, action) => {
        state.folder_loading = true;
      })
      .addCase(deleteFolder.fulfilled, (state, action) => {
        state.folder_loading = false;
      })
      .addCase(renameFolderCall.pending, (state, action) => {
        state.folder_loading = true;
      })
      .addCase(renameFolderCall.fulfilled, (state, action) => {
        state.folder_loading = false;
      })
      // Add these new cases
      .addCase(moveFlowsToFolder.pending, (state) => {
        state.loading = true;
      })
      .addCase(moveFlowsToFolder.fulfilled, (state, action) => {
        state.loading = false;
        // You might want to update the state here based on the response
        // For example, you could update the folders or konnects arrays
        // This depends on what data your API returns and how you want to update the state
      })
      .addCase(moveFlowsToFolder.rejected, (state, action) => {
        state.loading = false;
        // Handle any errors here if needed
      });
  },
});

export const { changeEditableData, setFlowNav } = dashflowSlice.actions;

export default dashflowSlice.reducer;
