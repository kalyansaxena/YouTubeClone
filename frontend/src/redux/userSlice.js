import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    loggedInUser: null,
    loading: false,
    error: false,
  },
  reducers: {
    loginStart: (state) => {
      state.loading = true;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.loggedInUser = action.payload;
    },
    loginError: (state) => {
      state.loading = false;
      state.error = true;
    },
    signupStart: (state) => {
      state.loading = true;
    },
    signupSuccess: (state, action) => {
      state.loading = false;
      state.loggedInUser = action.payload;
    },
    signupError: (state) => {
      state.loading = false;
      state.error = true;
    },
    logout: (state) => {
      state.loggedInUser = null;
      state.loading = false;
      state.error = false;
    },
    subscription: (state, action) => {
      if (state.loggedInUser.subscribedUsers.includes(action.payload)) {
        state.loggedInUser.subscribedUsers.splice(
          state.loggedInUser.subscribedUsers.findIndex(
            (channelId) => channelId === action.payload
          ),
          1
        );
      } else {
        state.loggedInUser.subscribedUsers.push(action.payload);
      }
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginError,
  signupStart,
  signupSuccess,
  signupError,
  logout,
  subscription,
} = userSlice.actions;

export default userSlice.reducer;
