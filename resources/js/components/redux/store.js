import { configureStore, createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import thunk from 'redux-thunk'; 

export const fetchData = createAsyncThunk('data/fetch', async (apiUrl) => {
  const response = await axios.get(apiUrl);
  return response.data;
});

export const postData = createAsyncThunk('data/post', async (postDataVal) => {
  const apiUrl = "http://localhost/campaign/public/api/postcampaigndata";
  const response = await axios.post(apiUrl, postDataVal);
  return response.data;
});

const dataSlice = createSlice({
  name: 'data',
  initialState: { items: [], loading: false, error: null, postItem: [], postLoading: false, postError: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchData.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(postData.pending, (state) => {
        state.postLoading = true;
        state.postError = null;
      })
      .addCase(postData.fulfilled, (state, action) => {
        state.postLoading = false;
        state.postItem.push(action.payload);
      })
      .addCase(postData.rejected, (state, action) => {
        state.postLoading = false;
        state.postError = action.error.message;
      });

  },
});

const store = configureStore({
  reducer: {
    data: dataSlice.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
});

export default store;