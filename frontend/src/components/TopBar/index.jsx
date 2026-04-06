import React, { useContext, useEffect, useMemo, useState } from "react";
import { AppBar, Toolbar, Typography, Checkbox, FormControlLabel } from "@mui/material";
import { matchPath, useLocation } from "react-router-dom";

import "./styles.css";
import fetchModel from "../../lib/fetchModelData";
import models from "../../lib/models";
import { AppContext } from "../../context/AppContext";

function TopBar() {
  const { advancedEnabled, setAdvancedEnabled } = useContext(AppContext);
  const location = useLocation();
  const [userName, setUserName] = useState("");

  const routeInfo = useMemo(() => {
    const usersMatch = matchPath({ path: "/users/:userId" }, location.pathname);
    if (usersMatch?.params?.userId) {
      return { view: "user", userId: usersMatch.params.userId };
    }

    const photosMatch = matchPath(
      { path: "/photos/:userId/:photoId?" },
      location.pathname
    );
    if (photosMatch?.params?.userId) {
      return { view: "photos", userId: photosMatch.params.userId };
    }

    if (matchPath({ path: "/users" }, location.pathname)) {
      return { view: "users" };
    }

    return { view: "other" };
  }, [location.pathname]);

  useEffect(() => {
    let ignore = false;
    if (!routeInfo.userId) {
      setUserName("");
      return () => {
        ignore = true;
      };
    }

    fetchModel(`/user/${routeInfo.userId}`)
      .then((user) => {
        if (ignore) return;
        if (user) {
          const fullName = `${user.first_name} ${user.last_name}`.trim();
          setUserName(fullName);
        } else {
          const fakeUser = models.userModel(routeInfo.userId);
          if (fakeUser) {
            const fullName = `${fakeUser.first_name} ${fakeUser.last_name}`.trim();
            setUserName(fullName);
          }
        }
      })
      .catch(() => {
        if (ignore) return;
        const fakeUser = models.userModel(routeInfo.userId);
        if (fakeUser) {
          const fullName = `${fakeUser.first_name} ${fakeUser.last_name}`.trim();
          setUserName(fullName);
        } else {
          setUserName("");
        }
      });

    return () => {
      ignore = true;
    };
  }, [routeInfo.userId]);

  const contextLabel = (() => {
    if (routeInfo.view === "users") return "Users";
    if (routeInfo.view === "user") return userName || "User";
    if (routeInfo.view === "photos") {
      return userName ? `Photos of ${userName}` : "Photos";
    }
    return "";
  })();

  return (
    <AppBar className="topbar-appBar" position="fixed">
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Typography 
          variant="h5" 
          sx={{ 
            fontWeight: "bold",
            color: "white",
            display: "flex",
            alignItems: "center",
            gap: 1
          }}
        >
          📷 PhotoShare
        </Typography>

        <Typography 
          variant="h6" 
          sx={{ 
            color: "rgba(255,255,255,0.9)",
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            flex: 1,
            textAlign: "center"
          }}
        >
          {contextLabel}
        </Typography>

        <FormControlLabel
          control={
            <Checkbox
              checked={advancedEnabled}
              onChange={(e) => setAdvancedEnabled(e.target.checked)}
              sx={{
                color: "rgba(255,255,255,0.7)",
                "&.Mui-checked": {
                  color: "rgba(255,255,255,1)",
                },
              }}
            />
          }
          label={
            <Typography sx={{ color: "rgba(255,255,255,0.9)", fontSize: "0.9rem" }}>
              Advanced
            </Typography>
          }
        />
      </Toolbar>
    </AppBar>
  );
}

export default TopBar;
