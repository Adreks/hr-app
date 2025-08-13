import {
  Alert,
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// Jelszó visszaállítás oldal: email bekérés, token generálás, új jelszó 2x
const ResetPassword = () => {
  // Lépés: 1 = email, 2 = új jelszó, 3 = siker
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Email beküldése, token generálás
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await axios.post("/api/users/forgot-password", { email });
      setToken(res.data.resetToken);
      setStep(2);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Hiba a jelszó-visszaállítás indításakor."
      );
    } finally {
      setLoading(false);
    }
  };

  // Új jelszó beküldése tokennel
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (password1 !== password2) {
      setError("A két jelszó nem egyezik!");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post("/api/users/reset-password", {
        token,
        password: password1,
      });
      setSuccess(res.data.message);
      setStep(3);
      setEmail("");
      setPassword1("");
      setPassword2("");
    } catch (err) {
      setError(err?.response?.data?.message || "Hiba a jelszó módosításakor.");
    } finally {
      setLoading(false);
    }
  };

  // Sikeres jelszóváltás után vissza a bejelentkezéshez
  const handleGoToLogin = () => {
    navigate("/login");
  };

  return (
    <Box maxWidth={400} mx="auto" mt={4}>
      <Typography variant="h5" mb={2}>
        Jelszó visszaállítása
      </Typography>
      {/* 1. lépés: email bekérés */}
      {step === 1 && (
        <form onSubmit={handleEmailSubmit}>
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
              {loading ? <CircularProgress size={24} /> : "Tovább"}
            </Button>
          </Box>
        </form>
      )}
      {/* 2. lépés: új jelszó 2x */}
      {step === 2 && (
        <form onSubmit={handlePasswordSubmit}>
          <TextField
            label="Új jelszó megadása"
            type="password"
            value={password1}
            onChange={(e) => setPassword1(e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Új jelszó megadása újra"
            type="password"
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
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
              {loading ? <CircularProgress size={24} /> : "Jelszó módosítása"}
            </Button>
          </Box>
        </form>
      )}
      {/* 3. lépés: sikeres jelszóváltás, vissza a loginra */}
      {step === 3 && (
        <Box textAlign="center" mt={4}>
          <Alert severity="success" sx={{ mb: 2 }}>
            Jelszó sikeresen megváltoztatva!
          </Alert>
          <Button variant="contained" color="primary" onClick={handleGoToLogin}>
            Vissza a bejelentkezéshez
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default ResetPassword;
