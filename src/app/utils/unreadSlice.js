import { createSlice } from "@reduxjs/toolkit";

const unreadSlice = createSlice({
  name: "unreadCounts",
  initialState: {},
  reducers: {
    hydrateUnreadCounts: (state, action) => {
      const incoming = action.payload ?? {};
      Object.keys(incoming).forEach((key) => {
        state[String(key)] = Number(incoming[key]) || 0;
      });
    },
    incrementUnreadCount: (state, action) => {
      const connectionId = String(action.payload);
      state[connectionId] = Number(state[connectionId] ?? 0) + 1;
    },
    setUnreadCount: (state, action) => {
      const { connectionId, count } = action.payload;
      state[String(connectionId)] = Number(count) || 0;
    },
    clearUnreadCount: (state, action) => {
      state[String(action.payload)] = 0;
    },
    clearAllUnreadCounts: () => ({}),
  },
});

export const {
  hydrateUnreadCounts,
  incrementUnreadCount,
  setUnreadCount,
  clearUnreadCount,
  clearAllUnreadCounts,
} = unreadSlice.actions;

export const selectTotalUnreadCount = (state) =>
  Object.values(state.unreadCounts ?? {}).reduce(
    (total, count) => total + Number(count || 0),
    0,
  );

export default unreadSlice.reducer;
