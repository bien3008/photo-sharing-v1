import React, { useState, useEffect } from "react";
import {
  Divider,
  List,
  ListItemButton,
  ListItemText,
  Typography,
  CircularProgress,
  Badge,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import "./styles.css";
import fetchModel from "../../lib/fetchModelData";

function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUsers = async () => {
      let data = await fetchModel("/user/list");
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
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <Badge 
                  badgeContent={user.photo_count || 0} 
                  color="success" 
                  title="Photos"
                  sx={{ 
                    cursor: "default",
                    "& .MuiBadge-badge": { backgroundColor: "#4caf50", color: "white" } 
                  }}
                />
                <Badge 
                  badgeContent={user.comment_count || 0} 
                  color="error" 
                  title="Comments"
                  sx={{ 
                    cursor: "pointer", 
                    "& .MuiBadge-badge": { backgroundColor: "#f44336", color: "white" },
                    "&:hover": { transform: "scale(1.1)" },
                    transition: "transform 0.2s"
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/comments/${user._id}`);
                  }}
                />
              </Box>
            </ListItemButton>
            <Divider />
          </div>
        ))}
      </List>
    </div>
  );
}

export default UserList;
