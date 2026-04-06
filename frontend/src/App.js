import './App.css';

import React, { useMemo, useState } from "react";
import { Grid, Paper } from "@mui/material";
import { BrowserRouter as Router, Navigate, Route, Routes } from "react-router-dom";

import TopBar from "./components/TopBar";
import UserDetail from "./components/UserDetail";
import UserList from "./components/UserList";
import UserPhotos from "./components/UserPhotos";
import { AppContext } from "./context/AppContext";

const App = (props) => {
  const [advancedEnabled, setAdvancedEnabled] = useState(false);
  const appContextValue = useMemo(
    () => ({ advancedEnabled, setAdvancedEnabled }),
    [advancedEnabled]
  );

  return (
      <Router>
        <AppContext.Provider value={appContextValue}>
          <div>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TopBar />
              </Grid>
              <div className="main-topbar-buffer" />
              <Grid item sm={3}>
                <Paper className="main-grid-item">
                  <UserList />
                </Paper>
              </Grid>
              <Grid item sm={9}>
                <Paper className="main-grid-item">
                  <Routes>
                    <Route path="/" element={<Navigate to="/users" replace />} />
                    <Route
                        path="/users/:userId"
                        element = {<UserDetail />}
                    />
                    <Route
                        path="/photos/:userId/:photoId?"
                        element = {<UserPhotos />}
                    />
                    <Route path="/users" element={<UserList />} />
                  </Routes>
                </Paper>
              </Grid>
            </Grid>
          </div>
        </AppContext.Provider>
      </Router>
  );
}

export default App;
