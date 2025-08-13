import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import AppWithRouter from "./App";
import { setCredentials } from "./features/auth/authSlice";
import store from "./store";

// Auth state helyreállítása localStorage-ből
const token = localStorage.getItem("token");
const user = localStorage.getItem("user");
if (token && user) {
  store.dispatch(setCredentials({ token, user: JSON.parse(user) }));
}

function Root() {
  const [mode, setMode] = useState("light");
  const theme = createTheme({
    palette: {
      mode,
    },
  });
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppWithRouter setMode={setMode} mode={mode} />
      </ThemeProvider>
    </Provider>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);
