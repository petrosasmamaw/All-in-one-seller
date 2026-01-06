import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '');
const CLIENTAPI_URL = `${BASE_URL}/api/clients/`;

/* ===================== THUNKS ===================== */

export const fetchAllClients = createAsyncThunk(
  "clients/fetchAllClients",
  async () => {
    const response = await axios.get(CLIENTAPI_URL);
    return response.data;
  }
);

export const fetchClientByUserId = createAsyncThunk(
  "clients/fetchClientByUserId",
  async (userId) => {
    const response = await axios.get(`${CLIENTAPI_URL}user/${userId}`);
    return response.data;
  }
);

export const createClient = createAsyncThunk(
  "clients/createClient",
  async (clientData) => {
    const formData = new FormData();
    formData.append("name", clientData.name);
    formData.append("userId", clientData.userId);
    formData.append("phoneNo", clientData.phoneNo);

    if (clientData.image) {
      formData.append("image", clientData.image);
    }

    const response = await axios.post(CLIENTAPI_URL, formData);
    return response.data;
  }
);

export const updateClient = createAsyncThunk(
  "clients/updateClient",
  async ({ id, clientData }) => {
    const formData = new FormData();
    formData.append("name", clientData.name);
    formData.append("userId", clientData.userId);
    formData.append("phoneNo", clientData.phoneNo);

    if (clientData.image) {
      formData.append("image", clientData.image);
    }

    const response = await axios.put(`${CLIENTAPI_URL}${id}`, formData);
    return response.data;
  }
);

export const deleteClient = createAsyncThunk(
  "clients/deleteClient",
  async (id) => {
    await axios.delete(`${CLIENTAPI_URL}${id}`);
    return id;
  }
);

/* ===================== SLICE ===================== */

const clientSlice = createSlice({
  name: "clients",
  initialState: {
    clients: [],
    client: null,
    status: "idle",
    error: null,
  },
  reducers: {},

  extraReducers: (builder) => {
    builder
      /* ---------- FETCH ALL ---------- */
      .addCase(fetchAllClients.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAllClients.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.clients = action.payload;
      })
      .addCase(fetchAllClients.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      /* ---------- FETCH BY USER ---------- */
      .addCase(fetchClientByUserId.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchClientByUserId.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.client = action.payload;
      })
      .addCase(fetchClientByUserId.rejected, (state, action) => {
        state.status = "failed";
        state.client = null;
      })

      /* ---------- CREATE ---------- */
      .addCase(createClient.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createClient.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.clients.push(action.payload);
        state.client = action.payload; // ⭐ KEY FIX
      })
      .addCase(createClient.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      /* ---------- UPDATE ---------- */
      .addCase(updateClient.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateClient.fulfilled, (state, action) => {
        state.status = "succeeded";

        const index = state.clients.findIndex(
          (c) => c._id === action.payload._id
        );
        if (index !== -1) {
          state.clients[index] = action.payload;
        }

        state.client = action.payload; // ⭐ KEY FIX
      })
      .addCase(updateClient.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      /* ---------- DELETE ---------- */
      .addCase(deleteClient.fulfilled, (state, action) => {
        state.clients = state.clients.filter(
          (c) => c._id !== action.payload
        );
        if (state.client?._id === action.payload) {
          state.client = null;
        }
      });
  },
});

export default clientSlice.reducer;
