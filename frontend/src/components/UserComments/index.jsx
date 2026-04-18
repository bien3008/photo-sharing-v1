import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  CircularProgress,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Divider,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import fetchModel from "../../lib/fetchModelData";
import { formatDateTime } from "../../lib/utils";

function photoSrc(fileName) {
  try {
    return require(`../../images/${fileName}`);
  } catch {
    return "";
  }
}

function UserComments() {
  const { userId } = useParams();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let ignore = false;
    if (!userId) return;

    setLoading(true);
    fetchModel(`/commentsOfUser/${userId}`)
      .then((data) => {
        if (!ignore) {
          setComments(Array.isArray(data) ? data : []);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [userId]);

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>
        💬 User's Comments
      </Typography>
      {comments.length === 0 ? (
        <Typography>No comments found for this user.</Typography>
      ) : (
        <List>
          {comments.map((item, index) => (
            <React.Fragment key={item._id}>
              <ListItem
                alignItems="flex-start"
                sx={{
                  cursor: "pointer",
                  "&:hover": { backgroundColor: "#f5f5f5" },
                  borderRadius: 1,
                }}
                onClick={() => navigate(`/photos/${item.photo.user_id}/${item.photo._id}`)}
              >
                <ListItemAvatar>
                  <Avatar
                    variant="square"
                    src={photoSrc(item.photo.file_name)}
                    sx={{ width: 80, height: 80, mr: 2, borderRadius: 1 }}
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={item.comment}
                  secondary={
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: "block", mt: 1 }}
                    >
                      {formatDateTime(item.date_time)}
                    </Typography>
                  }
                />
              </ListItem>
              {index < comments.length - 1 && <Divider component="li" />}
            </React.Fragment>
          ))}
        </List>
      )}
    </Box>
  );
}

export default UserComments;
