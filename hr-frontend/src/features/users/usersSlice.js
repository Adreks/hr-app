import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// Publikus user lista lekérdezése (keresés, lapozás támogatott)
export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async ({ q = "", page = 1, limit = 10 } = {}, thunkAPI) => {
    try {
      const response = await axios.get("/api/users", {
        params: { q, page, limit },
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// User slice: user lista, keresés/lapozás állapot, hiba, loading
const usersSlice = createSlice({
  name: "users",
  initialState: {
    users: [], // aktuális oldal user listája
    total: 0, // összes találat száma
    loading: false,
    error: null,
    q: "", // keresőszöveg
    page: 1, // aktuális oldal
    limit: 10, // oldalankénti elemszám
  },
  reducers: {
    // Keresés/lapozás paraméterek beállítása
    setUsersQuery: (state, action) => {
      state.q = action.payload.q ?? state.q;
      state.page = action.payload.page ?? state.page;
      state.limit = action.payload.limit ?? state.limit;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.users;
        state.total = action.payload.total;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Hiba a felhasználók lekérdezésekor";
      });
  },
});

export const { setUsersQuery } = usersSlice.actions;
export default usersSlice.reducer;
