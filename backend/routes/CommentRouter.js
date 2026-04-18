const express = require("express");
const router = express.Router();

// Placeholder router to satisfy imports. Specific comment APIs are not required for Lab 2.
router.get('/', (req, res) => {
  res.status(200).send({ message: 'Comments router placeholder' });
});

module.exports = router;
