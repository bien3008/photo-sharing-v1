import React, { useState, useEffect } from "react";
import {
  Divider,
  List,
  ListItemButton,
  ListItemText,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import "./styles.css";
import fetchModel from "../../lib/fetchModelData";
import models from "../../lib/models";

function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUsers = async () => {
      let data = await fetchModel("/user/list");
      if (!data) {
        data = models.userListModel();
      }
      if (data) {
        setUsers(data);
      }
      setLoading(false);
    };
    loadUsers();
  }, []);

  if (loading) {
    return <CircularProgress />;
  }

  const handleUserClick = (userId) => {
    navigate(`/users/${userId}`);
  };

  return (
    <div>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
        👥 Users List
      </Typography>
      <List component="nav">
        {users.map((user) => (
          <div key={user._id}>
            <ListItemButton
              onClick={() => handleUserClick(user._id)}
              sx={{
                "&:hover": {
                  backgroundColor: "#f5f5f5",
                  transform: "translateX(4px)",
                },
                transition: "all 0.2s ease",
                py: 1.5,
              }}
            >
              <ListItemText
                primary={`${user.first_name} ${user.last_name}`}
                secondary={user.occupation}
                primaryTypographyProps={{
                  fontWeight: 500,
                }}
              />
            </ListItemButton>
            <Divider />
          </div>
        ))}
      </List>
    </div>
  );
}

export default UserList;
