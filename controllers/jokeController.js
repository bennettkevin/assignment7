"use strict";
const model = require('../models/jokeModel');

/**
 * This function gets all the jokes from the jokebook.
 * @param { object } req The request object for getting request information. 
 * @param { object } res The response object for sending response information.
 */
async function fetchAllJokes(req, res) {
    try {
        const jokes = await model.getAllJokes();
        res.json(jokes);
    }
    catch (err) {
        console.log(err);
        res.status(500).send("Server error");
    }
}

/**
 * This function handles the case where category param is excluded from request.
 * @param { object } req This is the request object for getting information about the request.
 * @param { object } res This is the response object for sending response information.
 */
function badRequestCategory(req, res) {
    res.status(400).send("Missing required category param.");
}

/**
 * This function gets jokes from a specified category.
 * @param { object } req The request object to get information about the request in this case the category param.
 * @param { object } res The response object to send the jokes from the specified category.
 */
async function fetchJokeCategory(req, res) {
    const category = req.params.category;
    
    try {
        const jokes = await model.getJokeCategory(category);
        res.json(jokes);
    }
    catch (err) {
        res.status(500).send("Server error");
    }
}

/**
 * This is a function to get a random joke from the jokebook.
 * @param { object } req The request object to get information about the request. 
 * @param {*} res The response object to send the random joke.
 */
async function fetchRandomJoke(req, res) {
    try {
        const joke = await model.getRandomJoke();
        res.json(joke);
    }
    catch (err) {
        res.status(500).send("Server error");
    }
}

/**
 * This function adds a new joke to the jokebook.
 * @param { object } req The request object containing information about the joke.
 * @param { object } res The response object to send the new joke as response if successful.
 */
async function addJoke(req, res) {
    const { category, setup, delivery } = req.body;
    if (category && setup && delivery) {
        try {
            const newJoke = await model.addJoke(category, setup, delivery);
            res.status(200).json(newJoke);
        }
        catch (err) {
            res.status(500).send("Server error");
        }
    }
    else {
        res.status(400).send("Missing a required joke field.");
    }
}

module.exports = {
    fetchAllJokes,
    badRequestCategory,
    fetchJokeCategory,
    fetchRandomJoke,
    addJoke
};