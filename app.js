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

// Connect to DB
mongoose.connect(
    process.env.DB_CONNECT, { useNewUrlParser: true, useUnifiedTopology: true }, () => console.log('Server: Connected to MongoDB (Cluster0) database')
);

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(cors({credentials: true, origin: 'http://localhost:8080'}));
app.use(express.json());
app.use(cookieParser())

// Route Middlewares
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/dashboard.html'));
});

app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/signup.html'));
});

app.get('/reset', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/reset.html'));
});

app.get('/dashboard', verifyToken, (req, res) => {
    res.sendFile(path.join(__dirname + '/public/dashboard.html'));
});

// ROUTES
app.use('/api/user/logout', removeCookie);
app.use('/api/user', authRoute);
app.all('*', function(req, res) {
    res.redirect('/')
});

// VERIFY TOKEN
function verifyToken(req, res, next) {
    // CHECK IF TOKEN IS UNDEFINED/NULL
    let tokenCookie = req.cookies['authorization'];
    let key = process.env.TOKEN_SECRET; 
    if(tokenCookie !== null){
        jwt.verify(tokenCookie, key, (err) => {
            if(err) {
                // FORBIDDEN, NO ACCESS WITHOUT TOKEN IN COOKIES
                console.log('Server: 403 Access denied');
                return res.status(403).redirect('/');
            }
            return next();
        });
    } else {
        // FORBIDDEN, NO ACCESS WITHOUT TOKEN IN COOKIES
        console.log('Server: 403 Access denied');
        return res.status(403).redirect('/');
    }
};

function removeCookie(req, res) {
    res.clearCookie('authorization', { path: '/' })
    res.redirect('/');
    console.log('Auth: Token removed');
};

// HOST SERVER ON LOCALHOST:8080
app.listen(8080, () => console.log('Server: Running at http://localhost:8080'));


