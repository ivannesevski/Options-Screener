import config from './config';
import apiRouter from './api';
import cors from 'cors';

import express from 'express';
const server = express();

server.set('view engine', 'ejs');

server.use(cors());

server.use(express.urlencoded({ extended: false }));
server.use(express.json());

server.get('/', (req, res) => {
    res.render('index', {
        content: 'No index page found.'
    });
});

server.use('/api', apiRouter);
server.use(express.static('public'));

server.listen(config.port, () => {
    console.info('Express listening on port ', config.port);
});