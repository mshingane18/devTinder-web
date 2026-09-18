import { createSlice } from "@reduxjs/toolkit";

const feedSlice = createSlice({
  name: "feed",
  initialState: null,
  reducers: {
    addFeed: (state, action) => {
      return action.payload;
    },
    appendFeed: (state, action) => {
      return [...(state ?? []), ...action.payload];
    },
    removeFeed: (state, action) => {
      return null;
    },
    removeUserFromFeed: (state, action) => {
      const users = state.filter((user) => user._id !== action.payload);
      return users;
    },
  },
});
export const { addFeed, appendFeed, removeFeed, removeUserFromFeed } =
  feedSlice.actions;
export default feedSlice.reducer;
