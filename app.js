const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser')
const cors = require('cors');

dotenv.config();
// Load static files in the public/css & js folder
app.use(express.static(path.join(__dirname, 'public')));

// Import Routes
const authRoute = require('./routes/auth');
const postRoute = require('./routes/posts');
const { userInfo } = require('os');
const { JsonWebTokenError } = require('jsonwebtoken');
const { emitWarning } = require('process');

// Connect to DB
mongoose.connect(
    process.env.DB_CONNECT, { useNewUrlParser: true, useUnifiedTopology: true }, () => console.log('Server: Connected to database')
);

// Middleware
app.use(cors({credentials: true, origin: 'http://localhost:8080'}));
app.use(express.json());
app.use(cookieParser())

// Route Middlewares
app.get('/', (req, res) => {
    console.log('Server: /index');
    res.sendFile(path.join(__dirname + '/public/index.html'));
});

app.get('/signup', (req, res) => {
    console.log('Server: /signup');
    res.sendFile(path.join(__dirname + '/public/signup.html'));
});

app.get('/reset', (req, res) => {
    console.log('Server: /reset');
    res.sendFile(path.join(__dirname + '/public/reset.html'));
});

app.get('/dashboard', verifyToken, (req, res) => {
    console.log('Server: /dashboard');
    res.sendFile(path.join(__dirname + '/public/dashboard.html'));
});

app.post('/api/posts', verifyToken, (req, res) => {
    res.json({
        message: 'post created'
    });
    console.log('Server: POST created');
});

// ROUTES
app.use('/api/user', authRoute);
app.use('/api/posts', postRoute);
app.all('*', function(req, res) {
    res.redirect('/')
});

// Verify Token
function verifyToken(req, res, next) {
    
    // Check if token is undefined or not
    if (typeof req.headers.authorization !== 'undefined') {
        let token = req.headers.authorization.split(' ')[1];
        let key = process.env.TOKEN_SECRET;

        jwt.verify(token, key, (err, user) => {
            if (err) {
                res.status(403);
            }
            return next();
        });
    } else {
        // Forbidden
        res.sendStatus(403);
        console.log('Server: 403: Access forbidden');
    }
};

// Create HttpOnly cookies
const createCookie = () => {
    cookie
}

// Host server at port 8080
app.listen(8080, () => console.log('Server: Running at http://localhost:8080'));


