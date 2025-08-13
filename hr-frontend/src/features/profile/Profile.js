import {
  Alert,
  Avatar,
  Box,
  Button,
  CircularProgress,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfile } from "./profileSlice";

// Saját profil oldal: név, avatar, jelszó szerkesztése
const Profile = () => {
  const dispatch = useDispatch();
  const { profile, loading, error } = useSelector((state) => state.profile);
  // Szerkesztő mezők state
  const [editName, setEditName] = useState("");
  const [editAvatar, setEditAvatar] = useState("");
  const [editPassword, setEditPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState("");

  // Profil adatok lekérése betöltéskor
  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  // Profil adatok beállítása szerkesztő mezőkbe
  useEffect(() => {
    if (profile) {
      setEditName(profile.name || "");
      setEditAvatar(profile.avatar || "");
    }
  }, [profile]);

  // Profil mentése (PUT /api/users/myprofile)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveError("");
    setSaveSuccess("");
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        "/api/users/myprofile",
        {
          name: editName,
          avatar: editAvatar,
          password: editPassword || undefined, // csak ha meg van adva
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSaveSuccess(res.data.message);
      setEditPassword("");
      dispatch(fetchProfile());
    } catch (err) {
      setSaveError(err?.response?.data?.message || "Hiba a profil mentésekor.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box maxWidth={400} mx="auto" mt={4}>
      <Typography variant="h5" mb={2}>
        Saját profil
      </Typography>
      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}
      {profile && (
        <Paper sx={{ p: 2 }}>
          {/* Avatar előnézet és szerkesztés */}
          <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
            <Avatar src={editAvatar} sx={{ width: 80, height: 80, mb: 1 }} />
            <TextField
              label="Avatar URL"
              value={editAvatar}
              onChange={(e) => setEditAvatar(e.target.value)}
              fullWidth
              margin="normal"
            />
          </Box>
          {/* Név és jelszó szerkesztés */}
          <form onSubmit={handleSubmit}>
            <TextField
              label="Név"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Új jelszó (opcionális)"
              type="password"
              value={editPassword}
              onChange={(e) => setEditPassword(e.target.value)}
              fullWidth
              margin="normal"
              autoComplete="new-password"
            />
            {saveError && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {saveError}
              </Alert>
            )}
            {saveSuccess && (
              <Alert severity="success" sx={{ mt: 2 }}>
                {saveSuccess}
              </Alert>
            )}
            <Box mt={2}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={saving}
              >
                {saving ? <CircularProgress size={24} /> : "Mentés"}
              </Button>
            </Box>
          </form>
        </Paper>
      )}
    </Box>
  );
};

export default Profile;
