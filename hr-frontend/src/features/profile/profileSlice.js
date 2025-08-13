import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Saját profil lekérdezése (GET /api/users/myprofile, token szükséges)
export const fetchProfile = createAsyncThunk(
  "profile/fetchProfile",
  async (_, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const token = state.auth.token;
      const response = await axios.get("/api/users/myprofile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// Profile slice: profil adatok, loading, error
const profileSlice = createSlice({
  name: "profile",
  initialState: {
    profile: null, // user profil adatai
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Hiba a profil lekérdezésekor";
      });
  },
});

export default profileSlice.reducer;
