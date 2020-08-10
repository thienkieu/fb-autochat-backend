var express = require('express');
var router = express.Router();
var request = require('request');
var db = require('../db');
var productCollection = db.productCollection;
var cors =  require('../cors');

router.options('/products/:facebookId/:pageNumber', cors.applyCors());
router.get('/products/:facebookId/:pageNumber', cors.applyCors(), (req, res) =>{
    const params = req.params;
    const pageNumber = parseInt(req.params.pageNumber);
    if (isNaN(pageNumber) || pageNumber < 1) pageNumber = 1;
    productCollection().find({facebookId: params.facebookId}).skip((pageNumber-1)*10).limit(10).sort({facebookId: 1}).toArray(function(err, result) {
        if (err) throw err;
        res.json(result);
    });
});

router.options('/product/:productId/answers', cors.applyCors());
router.get('/product/:productId/answers', cors.applyCors(), (req, res) =>{
    const params = req.params;
    productCollection().findOne({productId: params.productId}, function(err, result) {
        if (err) throw err;
        res.json(result);
    });
});

router.options('/product/:productId/answer/:intent', cors.applyCors());
router.get('/product/:productId/answer/:intent', cors.applyCors(), (req, res) =>{
    const params = req.params;
    console.log(params)
    const generalIntent = {
        'con_san_pham_khong': 'dạ còn ạ, chị đi size nào ạ',
        'sho_o_dau': '131/23 khu phố Bình Phước a bình chuẩn thuận an bình dương c nhé'
    }

    if ( generalIntent[params.intent]) {
        return res.json({
            type: 'text', 
            value: generalIntent[params.intent]
        });
    }
    
    productCollection().findOne({productId: params.productId}, function(err, result) {
        if (err) {
            res.json({
                type: 'text', 
                value: ''
            });
        }
        let answer = '';
        if (result && result.answers) {
            const answers = result.answers;
            
            for(let i = 0; i < answers.length; i++ ){
                if (answers[i].intent == params.intent) {
                    answer = answers[i].answer;
                    break;
                }
            }
        }
        res.json({
            type: 'text', 
            value: answer
        });
    });
});

router.options('/updateProductList/:facebookId', cors.applyCors());
router.post('/updateProductList/:facebookId', cors.applyCors(), (req, res) => {
    const products = req.body;
    const params = req.params;
    products.forEach(element => {
        productCollection().findOne({productId: element.productId, facebookId: params.facebookId}, function(err, result) {
            if (err) throw err;
            if (!result) {
                const item = {...element};
                item.facebookId = params.facebookId;
                item.locations = [{
                    view: 0,
                    currentView: element.view,
                    title: item.location
                }];
                productCollection().insertOne(item);
            }else {
                const locations = Array.isArray(result.locations) ? [...result.locations] : [{...result.locations}];
                const latestLocation = locations[locations.length -1];
                let existing = false;
                for (let i = 0; i < locations.length; i++){
                    if (locations[i].title === element.title) {
                        locations[i].view = parseInt(locations[i].view) + parseInt(element.view) - parseInt(locations[i].currentView);
                        locations[i].currentView = element.view;
                        existing = true;
                    }
                }
                if (!existing) {
                    locations.push({
                        title: element.location, 
                        view: 0,
                        currentView: element.view
                    })
                }

                var newvalues = { $set: {locations: locations }};

                productCollection().updateOne({productId: element.productId}, newvalues, function(err, res) {
                if (err) throw err;
                    console.log("1 document updated");            
                });
            }            
          });
    });
    res.send('ok');
});

router.options('/updateProductInfo', cors.applyCors());
router.post('/updateProductInfo', cors.applyCors(), (req, res) => {
    const productInfo = JSON.stringify(req.body);
    const query = {productId: productInfo.productId};
    const newValues = {
        location: productInfo.location,
        view: productInfo.view,
    }

    productCollection().findOne({productId: productInfo.productId}, function(err, result) {
        if (err) throw err;
        if (result) {
            const locations = [...result.locations];
            const latestLocation = locations[locations.length -1];
            if (latestLocation.title === productInfo.location.title) {
                latestLocation.view = latestLocation.view + productInfo.location.currentView - latestLocation.currentView;
                latestLocation.currentView = productInfo.location.currentView;
            } else {
                locations.push({
                    title: productInfo.location.title, 
                    view: 0,
                    currentView: productInfo.location.currentView
                })
            }

            var newvalues = { $set: {location: locations }};

            productCollection().updateOne({productId: element.productId}, newvalues, function(err, res) {
            if (err) throw err;
                console.log("1 document updated");            
            });
        }
        
    });
    
});

router.options('/addAnswer', cors.applyCors());
router.post('/addAnswer', cors.applyCors(), (req, res) => {
    const answerInfo = req.body;
    productCollection().findOne({productId: answerInfo.productId}, function(err, result) {
        if (err) throw err;
        if (result) {
            
            let answers = [];
            if(result.answers) {
                answers = [...result.answers];
            }

            let exist = false;
            for(let i = 0; i < answers.length; i++) {
                if (answers[i].intent === answerInfo.intent) {
                    answers[i].question = answerInfo.question;
                    answers[i].answer = answerInfo.answer;
                    exist = true;
                    break;
                }
            }

            if (!exist) {
                answers.push({
                    question: answerInfo.question, 
                    intent: answerInfo.intent,
                    answer: answerInfo.answer
                });
            }
            
            var newvalues = { $set: {answers: answers }};

            productCollection().updateOne({productId: answerInfo.productId}, newvalues, function(err, res) {
            if (err) throw err;
                console.log("1 document updated");   
                         
            });
            res.json('ok');
        }
        
        
    });
    
});

router.options('/updateAnswer', cors.applyCors());
router.post('/updateAnswer', cors.applyCors(), (req, res) => {
    const answerInfo = req.body;
    
    productCollection().findOne({productId: answerInfo.productId}, function(err, result) {
        if (err) throw err;
        if (result) {
            const answers = [...result.answers];
            for(let i = 0; i < answers.length; i++) {
                if (answers[i].intent === answerInfo.intent) {
                    answers[i].answer = answerInfo.answer;
                };
            }

            var newvalues = { $set: {answers: answers }};
            productCollection().updateOne({productId: answerInfo.productId}, newvalues, function(err, res) {
            if (err) throw err;
                console.log("1 document updated");            
            });
        }

        res.json('ok');
        
    });
    
});

module.exports = router;
