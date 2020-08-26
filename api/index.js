import express from 'express';
import fs from 'fs';
import axios from 'axios';

const router = express.Router();
const fsp = fs.promises;

router.get('/token', async (req, res) => {
    try {
        let refresh_token = await fsp.readFile('token.txt', 'utf8');
        if (refresh_token == 'undefined') {
            res.send({error: 'no refresh token found'});
        } else {
            res.send({refresh_token: refresh_token});
        }
    } catch(error) {
        console.error(error);
        res.send({error: error});
    }
});

router.post('/token', async (req, res) => {
    const refresh_token = req.body.refresh_token;
    
    try {
        await fsp.writeFile('token.txt', refresh_token);
        res.end();
    } catch(error) {
        console.error(error);
        res.send({error: error});
    }
});

router.get('/auth', async (req, res) => {
    const refresh_token = req.query.refresh_token;

    try {
        const authRequest = await axios.get(`https://login.questrade.com/oauth2/token?grant_type=refresh_token&refresh_token=${refresh_token}`);
        res.send(authRequest.data);
    } catch(error) {
        console.error(error);
        res.send({error: error});
    }  
});


router.post('/symbol-id', async (req, res) => {
    const api_server = req.body.api_server;
    const access_token = req.body.access_token;
    const ticker = req.body.ticker;

    try {
        const symbolIdRequest = await axios.get(`${api_server}v1/symbols?names=${ticker}`, {
            headers: {
                Authorization: `Bearer ${access_token}`
            }
        });
        res.send(symbolIdRequest.data);
    } catch(error) {
        console.error(error);
        res.send({error: error});
    }
});


router.post('/symbol-quote', async (req, res) => {
    const api_server = req.body.api_server;
    const access_token = req.body.access_token;
    const symbolId = req.body.symbolId;

    try {
        const symbolQuoteRequest = await axios.get(`${api_server}v1/markets/quotes/${symbolId}`, {
            headers: {
                Authorization: `Bearer ${access_token}`
            }
        });
        res.send(symbolQuoteRequest.data);
    } catch(error) {
        console.error(error);
        res.send({error: error});
    }
});

router.post('/option-data', async (req, res) => {
    const api_server = req.body.api_server;
    const access_token = req.body.access_token;
    const symbolId = req.body.symbolId;

    try {
        const optionIdRequest = await axios.get(`${api_server}v1/symbols/${symbolId}/options`, {
            headers: {
                Authorization: `Bearer ${access_token}`
            }
        });
        res.send(optionIdRequest.data);
    } catch(error) {
        console.error(error);
        res.send({error: error});
    }
});

router.post('/option-quote', async (req, res) => {
    const api_server = req.body.api_server;
    const access_token = req.body.access_token;
    const data = req.body.filters;

    try {
        const optionQuoteRequest = await axios.post(`${api_server}v1/markets/quotes/options`, data, {
            headers: {
                Authorization: `Bearer ${access_token}`
            }   
        });
        res.send(optionQuoteRequest.data);
    } catch(error) {
        console.error(error);
        res.send({error: error});
    }
});


export default router; 