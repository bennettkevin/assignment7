"use strict";
const express = require("express");
const router = express.Router();
const categoryController = require('../controllers/categoryController');

// Get all the categories of jokes upon GET request to /categories.
router.get("/", categoryController.fetchAllCategories);

module.exports = router;