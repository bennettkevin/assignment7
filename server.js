//server.js
"use strict";

// Import express and create an instance of it.
const express = require("express");
const app = express();

const multer = require("multer");
app.use(multer().none());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// Import the routes for categories and jokes.
const jokeRoutes = require('./routes/jokeRoutes');
const categoryRoutes = require('./routes/categoryRoute');

// Tell the app where to look for joke and category endpoints.
app.use('/jokebook', jokeRoutes);
app.use('/jokebook/categories', categoryRoutes);

// Start the server.
const PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
    console.log("Server listening on port: " + PORT + "!");
});
