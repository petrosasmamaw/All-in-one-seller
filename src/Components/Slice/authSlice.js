import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

axios.defaults.withCredentials = true; // send cookies automatically
const BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '');
const AUTHAPI_URL = `${BASE_URL}/api/auth/`;

export const registerUser = createAsyncThunk("auth/registerUser", async (userData) => {
  const response = await axios.post(`${AUTHAPI_URL}register`, userData);
  return response.data;
});

export const loginUser = createAsyncThunk("auth/loginUser", async (credentials) => {
  const response = await axios.post(`${AUTHAPI_URL}login`, credentials);
  return response.data;
});

export const logoutUser = createAsyncThunk("auth/logoutUser", async () => {
  await axios.post(`${AUTHAPI_URL}logout`);
});

export const fetchSession = createAsyncThunk("auth/fetchSession", async () => {
  const response = await axios.get(`${AUTHAPI_URL}session`);
  return response.data;
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    status: "idle",
    error: null,
  },
  reducers: {
    clearAuthError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => { state.status = "loading"; })
      .addCase(registerUser.fulfilled, (state, action) => { state.status = "succeeded"; state.user = action.payload.user; })
      .addCase(registerUser.rejected, (state, action) => { state.status = "failed"; state.error = action.error.message; })

      .addCase(loginUser.pending, (state) => { state.status = "loading"; })
      .addCase(loginUser.fulfilled, (state, action) => { state.status = "succeeded"; state.user = action.payload.user; })
      .addCase(loginUser.rejected, (state, action) => { state.status = "failed"; state.error = action.error.message; })

      .addCase(logoutUser.fulfilled, (state) => { state.user = null; state.status = "idle"; })
      .addCase(fetchSession.fulfilled, (state, action) => { state.user = action.payload.user; state.status = "succeeded"; })
      .addCase(fetchSession.rejected, (state) => { state.user = null; state.status = "idle"; });
  },
});

export const { clearAuthError } = authSlice.actions;
export default authSlice.reducer;
