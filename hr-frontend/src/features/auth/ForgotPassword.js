import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useState } from "react";

// Elfelejtett jelszó oldal: email bekérés, token generálás, új jelszó modal
const ForgotPassword = () => {
  // Email bekérés state
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  // Token és új jelszó modal state
  const [resetToken, setResetToken] = useState("");
  const [showReset, setShowReset] = useState(false);
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const [resetError, setResetError] = useState("");
  const [resetSuccess, setResetSuccess] = useState("");

  // Email beküldése, token generálás
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    setResetError("");
    setResetSuccess("");
    try {
      const res = await axios.post("/api/users/forgot-password", { email });
      setResetToken(res.data.resetToken);
      setShowReset(true);
    } catch (err) {
      setError(
        err?.response?.data?.message || "Hiba a jelszó-visszaállítás során."
      );
    } finally {
      setLoading(false);
    }
  };

  // Új jelszó beküldése tokennel
  const handleReset = async (e) => {
    e.preventDefault();
    setResetError("");
    setResetSuccess("");
    if (password1 !== password2) {
      setResetError("A két jelszó nem egyezik!");
      return;
    }
    setResetLoading(true);
    try {
      const res = await axios.post("/api/users/reset-password", {
        token: resetToken,
        password: password1,
      });
      setResetSuccess(res.data.message);
      setShowReset(false);
      setSuccess(
        "Jelszó sikeresen megváltoztatva! Most már bejelentkezhetsz az új jelszóval."
      );
      setEmail("");
      setPassword1("");
      setPassword2("");
    } catch (err) {
      setResetError(
        err?.response?.data?.message || "Hiba a jelszó módosításakor."
      );
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <Box maxWidth={400} mx="auto" mt={4}>
      <Typography variant="h5" mb={2}>
        Elfelejtett jelszó
      </Typography>
      {/* Email bekérő űrlap */}
      <form onSubmit={handleSubmit}>
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mt: 2 }}>
            {success}
          </Alert>
        )}
        <Box mt={2}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} />
            ) : (
              "Jelszó-visszaállítás indítása"
            )}
          </Button>
        </Box>
      </form>
      {/* Új jelszó modal, csak sikeres email után */}
      <Dialog open={showReset} onClose={() => setShowReset(false)}>
        <DialogTitle>Új jelszó megadása</DialogTitle>
        <DialogContent>
          <form onSubmit={handleReset}>
            <TextField
              label="Új jelszó"
              type="password"
              value={password1}
              onChange={(e) => setPassword1(e.target.value)}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Új jelszó újra"
              type="password"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
              fullWidth
              margin="normal"
              required
            />
            {resetError && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {resetError}
              </Alert>
            )}
            {resetSuccess && (
              <Alert severity="success" sx={{ mt: 2 }}>
                {resetSuccess}
              </Alert>
            )}
            <DialogActions>
              <Button onClick={() => setShowReset(false)} color="secondary">
                Mégse
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={resetLoading}
              >
                {resetLoading ? (
                  <CircularProgress size={24} />
                ) : (
                  "Jelszó beállítása"
                )}
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default ForgotPassword;
