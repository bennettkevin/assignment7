"use strict";
const express = require("express");
const router = express.Router();
const jokeController = require('../controllers/jokeController');

// Router information for jokebook endpoints.
router.get("/", jokeController.fetchAllJokes);
router.get("/random", jokeController.fetchRandomJoke);
router.get("/category", jokeController.badRequestCategory);
router.get("/category/:category", jokeController.fetchJokeCategory);
router.post("/joke/add", jokeController.addJoke);

module.exports = router;