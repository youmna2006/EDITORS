const {Pool} = require('pg');

const pool = new Pool({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'youmna12345',
    database: 'notes_db',
});
module.exports = pool;