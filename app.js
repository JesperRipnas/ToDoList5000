const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const verify = require('./routes/token');

dotenv.config();
// Load static files in the public/css & js folder
app.use(express.static(path.join(__dirname, 'public')));

// Import Routes
const authRoute = require('./routes/auth');
const postRoute = require('./routes/posts');

// Connect to DB
mongoose.connect(
    process.env.DB_CONNECT, { useNewUrlParser: true, useUnifiedTopology: true }, () => console.log('Connected to db')
);

// Middleware
app.use(express.json());

// Route Middlewares
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/index.html'));
});

app.get('/dashboard', verify, (req, res) => {
    res.send('Hallo');
});

app.use('/api/user', authRoute);
app.use('*', postRoute);

// Host server at port 8080
app.listen(8080, () => console.log('Server running'));

