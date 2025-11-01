"use strict";
const db = require('../models/db');

/**
 * This function gets all the available categories of jokes.
 * @returns The categories of jokes available for the jokebook.
 */
async function getAllCategories() {
    
    const queryText = "SELECT * FROM jokebookcatagories";

    const result = await db.query(queryText);
    return result.rows;
}

module.exports = {
    getAllCategories
};