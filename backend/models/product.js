const { DataTypes } = require('sequelize');
const sequelize = require('../config');

const Product = sequelize.define('Product', {
  asin: { type: DataTypes.STRING, allowNull: false },
  original_title: DataTypes.TEXT,
  original_bullets: DataTypes.TEXT,
  original_description: DataTypes.TEXT,
  optimized_title: DataTypes.TEXT,
  optimized_bullets: DataTypes.TEXT,
  optimized_description: DataTypes.TEXT,
  keywords: DataTypes.TEXT,
}, {
  timestamps: true,
});

module.exports = Product;
