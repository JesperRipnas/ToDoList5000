const router = require ('express').Router();
const verify = require('./token');

router.get('/', (req, res) => {
    console.log('Server: /');
    res.redirect('/');
});


module.exports = router;