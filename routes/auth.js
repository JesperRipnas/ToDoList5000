const router = require ('express').Router();
const User = require('../model/User');
const TodoTask = require('../model/Todo');
const jwt = require('jsonwebtoken');
const { regValidation, loginValidation } = require('../validation');
const bcrypt = require('bcryptjs');
const cookieParser = require('cookie-parser')
const path = require('path');

router.use(cookieParser())

// POST register API
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

// POST login API
router.post('/login', async (req, res) => {
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

// POST request, receive new lists from client
router.post('/lists', async (req, res) => {
    const todoTask = new TodoTask({
        content: req.body.content
    });
    try {
        await todoTask.save(); 
        console.log('SERVER: list created');
        res.redirect('/dashboard');
    } catch {
        res.redirect('/dashboard');
    }
});

router.get('/lists/delete/:id', async (req, res) => {
    const id = req.params.id;
    try {
        await TodoTask.findByIdAndDelete(id);
        console.log('Server: ' + id + ' list deleted');
        res.redirect('/dashboard');
    } catch {
        res.redirect('/dashboard');
    }
});

// GET Request, will return all lists in DB as a JSON to client
router.get('/lists', (req, res) => {
    TodoTask.find({}, (err, tasks) => {
        res.json(tasks);
    });
});

module.exports = router;