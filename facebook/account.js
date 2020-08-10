var express = require('express');
var router = express.Router();
var db = require('../db');
var accountCollection = db.accountCollection;
var cors =  require('../cors');

router.options('/accounts', cors.applyCors());
router.get('/accounts', cors.applyCors(), (req, res) =>{
    accountCollection().find({}).toArray(function(err, result) {
        if (err) throw err;
        res.json(result);
    });
});

router.options('/account', cors.applyCors());
router.post('/account', cors.applyCors(), (req, res) => {
    const account = req.body;
    accountCollection().findOne({facebookId: account.facebookId}, function(err, result) {
        if (err) throw err;
        if (!result) {
            accountCollection().insertOne(account);
        }else {
            var newvalues = { $set: {name: account.name }};
            accountCollection().updateOne({facebookId: account.facebookId}, newvalues, function(err, res) {
            if (err) throw err;
                console.log("1 document updated");            
            });
        }            
        });
    res.send('ok');
});

module.exports = router;

