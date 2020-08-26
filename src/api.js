import axios from 'axios';

var refresh_token = '';
var access_token = '';
var api_server = '';

export const fetchOptionData = async (ticker) => {
    try {
        // Get saved refresh token from text file
        if (refresh_token === '') {
            const tokenRequest = await axios.get('/api/token');
            refresh_token = tokenRequest.data.refresh_token;
        }

        // Get authorization data from Questrade
        const authRequest = await axios.get('/api/auth', {
            params: {
                refresh_token: refresh_token
            }
        });
        const secrets = authRequest.data;
        access_token = secrets.access_token;
        api_server = secrets.api_server;
        refresh_token = secrets.refresh_token;

        // Save new refresh token to text file
        axios.post('/api/token', {
            refresh_token: refresh_token
        });

        // Get the Questrade internal id and description of requested ticker
        const symbolIdRequest = await axios.post('/api/symbol-id', {
            api_server: api_server,
            access_token: access_token,
            ticker: ticker
        });
        if (symbolIdRequest.data.symbols.length == 0) {
            return [];
        }
        const symbolId = symbolIdRequest.data.symbols[0].symbolId;
        const symbolDesc = symbolIdRequest.data.symbols[0].description;
        const symbolPrevClosePrice = symbolIdRequest.data.symbols[0].prevDayClosePrice;
        
        // Get the Questrade share price and change of requested ticker
        const symbolQuoteRequest = await axios.post('/api/symbol-quote', {
            api_server: api_server,
            access_token: access_token,
            symbolId: symbolId
        });
        const symbolLastPrice = symbolQuoteRequest.data.quotes[0].lastTradePriceTrHrs;

        // Get the Questrade internal options ids for requested ticker
        const optionIdRequest = await axios.post('/api/option-data', {
            api_server: api_server,
            access_token: access_token,
            symbolId: symbolId
        });
        //const idList = makeIdList(optionIdRequest.data);
        const expiryList = makeExpiryList(optionIdRequest.data);
        const filters = makeFilters(expiryList, symbolId);

        const optionQuoteRequest = await axios.post('/api/option-quote', {
            api_server: api_server,
            access_token: access_token,
            filters: filters
        });

        return {
            optionData: optionQuoteRequest.data, 
            symbolDesc: symbolDesc,
            symbolLastPrice: symbolLastPrice,
            symbolPrevClosePrice: symbolPrevClosePrice
        };
    } catch(error) {
        console.error(error);
        return [];
    }
}

const makeIdList = (optionsData) => {
    let idList = [];
    for (const expiry of optionsData.optionChain) {
        let optionIds = expiry.chainPerRoot[0].chainPerStrikePrice;
        for (const strike of optionIds) {
            idList.push(strike.callSymbolId, strike.putSymbolId);
        }
    }

    return idList;
}

const makeExpiryList = (optionsData) => {
    let expiryList = [];
    for (const expiry of optionsData.optionChain) {
        expiryList.push(expiry.expiryDate)
    }

    return expiryList;
}

const makeFilters = (expiryList, symbolId) => {
    let filterObj = {filters: []};

    for (const expiry of expiryList) {
        let filter = {
            underlyingId: symbolId,
            expiryDate: expiry
        };
        filterObj.filters.push(filter);
    }

    return filterObj;
}