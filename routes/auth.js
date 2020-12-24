const router = require ('express').Router();
const User = require('../model/User');
const TodoTask = require('../model/Todo');
const jwt = require('jsonwebtoken');
const { regValidation, loginValidation } = require('../validation');
const bcrypt = require('bcryptjs');
const cookieParser = require('cookie-parser')
const path = require('path');

router.use(cookieParser())

router.post('/register', async (req, res) => {

    // VALIDATE POST DATA BEFORE CREATING USER
    const {error} = regValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    // CHECK IF EMAIL ALREADY EXIST IN DATABASE
    const checkIfEmailExist = await User.findOne({ email: req.body.email});
    if (checkIfEmailExist) return res.status(400).send('Email already exists');

    // HASH PASSWORDS
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(req.body.password, salt);
    
    // OBJECT REQUIREMENTS FOR NEW USERS
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashPassword
    });
    try{
        const savedUser = await user.save();
        res.send({user:user._id});
    }catch(err){
        res.status(400).send(err);
    }
});

// LOGIN
router.post('/login', async (req, res) => {
    var loggedIn = false;
    const {error} = loginValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);
        // CHECK IF EMAIL EXISTS
        const user = await User.findOne({ email: req.body.email});
        if (!user) {
            return res.status(400).send('Email does not exist');
        };
        // CHECK PASSWORD
        const password = await bcrypt.compare(req.body.password, user.password);
        if (!password) {
            return res.status(400).send('Invalid password');
        };
        // GENERATE LOGIN TOKEN
        const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
        res.cookie('authorization', token).send(token);
        console.log('Auth: Token sent');
    });

router.post('/lists', async (req, res) => {
    const todoTask = new TodoTask({
        content: req.body.content
    });
    try {
        await todoTask.save(); 
        res.redirect('/dashboard');
    } catch {
        res.redirect('/dashboard');
    }
});
router.get('/lists', (req, res) => {
    TodoTask.find({}, (err, tasks) => {
        res.json(tasks);
    });
});

module.exports = router;