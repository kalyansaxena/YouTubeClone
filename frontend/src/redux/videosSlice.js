import { createSlice } from "@reduxjs/toolkit";

export const videosSlice = createSlice({
  name: "videos",
  initialState: {
    videos: [],
    loading: false,
    error: false,
  },
  reducers: {
    fetchVideosStart: (state) => {
      state.loading = true;
    },
    fetchVideosSuccess: (state, action) => {
      state.loading = false;
      state.videos = action.payload;
    },
    fetchVideosError: (state) => {
      state.loading = false;
      state.error = true;
    },
  },
});

export const { fetchVideosStart, fetchVideosSuccess, fetchVideosError } =
  videosSlice.actions;

export default videosSlice.reducer;
