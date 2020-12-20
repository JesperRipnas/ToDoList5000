const router = require ('express').Router();
const verify = require('./token');

router.get('/', (req, res) => {
    res.redirect('/');
});

module.exports = router;