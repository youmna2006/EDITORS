const {EntitySchema} = require('typeorm');

module.exports = new EntitySchema({
    name: "User",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true
        },
        username: {
            type: "varchar",
            unique: true
        },
        email: {
            type: "varchar",
            length: 255,
            unique: true
        },
        
    },
    relations: {
        notes: {
            target: "Note",
            type: "one-to-many",
            inverseSide: "user"
        }
    }
});