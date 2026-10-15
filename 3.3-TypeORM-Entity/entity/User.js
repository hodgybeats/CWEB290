const { EntitySchema } = require('typeorm');

module.exports.User = new EntitySchema({
    name: 'User',
    tableName: 'user', //the entity name does not need to match the table name
    columns: {
        id: {
            primary: true,
            type: 'int',
            generated: true,
        },
        firstName: {
            type: 'varchar',
            length: 255,
        },
        lastName: {
            type: 'varchar',
            length: 255,
        },
        age: {
            type: 'int',
        },
    },
});