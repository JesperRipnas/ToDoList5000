const router = require ('express').Router();
const User = require('../model/User');
const TodoTask = require('../model/Todo');
const jwt = require('jsonwebtoken');
const { regValidation, loginValidation } = require('../validation');
const bcrypt = require('bcryptjs');
const cookieParser = require('cookie-parser')

router.use(cookieParser())

// REGISTER API
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

// LOGIN API
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

// RECEIVE NEW LIST FROM CLIENT BY JSON
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

// CHANGES THE 'completed' VALUE FOR THE ID IN COLLECTIONS TO true
router.get('/lists/complete=:id', async (req, res) => {
    const id = req.params.id;
    TodoTask.updateOne( {_id: id} , {completed: true}, function(err, result) {
        if (err) {
            console.log(err);
            res.redirect('/dashboard');
          }else {
            console.log('MongoDB: ' + id + ' list status: completed');
            res.redirect('/dashboard');
          }
    });
});

// CHANGES THE 'completed' VALUE FOR THE ID IN COLLECTIONS TO false
router.get('/lists/setnew=:id', async (req, res) => {
    const id = req.params.id;
    TodoTask.updateOne( {_id: id} , {completed: false}, function(err, result) {
        if (err) {
            console.log(err);
            res.redirect('/dashboard');
          }else {
            console.log('MongoDB: ' + id + ' list status: new');
            res.redirect('/dashboard');
          }
    });
});

// RETURNS ALL LISTS STORED IN DB TO CLIENT
router.get('/lists', (req, res) => {
    TodoTask.find({}, (err, tasks) => {
    res.json(tasks);
    });
});

module.exports = router;