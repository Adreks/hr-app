import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "./authSlice";
import {
  Button,
  TextField,
  Box,
  Typography,
  Alert,
  CircularProgress,
  Link as MuiLink,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

// Bejelentkezés oldal: email, jelszó, jelszó visszaállítás link
const Login = () => {
  const dispatch = useDispatch();
  const { loading, error, token } = useSelector((state) => state.auth);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // Sikeres bejelentkezés után átirányítás a profil oldalra
  useEffect(() => {
    if (token) {
      navigate("/profile");
    }
  }, [token, navigate]);

  // Bejelentkezés submit
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login({ email, password }));
  };

  return (
    <Box maxWidth={400} mx="auto" mt={4}>
      <Typography variant="h5" mb={2}>
        Bejelentkezés
      </Typography>
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
        <TextField
          label="Jelszó"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
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
            {loading ? <CircularProgress size={24} /> : "Bejelentkezés"}
          </Button>
        </Box>
      </form>
      {/* Jelszó visszaállítás link */}
      <Box mt={2} textAlign="center">
        <MuiLink href="/reset-password" underline="hover">
          Elfelejtetted a jelszavad? Jelszó visszaállítása
        </MuiLink>
      </Box>
    </Box>
  );
};

export default Login;
