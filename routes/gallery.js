const express = require("express");
const router = express.Router();

// Create a multi-user Gallery.
// Any user should be able to access these routes

// GET - RETURN ENTIRE GALLERY
router.get("/", (req, res) => {
  return req.database.Photo.fetchAll().then(results => {
    res.render("./gallery/index", { gallery: results.toJSON() });
  });
});

// GET/gallery/:id - RETURNS PHOTO BY ID

// GET/gallery/new - RETURNS TEMPLATE FOR ADDING NEW PHOTO
router.get("/new", (req, res) => {
  res.render("./gallery/new");
});

// GET/gallery/:id/edit - RETURNS TEMPLATE FOR EDITING PHOTO

// POST/gallery - ADDS NEW PHOTO TO GALLERY

// PUT/gallery/:id - EDITS THE PHOTO BY ID

// DELETE/gallery/:id - DELETES A PHOTO BY ID
module.exports = router;
