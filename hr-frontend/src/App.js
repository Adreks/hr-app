import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import MenuIcon from "@mui/icons-material/Menu";
import {
  AppBar,
  Button,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Link,
  Route,
  BrowserRouter as Router,
  Routes,
  useNavigate,
} from "react-router-dom";
import { logout } from "./features/auth/authSlice";
import Login from "./features/auth/Login";
import Register from "./features/auth/Register";
import ResetPassword from "./features/auth/ResetPassword";
import Profile from "./features/profile/Profile";
import UsersList from "./features/users/UsersList";

// Fő layout: header, navigáció, jogosultság-alapú menü, dark/light mód, mobil/desktop menü
function App({ setMode, mode }) {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [anchorEl, setAnchorEl] = useState(null);

  // Kijelentkezés után átirányítás a login oldalra
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  // Címre kattintás: login vagy profil oldalra visz
  const handleTitleClick = () => {
    if (token) {
      navigate("/profile");
    } else {
      navigate("/login");
    }
  };

  // Mobil menü nyit/zár
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Menü elemek: jogosultság alapján
  const menuItems = !token
    ? [
        { label: "Bejelentkezés", to: "/login" },
        { label: "Regisztráció", to: "/register" },
      ]
    : [
        { label: "Profil", to: "/profile" },
        { label: "Felhasználók", to: "/users" },
        { label: "Kijelentkezés", action: () => dispatch(logout()) },
      ];

  return (
    <>
      {/* Header, dark/light mód, mobil/desktop menü */}
      <AppBar position="static">
        <Toolbar>
          <Typography
            variant="h6"
            sx={{ flexGrow: 1, cursor: "pointer" }}
            onClick={handleTitleClick}
          >
            HR App
          </Typography>
          <IconButton
            sx={{ ml: 1 }}
            color="inherit"
            onClick={() => setMode(mode === "light" ? "dark" : "light")}
          >
            {mode === "light" ? <Brightness4Icon /> : <Brightness7Icon />}
          </IconButton>
          {isMobile ? (
            <>
              <IconButton color="inherit" onClick={handleMenuOpen}>
                <MenuIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                {menuItems.map((item, idx) =>
                  item.to ? (
                    <MenuItem
                      key={item.label}
                      component={Link}
                      to={item.to}
                      onClick={handleMenuClose}
                    >
                      {item.label}
                    </MenuItem>
                  ) : (
                    <MenuItem
                      key={item.label}
                      onClick={() => {
                        item.action();
                        handleMenuClose();
                      }}
                    >
                      {item.label}
                    </MenuItem>
                  )
                )}
              </Menu>
            </>
          ) : (
            menuItems.map((item, idx) =>
              item.to ? (
                <Button
                  key={item.label}
                  color="inherit"
                  component={Link}
                  to={item.to}
                >
                  {item.label}
                </Button>
              ) : (
                <Button key={item.label} color="inherit" onClick={item.action}>
                  {item.label}
                </Button>
              )
            )
          )}
        </Toolbar>
      </AppBar>
      {/* Oldalak route-ok szerint */}
      <Container sx={{ mt: 4 }}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          {token && <Route path="/profile" element={<Profile />} />}
          {token && <Route path="/users" element={<UsersList />} />}
          <Route path="/" element={!token ? <Login /> : <Profile />} />
        </Routes>
      </Container>
    </>
  );
}

// Router wrapper, hogy a useNavigate működjön a fő App komponensben
export default function AppWithRouter(props) {
  return (
    <Router>
      <App {...props} />
    </Router>
  );
}
