let connectTrackingCollection = null;
let connectProductCollection = null;
const connectionUrl = 'mongodb://192.168.190.92:27017/onlinetest_tracking'; 
const MongoClient = require('mongodb').MongoClient

MongoClient.connect('mongodb+srv://thienkieu:0958588127thien@cluster0.s7nkh.mongodb.net/facebook?retryWrites=true&w=majority', {useUnifiedTopology: true})
  .then(client => {
    // ...
    const db = client.db('facebook')
    connectTrackingCollection = db.collection('candidate_connect');
    connectProductCollection = db.collection('products');
    connectAccountCollection = db.collection('accounts');
    connectOrdersCollection = db.collection('orders');
  });

const trackingCollection = function () {
	return connectTrackingCollection;
}


const productCollection = function () {
	return connectProductCollection;
}

const accountCollection = function () {
	return connectAccountCollection;
}

const orderCollection = function () {
	return connectOrdersCollection;
}

module.exports = {
  trakingCollection: trackingCollection,
  productCollection: productCollection,
  accountCollection: accountCollection,
  orderCollection: orderCollection,
  connectionUrl: connectionUrl
}