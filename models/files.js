const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Files = sequelize.define('files', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
      },
      fileURL: {
        type: Sequelize.STRING
      },
      userId: {
        type: Sequelize.INTEGER
      }
      
});

module.exports = Files;