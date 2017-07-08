var express = require('express');
var router = express.Router();
var axios = require('axios');
var stringify = require('json-stringify-safe');


var api_keys = require('../config/api');

router.get('/weather', (req, res) => {
    console.log('req.query.location: ', req.query.location);
    const OPEN_WEATHER_MAP_URL = `http://api.openweathermap.org/data/2.5/weather?appid=${api_keys.weatherAppID}&units=imperial`;

    var encodedLocation = encodeURIComponent(req.query.location);
    var requestURL = `${OPEN_WEATHER_MAP_URL}&q=${encodedLocation}`;

    axios.get(requestURL).then(function(response) {
        res.json(response.data.main.temp);
    });
});

router.get('/news', (req, res) => {
    const source = req.query.source;
    const NEWS_API_URL = `https://newsapi.org/v1/articles?source=${source}&sortBy=top&apiKey=96cc8c5dfcc34d8797a4fdeb9f2b5d43`;

    axios.get(NEWS_API_URL).then(function(response) {
        res.json(response.data.articles);
    });
});

router.get('/sendsms', (req, res) => {
    var MESSAGING_API_URL = `https://rest.nexmo.com/sms/json?api_key=${api_keys.nexmoAPIKey}&api_secret=${api_keys.nexmoAPISecret}&to=${req.query.phoneNum}&from=12035338496&text=${req.query.text}`;
    console.log('nexmo: ', MESSAGING_API_URL);
    axios.get(MESSAGING_API_URL).then(function(response) {
       res.send(stringify(response.status, null, 2));
    }, function (rejection) {
        console.log(rejection);
        return;
    }).catch(function (err) { console.log(err) });
});

module.exports = router;