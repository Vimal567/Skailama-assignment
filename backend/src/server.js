const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env.example') });

const app = express();

const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/eventsdb';

const profilesRoutes = require('./routes/profiles');
const eventsRoutes = require('./routes/events');

app.use(cors({
  origin: '*'
}));
app.use(express.json());

app.use('/api/profiles', profilesRoutes);
app.use('/api/events', eventsRoutes);


mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Mongo connected');
    app.listen(PORT, () => console.log('Server started at port - ', PORT));
  })
  .catch(err => console.error('Mongo connection error:', err));
