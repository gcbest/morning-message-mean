const express = require('express');
const router = express.Router();
const axios = require('axios');
const stringify = require('json-stringify-safe');
const User = require('../models/users');

const schedule = require('node-schedule');



const api_keys = require('../config/api');

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

router.get('/travel', (req, res) => {
    const origin = req.query.homeaddress;
    const destination = req.query.destination;
    const MAPS_API_URL = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&key=${api_keys.mapsAPIKey}`;

    axios.get(MAPS_API_URL).then(function(response) {
        console.log('GET /TRAVEL response', response.data.routes[0].legs[0].duration.text);
        res.json(response.data.routes[0].legs[0].duration.text);
    });
});

// SMS will be sent immediately
router.get('/sendsms', (req, res) => {
    var MESSAGING_API_URL = `https://rest.nexmo.com/sms/json?api_key=${api_keys.nexmoAPIKey}&api_secret=${api_keys.nexmoAPISecret}&to=${req.query.phone_num}&from=12035338496&text=${req.query.text}`;
    console.log('nexmo: ', MESSAGING_API_URL);
    axios.get(MESSAGING_API_URL).then(function(response) {
       res.send(stringify(response.status, null, 2));
    }, function (rejection) {
        console.log(rejection);
        return;
    }).catch(function (err) { console.log(err) });
});

// SMS will only be sent at the time the user specifies
router.get('/timedsms', (req, res) => {
    var timeStr = decodeURIComponent(req.query.time);
    console.log(timeStr);

    var rule = new schedule.RecurrenceRule();
    rule.dayOfWeek = [new schedule.Range(1, 5)];
    rule.minute = parseInt(req.query.min);
    rule.hour = parseInt(req.query.hour);

    console.log('rule', rule);

    var unique_job_name = req.query.phone_number + req.query._id;

    var j = schedule.scheduleJob(unique_job_name, rule, function () {
            var MESSAGING_API_URL = `https://rest.nexmo.com/sms/json?api_key=${api_keys.nexmoAPIKey}&api_secret=${api_keys.nexmoAPISecret}&to=${req.query.phone_num}&from=12035338496&text=${req.query.text}`;
            console.log('nexmo: ', MESSAGING_API_URL);
            axios.get(MESSAGING_API_URL).then(function (response) {
                // res.send(stringify(response.status, null, 2));
            }, function (rejection) {
                console.log(rejection);
                return;
            }).catch(function (err) {
                console.log(err)
            });
        });

    User.getUserById(req.query._id, (err, user) => {
        console.log(user);
        user.jobName = unique_job_name;
        user.settings.isActive = true;
        user.save((err, updatedUser) => {
            if (err) console.log(err);
            res.json(updatedUser);
            console.log('updatedUser GET /TIMEDSMS', updatedUser);
        });
    });
});

router.post('/cancelsms', (req, res) => {
    console.log('req.body', req.body);
    User.getUserById(req.body._id, (err, user) => {
        console.log('user.jobName', user.jobName);
        if (user.jobName) {
            var job = schedule.scheduledJobs[user.jobName];
            job.cancel();
            user.jobName = "";
            user.settings.isActive = false;
            user.save((err, updatedUser) => {
                if (err) console.log(err);
                res.json(updatedUser);
                console.log('updatedUser POST /CANCELSMS', updatedUser);
                return;
            });
        } else {
           res.json('no job to cancel');
        }
    });
});

module.exports = router;