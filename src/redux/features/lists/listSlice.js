import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Get all lists
export const fetchLists = createAsyncThunk('lists/fetchLists', async (_, thunkAPI) => {
  try {
    const res = await axios.get('/api/lists');
    return res.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

// Create a list
export const createList = createAsyncThunk('lists/createList', async (listData, thunkAPI) => {
  try {
    console.log("dans le  debut redux list slice")
    const token = localStorage.getItem('token');
    const res = await axios.post('/api/lists/create-list', listData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log("A la fin du redux list slice")
    return res.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

// Delete a list
export const deleteList = createAsyncThunk('lists/deleteList', async (id, thunkAPI) => {
  try {
    const token = localStorage.getItem('token');
    await axios.delete(`/api/lists/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return id;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

const listSlice = createSlice({
  name: 'lists',
  initialState: {
    lists: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchLists.pending, state => {
        state.status = 'loading';
      })
      .addCase(fetchLists.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.lists = action.payload;
      })
      .addCase(fetchLists.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      })

      .addCase(createList.fulfilled, (state, action) => {
        state.lists.push(action.payload);
      })
      .addCase(deleteList.fulfilled, (state, action) => {
        state.lists = state.lists.filter(list => list._id !== action.payload);
      });
  },
});

export default listSlice.reducer;