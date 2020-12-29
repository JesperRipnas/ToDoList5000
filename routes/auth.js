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
        console.log('MongoDB: Account created');
        console.log('User: ' + req.body.name + ' ('+req.body.email+')');
        console.log('Password: ' + hashPassword);    
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
            console.log('Auth: Incorrect email');
            return res.status(400).send('Email does not exist');
        };
        // CHECK PASSWORD
        const password = await bcrypt.compare(req.body.password, user.password);
        if (!password) {
            console.log('Auth: Incorrect password');
            return res.status(400).send('Invalid password');
        };
        // GENERATE LOGIN TOKEN
        const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
        res.cookie('authorization', token).send(token);
        console.log('Auth: Token sent');
        console.log('Auth: ' + req.body.email + ' logged in');
});

// POST REQUEST, RECEIVE NEW LIST FROM CLIENT
router.post('/lists', async (req, res) => {
    const todoTask = new TodoTask({
        content: req.body.content
    });
    try {
        await todoTask.save(); 
        console.log('MongoDB: Created new list');
        res.redirect('/dashboard');
    } catch {
        console.log('error when creating list');
        res.redirect('/dashboard');
    }
});

// SEARCH FOR ID OF LIST RECIEVED FROM FRONTEND (STORED IN URL), DELETED IT FROM DB IF IT EXISTS
router.get('/lists/delete=:id', async (req, res) => {
    const id = req.params.id;
    try {
        await TodoTask.findByIdAndDelete(id);
        console.log('MongoDB: ' + id + ' list deleted');
        res.redirect('/dashboard');
    } catch {
        res.redirect('/dashboard');
    }
});

// SEARCH FOR ID OF LIST RECIEVED FROM FRONTEND (STORED IN URL)
router.get('/lists/complete=:id', async (req, res) => {
    const id = req.params.id;
    // CHANGES THE 'completed' ROW IN THE COLLECTION TO TRUE
    TodoTask.updateOne( {_id: id} , {completed: true}, function(err, result) {
        if (err) {
            console.log(err);
            res.redirect('/dashboard');
          } else {
            console.log('MongoDB: ' + id + ' list edited');
            res.redirect('/dashboard');
          }
    });
});

// SEARCH FOR ID OF LIST RECIEVED FROM FRONTEND (STORED IN URL)
router.get('/lists/setnew=:id', async (req, res) => {
    const id = req.params.id;
    // CHANGES THE 'completed' ROW IN THE COLLECTION TO TRUE
    TodoTask.updateOne( {_id: id} , {completed: false}, function(err, result) {
        if (err) {
            console.log(err);
            res.redirect('/dashboard');
          } else {
            console.log('MongoDB: ' + id + ' list edited');
            res.redirect('/dashboard');
          }
    });
});

// GET REQUEST, RETURNS ALL LISTS STORED IN DB TO CLIENT(FRONTEND)
router.get('/lists', (req, res) => {
    TodoTask.find({}, (err, tasks) => {
        res.json(tasks);
    });
});

module.exports = router;