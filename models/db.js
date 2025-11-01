"use strict";

require('dotenv').config();

const { Pool } = require('pg');

// Pool for accessing the database.
const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

module.exports = pool;