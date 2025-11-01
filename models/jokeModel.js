"use strict";
const db = require('../models/db');

/**
 * This function gets all the jokes from the jokebook.
 * @returns All the jokes from the jokebook table.
 */
async function getAllJokes() {
    // Join jokes with their categories in order to return category as readable text instead of category id.
    const queryText = "SELECT * FROM jokebook INNER JOIN jokebookcatagories ON jokebook.type = jokebookcatagories.id";

    const result = await db.query(queryText);
    return result.rows;
}

/**
 * This function will get jokes from a specified category.
 * @param { string } category The category of jokes to retrieve.
 * @returns The jokes from the specified category.
 */
async function getJokeCategory(category) {
    // Join jokes with categories to compare the readable text of the category instead of needing to know category ids.
    const queryText = "SELECT * FROM jokebook JOIN jokebookcatagories ON jokebook.type = jokebookcatagories.id WHERE LOWER(jokebookcatagories.type) = LOWER($1)";
    const values = [category];

    const result = await db.query(queryText, values);
    return result.rows;
}

/**
 * This function gets all the jokes from the database and returns a random one.
 * @returns A random joke from the database.
 */
async function getRandomJoke() {
    const jokes = await getAllJokes();
    
    let randomIndex = Math.floor(Math.random() * jokes.length);
    
    return jokes[randomIndex];
}

/**
 * Adds a new joke to the database.
 * @param { string } category The category of the joke.
 * @param { string } setup The setup for the joke.
 * @param { string } delivery The delivery of the joke.
 * @returns The new joke added to the database.
 */
async function addJoke(category, setup, delivery) {
    // The select for categories is done so the category id is retrieved and used in the table instead of the plane text.
    const queryText = "INSERT INTO jokebook (type, setup, delivery) VALUES ((SELECT id FROM jokebookcatagories WHERE LOWER(type) = LOWER($1)), $2, $3) RETURNING *";
    const values = [category, setup, delivery];
    
    const result = await db.query(queryText, values);
    return result.rows;
}

module.exports = {
    getAllJokes,
    getJokeCategory,
    getRandomJoke,
    addJoke
};