const { DataSource } = require("typeorm");
const Note = require('./entities/note');
const User = require('./entities/user');

const AppDataSource = new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'youmna12345',
    database: 'notes_db',
    synchronize: true,
    logging: false,
    entities: [Note, User],
    migrations: [],
    subscribers: [],
});


module.exports = AppDataSource; 