import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

        const BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '');
        const CLIENTAPI_URL = `${BASE_URL}/api/chats/`;
        export const fetchAllChats = createAsyncThunk(
          "chats/fetchAllChats",
          async () => {
            const response = await axios.get(CLIENTAPI_URL);
            return response.data;
          }
        );

        export const fetchChatByItemClientSeller = createAsyncThunk(
          "chats/fetchChatByItemClientSeller",
          async ({ itemId, clientId, sellerId }, { rejectWithValue }) => {
            try {
              const response = await axios.get(
                `${CLIENTAPI_URL}${itemId}/${clientId}/${sellerId}`
              );
              return response.data;
            } catch (err) {
              return rejectWithValue(err.response?.data || { message: err.message });
            }
          }
        );

        export const fetchChatsBySellerId = createAsyncThunk(
          "chats/fetchChatsBySellerId",
          async (sellerId) => {
            const response = await axios.get(`${CLIENTAPI_URL}seller/${sellerId}`);
            return response.data;
          }
        );

        export const fetchChatsByClientId = createAsyncThunk(
          "chats/fetchChatsByClientId",
          async (clientId) => {
            const response = await axios.get(`${CLIENTAPI_URL}client/${clientId}`);
            return response.data;
          }
        );

        export const createChat = createAsyncThunk(
          "chats/createChat",
          async (chatData) => {
            const response = await axios.post(CLIENTAPI_URL, chatData);
            return response.data;
          }
        );

        export const deleteChat = createAsyncThunk(
          "chats/deleteChat",
          async (id) => {
            await axios.delete(`${CLIENTAPI_URL}${id}`);
            return id;
          }
        );

        const initialState = {
          chats: [],
          chat: null,
          status: "idle",
          error: null,
        };

        const chatSlice = createSlice({
          name: "chats",
          initialState,
          extraReducers(builder) {
            builder
              .addCase(fetchChatsBySellerId.pending, (state) => {
                state.status = "loading";
              })
              .addCase(fetchChatsBySellerId.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.chats = action.payload;
              })
              .addCase(fetchChatsBySellerId.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message;
              })

              .addCase(fetchChatByItemClientSeller.pending, (state) => {
                state.status = "loading";
              })
              .addCase(fetchChatByItemClientSeller.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.chat = action.payload;
              })
              .addCase(fetchChatByItemClientSeller.rejected, (state, action) => {
                state.status = "failed";
                state.chat = null;
                state.error = action.payload?.message || action.error.message;
              })

              .addCase(createChat.fulfilled, (state, action) => {
                const idx = state.chats.findIndex((c) => c._id === action.payload._id);
                if (idx >= 0) state.chats[idx] = action.payload;
                else state.chats.unshift(action.payload);
                state.chat = action.payload;
              })
              .addCase(deleteChat.fulfilled, (state, action) => {
                state.chats = state.chats.filter((c) => c._id !== action.payload);
                if (state.chat && state.chat._id === action.payload) state.chat = null;
              });
          },
        });


        export default chatSlice.reducer;
    
