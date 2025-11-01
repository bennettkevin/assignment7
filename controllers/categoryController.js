"use strict";
const model = require('../models/categoryModel');

/**
 * This function gets all the available categories of jokes.
 * @param { object } req The request object to get information about the request.
 * @param { object } res The response object to send the resonse information.
 */
async function fetchAllCategories(req, res) {
    try {
        const categories = await model.getAllCategories();
        res.json(categories);
    }
    catch (err) {
        console.log(err);
        res.status(500).send(err.message);
    }
}

module.exports = {
    fetchAllCategories
};