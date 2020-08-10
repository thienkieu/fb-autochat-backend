var facebookRouter = require('./facebook/product');
var accountRouter = require('./facebook/account');
var orderRouter = require('./facebook/order');

const express = require('express')
const app = express()
const port = process.env.PORT || 3000

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/facebook', facebookRouter);
app.use('/facebook', accountRouter);
app.use('/facebook', orderRouter);

app.get('/', (req, res) => res.send('Hello World!'))

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))