import SearchIcon from "@mui/icons-material/Search";
import {
  Alert,
  Avatar,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Pagination,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, setUsersQuery } from "./usersSlice";

// Publikus user lista, admin esetén szerkesztés/törlés funkciókkal
const UsersList = () => {
  const dispatch = useDispatch();
  // Redux state: user lista, keresés/lapozás paraméterek
  const { users, loading, error, total, q, page, limit } = useSelector(
    (state) => state.users
  );
  // Bejelentkezett user (admin jogosultság ellenőrzéshez)
  const authUser = useSelector((state) => state.auth.user);
  const isAdmin = authUser && authUser.role === "admin";
  // Admin szerkesztés/törlés modals state
  const [editUser, setEditUser] = useState(null);
  const [editName, setEditName] = useState("");
  const [editAvatar, setEditAvatar] = useState("");
  const [editRole, setEditRole] = useState("user");
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState("");
  const [editSuccess, setEditSuccess] = useState("");
  const [deleteUser, setDeleteUser] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  // Lista lekérdezése keresés/lapozás paraméterek alapján
  useEffect(() => {
    dispatch(fetchUsers({ q, page, limit }));
  }, [dispatch, q, page, limit]);

  // Keresőmező változás
  const handleSearchChange = (e) => {
    dispatch(setUsersQuery({ q: e.target.value, page: 1 }));
  };
  // Oldal váltás
  const handlePageChange = (event, value) => {
    dispatch(setUsersQuery({ page: value }));
  };
  // Oldalankénti elemszám váltás
  const handleLimitChange = (e) => {
    dispatch(setUsersQuery({ limit: parseInt(e.target.value, 10), page: 1 }));
  };

  // Admin: szerkesztés modal megnyitása
  const handleEditClick = (user) => {
    setEditUser(user);
    setEditName(user.name || "");
    setEditAvatar(user.avatar || "");
    setEditRole(user.role);
    setEditError("");
    setEditSuccess("");
  };
  // Admin: user mentése
  const handleEditSave = async () => {
    setEditLoading(true);
    setEditError("");
    setEditSuccess("");
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `/api/users/${editUser._id}`,
        {
          name: editName,
          avatar: editAvatar,
          role: editRole,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setEditSuccess("Felhasználó frissítve.");
      setEditUser(null);
      dispatch(fetchUsers({ q, page, limit }));
    } catch (err) {
      setEditError(err?.response?.data?.message || "Hiba a mentéskor.");
    } finally {
      setEditLoading(false);
    }
  };
  // Admin: törlés modal megnyitása
  const handleDeleteClick = (user) => {
    setDeleteUser(user);
    setDeleteError("");
  };
  // Admin: user törlése
  const handleDeleteConfirm = async () => {
    setDeleteLoading(true);
    setDeleteError("");
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/api/users/${deleteUser._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDeleteUser(null);
      dispatch(fetchUsers({ q, page, limit }));
    } catch (err) {
      setDeleteError(err?.response?.data?.message || "Hiba a törléskor.");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <Box maxWidth={700} mx="auto" mt={4}>
      <Typography variant="h5" mb={2}>
        Felhasználók
      </Typography>
      {/* Keresőmező, oldalankénti elemszám */}
      <Box display="flex" gap={2} mb={2} alignItems="center">
        <TextField
          placeholder="Keresés név, email vagy szerepkör szerint"
          value={q}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          size="small"
          sx={{ flex: 1 }}
        />
        <TextField
          select
          label="Oldalanként"
          value={limit}
          onChange={handleLimitChange}
          size="small"
          sx={{ width: 120 }}
        >
          {[5, 10, 20, 50].map((num) => (
            <MenuItem key={num} value={num}>
              {num}
            </MenuItem>
          ))}
        </TextField>
      </Box>
      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}
      {/* User lista, admin esetén szerkesztés/törlés gombokkal */}
      <List>
        {users.map((user) => (
          <ListItem
            key={user._id}
            divider
            secondaryAction={
              isAdmin && (
                <>
                  <Button
                    variant="outlined"
                    size="small"
                    sx={{ mr: 1 }}
                    onClick={() => handleEditClick(user)}
                  >
                    Szerkesztés
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    onClick={() => handleDeleteClick(user)}
                  >
                    Törlés
                  </Button>
                </>
              )
            }
          >
            <Avatar src={user.avatar} sx={{ mr: 2 }} />
            <ListItemText
              primary={user.name || user.email}
              secondary={`${user.email} (${user.role})`}
            />
          </ListItem>
        ))}
      </List>
      {/* Lapozó */}
      <Box display="flex" justifyContent="center" mt={2}>
        <Pagination
          count={Math.ceil(total / limit) || 1}
          page={page}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>
      {/* Admin szerkesztő modal */}
      <Dialog open={!!editUser} onClose={() => setEditUser(null)}>
        <DialogTitle>Felhasználó szerkesztése</DialogTitle>
        <DialogContent>
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
          <TextField
            label="Név"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Szerepkör"
            select
            value={editRole}
            onChange={(e) => setEditRole(e.target.value)}
            fullWidth
            margin="normal"
          >
            <MenuItem value="user">user</MenuItem>
            <MenuItem value="admin">admin</MenuItem>
          </TextField>
          {editError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {editError}
            </Alert>
          )}
          {editSuccess && (
            <Alert severity="success" sx={{ mt: 2 }}>
              {editSuccess}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditUser(null)} color="secondary">
            Mégse
          </Button>
          <Button
            onClick={handleEditSave}
            variant="contained"
            color="primary"
            disabled={editLoading}
          >
            {editLoading ? <CircularProgress size={24} /> : "Mentés"}
          </Button>
        </DialogActions>
      </Dialog>
      {/* Admin törlés megerősítő modal */}
      <Dialog open={!!deleteUser} onClose={() => setDeleteUser(null)}>
        <DialogTitle>Felhasználó törlése</DialogTitle>
        <DialogContent>
          <Typography>
            Biztosan törölni szeretnéd ezt a felhasználót?
          </Typography>
          {deleteError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {deleteError}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteUser(null)} color="secondary">
            Mégse
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            variant="contained"
            color="error"
            disabled={deleteLoading}
          >
            {deleteLoading ? <CircularProgress size={24} /> : "Törlés"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UsersList;
