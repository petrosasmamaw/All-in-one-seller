import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '');
const SELLERAPI_URL = `${BASE_URL}/api/sellers/`;

export const fetchSellerByUserId = createAsyncThunk(
  "sellers/fetchSellerByUserId",
  async (userId) => {
    const response = await axios.get(`${SELLERAPI_URL}user/${userId}`);
    return response.data;
  }
);

export const createSeller = createAsyncThunk(
  "sellers/createSeller",
  async (sellerData) => {
    const formData = new FormData();
    formData.append("name", sellerData.name);
    formData.append("userId", sellerData.userId);
    formData.append("phoneNo", sellerData.phoneNo);
    formData.append("category", sellerData.category);

    if (sellerData.image) {
      formData.append("image", sellerData.image);
    }

    const response = await axios.post(SELLERAPI_URL, formData);
    return response.data;
  }
);

export const updateSeller = createAsyncThunk(
  "sellers/updateSeller",
  async ({ id, sellerData }) => {
    const formData = new FormData();
    formData.append("name", sellerData.name);
    formData.append("userId", sellerData.userId);
    formData.append("phoneNo", sellerData.phoneNo);
    formData.append("category", sellerData.category);

    if (sellerData.image) {
      formData.append("image", sellerData.image);
    }

    const response = await axios.put(`${SELLERAPI_URL}${id}`, formData);
    return response.data;
  }
);

const sellersSlice = createSlice({
  name: "sellers",
  initialState: {
    seller: null,
    status: "idle",
    error: null,
  },
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchSellerByUserId.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchSellerByUserId.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.seller = action.payload;
      })
      .addCase(fetchSellerByUserId.rejected, (state) => {
        state.status = "failed";
        state.seller = null;
      })

      .addCase(createSeller.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.seller = action.payload; // ⭐ KEY FIX
      })

      .addCase(updateSeller.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.seller = action.payload; // ⭐ KEY FIX
      });
  },
});

export default sellersSlice.reducer;
