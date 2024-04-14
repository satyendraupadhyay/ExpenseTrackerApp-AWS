const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const expense = sequelize.define('expense', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
      },
      amount: {
        type: Sequelize.STRING

      },
      description: {
        type: Sequelize.STRING

      },
      category: {
        type: Sequelize.STRING,
        // allowNull: false
      },
      userId: {
        type: Sequelize.INTEGER
      }
      
});

module.exports = expense;