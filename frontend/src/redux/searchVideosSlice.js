import { createSlice } from "@reduxjs/toolkit";

export const searchVideosSlice = createSlice({
  name: "searchVideos",
  initialState: {
    videos: [],
    loading: false,
    error: false,
  },
  reducers: {
    fetchSearchVideosStart: (state) => {
      state.loading = true;
    },
    fetchSearchVideosSuccess: (state, action) => {
      state.loading = false;
      state.videos = action.payload;
    },
    fetchSearchVideosError: (state) => {
      state.loading = false;
      state.error = true;
    },
  },
});

export const {
  fetchSearchVideosStart,
  fetchSearchVideosSuccess,
  fetchSearchVideosError,
} = searchVideosSlice.actions;

export default searchVideosSlice.reducer;
