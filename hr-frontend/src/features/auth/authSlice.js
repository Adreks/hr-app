import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// Bejelentkezés thunk: POST /api/auth/login, token és user mentése
export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }, thunkAPI) => {
    try {
      const response = await axios.post("/api/auth/login", { email, password });
      return response.data;
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        error?.response?.data ||
        "Hiba a bejelentkezéskor";
      return thunkAPI.rejectWithValue(msg);
    }
  }
);

// Regisztráció thunk: POST /api/users/register, majd automatikus bejelentkeztetés
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async ({ email, password }, thunkAPI) => {
    try {
      await axios.post("/api/users/register", { email, password });
      const loginResponse = await axios.post("/api/auth/login", {
        email,
        password,
      });
      return loginResponse.data;
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        error?.response?.data ||
        "Hiba a regisztrációnál";
      return thunkAPI.rejectWithValue(msg);
    }
  }
);

// Auth slice: user, token, loading, error, localStorage kezelés
const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null, // bejelentkezett user adatai
    token: null, // JWT token
    loading: false,
    error: null,
  },
  reducers: {
    // Kijelentkezés: user/token törlése, localStorage ürítése
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
    // Auth state helyreállítása localStorage-ből (pl. oldalfrissítés után)
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
  },
  extraReducers: (builder) => {
    builder
      // Bejelentkezés
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem("token", action.payload.token);
        localStorage.setItem("user", JSON.stringify(action.payload.user));
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Hiba a bejelentkezéskor";
      })
      // Regisztráció
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem("token", action.payload.token);
        localStorage.setItem("user", JSON.stringify(action.payload.user));
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Hiba a regisztrációnál";
      });
  },
});

export const { logout, setCredentials } = authSlice.actions;
export default authSlice.reducer;
