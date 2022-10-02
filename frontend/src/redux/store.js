import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import videoReducer from "./videoSlice";

export default configureStore({
  reducer: {
    user: userReducer,
    video: videoReducer,
  },
});
