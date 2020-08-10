var facebookRouter = require('./facebook/product');
var accountRouter = require('./facebook/account');
var orderRouter = require('./facebook/order');

const express = require('express');
const port = process.env.PORT || 3001;

(async () => {
    const server = express()
    server.use(express.json());
    server.use(express.urlencoded({ extended: false }));
    server.use('/facebook', facebookRouter);
    server.use('/facebook', accountRouter);
    server.use('/facebook', orderRouter);
  
    server.get('/', (req, res) => res.send('Hello World!'))

    await server.listen(port)
    console.log(`> Ready on http://localhost:${port}`) // eslint-disable-line no-console
  })()