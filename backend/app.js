const express = require('express');
const sequelize = require('./config');
const productRoutes = require('./routes/productRoutes');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());
app.use('/api', productRoutes);

const PORT = process.env.PORT || 5000;

sequelize.authenticate()
  .then(() => {
    console.log('Database connection established successfully.');

    sequelize.sync({ alter: true }).then(() => {
      app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    });
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });