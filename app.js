const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser')
const cors = require('cors');

var loggedIn = false;

dotenv.config();
// Load static files in the public/css & js folder
app.use(express.static(path.join(__dirname, 'public')));

// Import Routes
const authRoute = require('./routes/auth');
const postRoute = require('./routes/posts');

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
    console.log('Server: /');
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
app.use('/api/user/logout', removeCookie);
app.use('/api/user', authRoute);
app.all('*', function(req, res) {
    res.redirect('/')
});

// Verify Token
function verifyToken(req, res, next) {
    
    // Check if token is undefined or not
    let tokenCookie = req.cookies['authorization'];
    let key = process.env.TOKEN_SECRET; 
    if(tokenCookie !== null){
        jwt.verify(tokenCookie, key, (err) => {
            if(err) {
                // Forbidden
                res.sendStatus(403);
                console.log('Server: 403: Access forbidden!!');
            }
            loggedIn = true;
            return next();
        });
    } else {
        // Forbidden
        res.sendStatus(403);
        console.log('Server: 403: Access forbidden');
    }
};

function removeCookie(req, res) {
    res.clearCookie('authorization', { path: '/' })
    loggedIn = false;
    res.redirect('/');
    console.log('Auth: Token removed');
};

// Host server at port 8080
app.listen(8080, () => console.log('Server: Running at http://localhost:8080'));


