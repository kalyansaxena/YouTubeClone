import { createSlice } from "@reduxjs/toolkit";

export const recommendationsSlice = createSlice({
  name: "recommendations",
  initialState: {
    videos: [],
    loading: false,
    error: false,
  },
  reducers: {
    fetchRecommendationsStart: (state) => {
      state.loading = true;
    },
    fetchRecommendationsSuccess: (state, action) => {
      state.loading = false;
      state.videos = action.payload;
    },
    fetchRecommendationsError: (state) => {
      state.loading = false;
      state.error = true;
    },
  },
});

export const {
  fetchRecommendationsStart,
  fetchRecommendationsSuccess,
  fetchRecommendationsError,
} = recommendationsSlice.actions;

export default recommendationsSlice.reducer;
