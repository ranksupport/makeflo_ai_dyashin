import React from "react";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios';
import {
  createFolderPost,
  deleteKonnectFolderGet,
  getFoldersListGet,
  getKonnectsByFolderIdd,
  getKonnectsListGet,
  renameKonnectFolderPut,
  moveKonnectsToFolderPost,
} from "../../api-client";

export const fetchFolder = createAsyncThunk(
  "fetchFolder",
  async (body, { rejectWithValue }) => {
    try {
      const response = await getFoldersListGet();
      const data = response?.data;
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// export const getKonnectsList = createAsyncThunk(
//   "getKonnectsList",
//   async (props, { rejectWithValue }) => {
//     try {
//       const response = await getKonnectsListGet(props);
//       const data = response?.data;
//       return data;
//     } catch (err) {
//       return rejectWithValue(err.response.data);
//     }
//   }
// );

export const getKonnectsList = createAsyncThunk(
  "getKonnectsList",
  async (props, { rejectWithValue }) => {
    try {
      // Add include_created_at to the props
      const response = await getKonnectsListGet({
        ...props,
        include_created_at: true
      });
      console.log('API Response:', response.data); 
      const data = response?.data;
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const getKonnectsByFolder = createAsyncThunk(
  "getKonnectsByFolder",
  async (props, { rejectWithValue }) => {
    try {
      const response = await getKonnectsByFolderIdd(props);
      const data = response?.data;
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const searchKonnectz = createAsyncThunk(
  "searchKonnectz",
  async (props, { rejectWithValue }) => {
    try {
      const response = await getKonnectsListGet(props);
      const data = response?.data;
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const createFolder = createAsyncThunk(
  "createFolder",
  async (folderName, { rejectWithValue }) => {
    try {
      const response = await createFolderPost(folderName);
      const data = response?.data;
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const deleteFolder = createAsyncThunk(
  "renameFolder",
  async (props, { rejectWithValue }) => {
    try {
      const response = await deleteKonnectFolderGet(props);
      const data = response?.data;
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);
export const renameFolderCall = createAsyncThunk(
  "renameFolderCall",
  async (props, { rejectWithValue }) => {
    try {
      const response = await renameKonnectFolderPut(props);
      const data = response?.data;
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);


// export const moveFlowsToFolder = createAsyncThunk(
//   'dashflow/moveFlowsToFolder',
//   async ({ folderId, selectedFlows }, { rejectWithValue }) => {
//     try {
//       const response = await axios.post('/api/move-flows', { folderId, selectedFlows });
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response.data);
//     }
//   }
// );


// export const moveFlowsToFolder = createAsyncThunk(
//   "moveFlowsToFolder",
//   async (props, { rejectWithValue }) => {
//     try {
//       const response = await moveKonnectsToFolderPost(props);
//       const data = response?.data;
//       return data;
//     } catch (err) {
//       return rejectWithValue(err.response.data);
//     }
//   }
// );


export const moveFlowsToFolder = createAsyncThunk(
  'dashflow/moveFlowsToFolder',
  async ({ flowIds, folderId }, { rejectWithValue }) => {
    try {
      const response = await moveKonnectsToFolderPost({ selectedKonnects: flowIds, folderId });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);