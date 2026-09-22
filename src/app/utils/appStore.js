import { configureStore } from "@reduxjs/toolkit";

import userReducer from "./userSlice";
import feedReducer from "./feedSlice";
import connectionsReducer from "./connectionSlice";
import requestsReducer from "./requestsSlice";
import unreadReducer from "./unreadSlice";

const appStore = configureStore({
  reducer: {
    user: userReducer,
    feed: feedReducer,
    connections: connectionsReducer,
    requests: requestsReducer,
    unreadCounts: unreadReducer,
  },
});

export default appStore;
