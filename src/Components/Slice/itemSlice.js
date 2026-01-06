import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '');
const ITEMAPI_URL = `${BASE_URL}/api/items/`;
export const fetchAllItems = createAsyncThunk(
  'items/fetchAllItems',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(ITEMAPI_URL);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Fetch items by seller ID
export const fetchItemsBySellerId = createAsyncThunk(
  'items/fetchItemsBySellerId',
  async (sellerId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${ITEMAPI_URL}seller/${sellerId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Fetch single item by ID
export const fetchItemById = createAsyncThunk(
  'items/fetchItemById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${ITEMAPI_URL}${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Create item
export const createItem = createAsyncThunk(
  'items/createItem',
  async (itemData, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('name', itemData.name);
      formData.append('sellerId', itemData.sellerId);
      formData.append('category', itemData.category);
      formData.append('description', itemData.description);
      formData.append('price', Number(itemData.price)); // ✅ ensure number

      if (itemData.image) {
        formData.append('image', itemData.image);
      }

      const response = await axios.post(ITEMAPI_URL, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Update item
export const updateItem = createAsyncThunk(
  'items/updateItem',
  async ({ id, itemData }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('name', itemData.name);
      formData.append('sellerId', itemData.sellerId);
      formData.append('category', itemData.category);
      formData.append('description', itemData.description);
      formData.append('price', Number(itemData.price)); // ✅ ensure number

      if (itemData.image) {
        formData.append('image', itemData.image);
      }

      const response = await axios.put(`${ITEMAPI_URL}${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Delete item
export const deleteItem = createAsyncThunk(
  'items/deleteItem',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${ITEMAPI_URL}${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

/* ============================
   SLICE
============================ */

const itemsSlice = createSlice({
  name: 'items',
  initialState: {
    items: [],
    item: null,
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      /* ===== FETCH ALL ITEMS ===== */
      .addCase(fetchAllItems.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAllItems.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchAllItems.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      /* ===== FETCH ITEMS BY SELLER ===== */
      .addCase(fetchItemsBySellerId.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchItemsBySellerId.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchItemsBySellerId.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      /* ===== FETCH SINGLE ITEM ===== */
      .addCase(fetchItemById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchItemById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.item = action.payload;
      })
      .addCase(fetchItemById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      /* ===== CREATE ITEM ===== */
      .addCase(createItem.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createItem.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items.push(action.payload);
      })
      .addCase(createItem.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      /* ===== UPDATE ITEM ===== */
      .addCase(updateItem.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateItem.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.items.findIndex(
          (item) => item._id === action.payload._id
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(updateItem.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      /* ===== DELETE ITEM ===== */
      .addCase(deleteItem.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteItem.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = state.items.filter(
          (item) => item._id !== action.payload
        );
      })
      .addCase(deleteItem.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default itemsSlice.reducer;
