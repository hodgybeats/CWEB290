const { DataTypes } = require("sequelize");
const sequelize = require("./database");

// Define the User model. Sequelize will turn this into a table named "Users".
// https://sequelize.org/docs/v6/core-concepts/model-basics/#model-definition
module.exports = sequelize.define("User", {
  //sequelize automatically add the id field and 2 other logging fields
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
  username: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
});
