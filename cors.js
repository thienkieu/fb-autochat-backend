var cors = require('cors');
var whitelist = ['https://fb-autochat.herokuapp.com', 'https://www.facebook.com']

var corsOptions = {
    origin: function (origin, callback) {
        console.log(origin)
        if (whitelist.indexOf(origin) !== -1) {
          callback(null, true)
        } else {
          callback(new Error('Not allowed by CORS'))
        }
    }
}

const applyCors = () =>{
    return cors(corsOptions);
}

module.exports = {
    cors,
    corsOptions,
    applyCors
};