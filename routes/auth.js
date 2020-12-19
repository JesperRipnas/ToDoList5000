const router = require ('express').Router();
const User = require('../model/User');
const { regValidation } = require('../validation');
const bcrypt = require('bcryptjs');

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

module.exports = router;