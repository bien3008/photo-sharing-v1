const express = require("express");
const cors = require("cors");
const config = require("./config");
const apiRoutes = require("./routes/api");
const errorHandler = require("./middleware/errorHandler");

const app = express();

app.use(cors({ origin: config.corsOrigin }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (config.nodeEnv === "development") {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });
}

app.use("/api", apiRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Endpoint not found",
    path: req.path,
  });
});

app.use(errorHandler);

const PORT = config.port;
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
  console.log(`CORS enabled for: ${config.corsOrigin}`);
  console.log(`Environment: ${config.nodeEnv}`);
});

module.exports = app;
