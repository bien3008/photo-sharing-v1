import React, { useContext, useEffect, useMemo, useState } from "react";
import {
  Typography,
  Box,
  CircularProgress,
  Card,
  CardContent,
  CardMedia,
  List,
  ListItem,
  Button,
  MobileStepper,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";

import "./styles.css";
import fetchModel from "../../lib/fetchModelData";
import models from "../../lib/models";
import { AppContext } from "../../context/AppContext";
import { formatDateTime } from "../../lib/utils";

function UserPhotos() {
  const { advancedEnabled } = useContext(AppContext);
  const { userId, photoId } = useParams();
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Use webpack context to load images from src/images
  // Try exact file name (from backend). If not present, fallback to same name with .svg
  const imagesContext = require.context("../../images", false, /\.(png|jpe?g|svg)$/);

  const photoSrc = (fileName) => {
    if (!fileName) return "";
    try {
      return imagesContext(`./${fileName}`);
    } catch (e) {
      // fallback: try replacing .jpg/.jpeg with .svg
      const svgName = fileName.replace(/\.jpe?g$/i, ".svg");
      try {
        return imagesContext(`./${svgName}`);
      } catch (e2) {
        return "";
      }
    }
  };

  useEffect(() => {
    let ignore = false;
    if (!userId) return () => {};

    setLoading(true);

    fetchModel(`/photosOfUser/${userId}`)
      .then((data) => {
        if (ignore) return;
        if (Array.isArray(data)) {
          setPhotos(data);
        } else {
          const fakeData = models.photoOfUserModel(userId);
          setPhotos(Array.isArray(fakeData) ? fakeData : []);
        }
        setLoading(false);
      })
      .catch(() => {
        if (ignore) return;
        const fakeData = models.photoOfUserModel(userId);
        setPhotos(Array.isArray(fakeData) ? fakeData : []);
        setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [userId]);

  const selectedPhotoIndex = useMemo(() => {
    if (!advancedEnabled) return -1;
    if (!photos.length) return -1;
    if (!photoId) return 0;
    const idx = photos.findIndex((p) => String(p._id) === String(photoId));
    return idx >= 0 ? idx : 0;
  }, [advancedEnabled, photos, photoId]);

  const selectedPhoto =
    selectedPhotoIndex >= 0 ? photos[selectedPhotoIndex] : null;

  useEffect(() => {
    if (!advancedEnabled) return;
    if (!userId) return;
    if (!photos.length) return;

    if (!photoId) {
      navigate(`/photos/${userId}/${photos[0]._id}`, { replace: true });
    }
  }, [advancedEnabled, userId, photos, photoId, navigate]);

  const handleNextPhoto = () => {
    if (selectedPhotoIndex < photos.length - 1) {
      const nextPhoto = photos[selectedPhotoIndex + 1];
      navigate(`/photos/${userId}/${nextPhoto._id}`);
    }
  };

  const handlePrevPhoto = () => {
    if (selectedPhotoIndex > 0) {
      const prevPhoto = photos[selectedPhotoIndex - 1];
      navigate(`/photos/${userId}/${prevPhoto._id}`);
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (photos.length === 0) {
    return <Typography>No photos found for this user</Typography>;
  }

  if (advancedEnabled && selectedPhoto) {
    return (
      <Box sx={{ p: 2 }}>
        <Card>
          <CardMedia
            component="img"
            image={photoSrc(selectedPhoto.file_name)}
            alt={selectedPhoto.file_name}
            sx={{
              maxHeight: 500,
              objectFit: "contain",
              bgcolor: "background.default"
            }}
          />
          <CardContent>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
              📅 {formatDateTime(selectedPhoto.date_time)}
            </Typography>

            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: "bold" }}>
              💬 Comments:
            </Typography>
            {selectedPhoto.comments && selectedPhoto.comments.length > 0 ? (
              <List sx={{ pl: 0 }}>
                {selectedPhoto.comments.map((comment) => (
                  <ListItem key={comment._id} sx={{ pl: 0, pb: 1, display: "block" }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
                      <Button
                        variant="text"
                        size="small"
                        onClick={() => navigate(`/users/${comment.user._id}`)}
                        sx={{
                          textTransform: "none",
                          p: 0,
                          mr: 1,
                          color: "primary.main",
                          "&:hover": { textDecoration: "underline" },
                        }}
                      >
                        {comment.user.first_name} {comment.user.last_name}
                      </Button>
                      <Typography variant="caption" color="textSecondary">
                        {formatDateTime(comment.date_time)}
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ pl: 1, borderLeft: "2px solid #ddd" }}>
                      {comment.comment}
                    </Typography>
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography variant="body2" color="textSecondary">
                No comments yet
              </Typography>
            )}
          </CardContent>

          <MobileStepper
            variant="text"
            steps={photos.length}
            position="static"
            activeStep={selectedPhotoIndex}
            nextButton={
              <Button
                size="small"
                onClick={handleNextPhoto}
                disabled={selectedPhotoIndex === photos.length - 1}
              >
                Next →
              </Button>
            }
            backButton={
              <Button
                size="small"
                onClick={handlePrevPhoto}
                disabled={selectedPhotoIndex === 0}
              >
                ← Back
              </Button>
            }
          />
        </Card>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      {photos.map((photo) => (
        <Card key={photo._id} sx={{ mb: 3 }}>
          <CardContent>
            <Box
              component="img"
              src={photoSrc(photo.file_name)}
              alt={photo.file_name}
              sx={{ width: "100%", mb: 2, borderRadius: 1, minHeight: 300 }}
            />

            <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
              📅 {formatDateTime(photo.date_time)}
            </Typography>

            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: "bold" }}>
              💬 Comments:
            </Typography>
            {photo.comments && photo.comments.length > 0 ? (
              <List sx={{ pl: 0 }}>
                {photo.comments.map((comment) => (
                  <ListItem key={comment._id} sx={{ pl: 0, pb: 1, display: "block" }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
                      <Button
                        variant="text"
                        size="small"
                        onClick={() => navigate(`/users/${comment.user._id}`)}
                        sx={{
                          textTransform: "none",
                          p: 0,
                          mr: 1,
                          color: "primary.main",
                          "&:hover": { textDecoration: "underline" },
                        }}
                      >
                        {comment.user.first_name} {comment.user.last_name}
                      </Button>
                      <Typography variant="caption" color="textSecondary">
                        {formatDateTime(comment.date_time)}
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ pl: 1, borderLeft: "2px solid #ddd" }}>
                      {comment.comment}
                    </Typography>
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography variant="body2" color="textSecondary">
                No comments yet
              </Typography>
            )}
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}

export default UserPhotos;
