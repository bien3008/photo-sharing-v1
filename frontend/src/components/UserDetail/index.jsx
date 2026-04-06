import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  CircularProgress,
  Button,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";

import "./styles.css";
import fetchModel from "../../lib/fetchModelData";
import models from "../../lib/models";

function UserDetail() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUser = async () => {
      let data = await fetchModel(`/user/${userId}`);
      if (!data) {
        data = models.userModel(userId);
      }
      if (data) {
        setUser(data);
      }
      setLoading(false);
    };
    loadUser();
  }, [userId]);

  if (loading) {
    return <CircularProgress />;
  }

  if (!user) {
    return <Typography>User not found</Typography>;
  }

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>
        👤 {user.first_name} {user.last_name}
      </Typography>
      <Box
        sx={{
          mb: 3,
          p: 2,
          backgroundColor: "#f9f9f9",
          borderRadius: 1,
          border: "1px solid #eee",
        }}
      >
        <Typography variant="body2" sx={{ mb: 1 }}>
          <strong>📍 Location:</strong> {user.location}
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          <strong>💼 Occupation:</strong> {user.occupation}
        </Typography>
        <Box sx={{ mt: 2, pt: 2, borderTop: "1px solid #ddd" }}>
          <Typography variant="body2" sx={{ mb: 1, fontWeight: "bold" }}>
            📝 About:
          </Typography>
          <Typography variant="body2">{user.description}</Typography>
        </Box>
      </Box>
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate(`/photos/${userId}`)}
        sx={{ mt: 2 }}
      >
        📷 View Photos
      </Button>
    </Box>
  );
}

export default UserDetail;
