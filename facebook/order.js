var express = require('express');
var router = express.Router();
var db = require('../db');
var orderCollection = db.orderCollection;
var cors =  require('../cors');

router.options('/orders', cors.applyCors());
router.get('/orders', cors.applyCors(), (req, res) =>{
    orderCollection().find({}).toArray(function(err, result) {
        if (err) throw err;
        res.json(result);
    });
});

router.options('/order/:facebookId', cors.applyCors());
router.post('/order/:facebookId', cors.applyCors(), (req, res) => {
    const orderInfo = req.body;
    orderCollection().findOne({facebookId: orderInfo.facebookId, messageId: orderInfo.messageId}, function(err, result) {
        if (err) throw err;
        if (!result) {
            orderCollection().insertOne(orderInfo);
        }else {
            var newvalues = { $set: {
                price: orderInfo.price,
                location: orderInfo.location, 
                phone: orderInfo.phone,  
                size: orderInfo.size,
                name: orderInfo.name,
                fbLink: orderInfo.fbLink,
				color: orderInfo.color,
            }};
            orderCollection().updateOne({facebookId: orderInfo.facebookId, messageId: orderInfo.messageId}, newvalues, function(err, res) {
            if (err) throw err;
                console.log("1 document updated");            
            });
        }            
        });
    res.send('ok');
});

module.exports = router;

