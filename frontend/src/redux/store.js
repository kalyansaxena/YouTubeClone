import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import videoReducer from "./videoSlice";
import videosReducer from "./videosSlice";
import recommendationsReducer from "./recommendationsSlice";
import searchVideosReducer from "./searchVideosSlice";

export default configureStore({
  reducer: {
    user: userReducer,
    video: videoReducer,
    videos: videosReducer,
    recommendations: recommendationsReducer,
    searchVideos: searchVideosReducer,
  },
});
