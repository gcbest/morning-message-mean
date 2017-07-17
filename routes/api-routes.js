const express = require('express');
const router = express.Router();
const axios = require('axios');
const stringify = require('json-stringify-safe');
const schedule = require('node-schedule');
const passport = require('passport');

const User = require('../models/users');
const Quote = require('../models/quotes');
const api_keys = require('../config/api');

router.get('/weather', passport.authenticate('jwt', {session: false}), (req, res) => {
    const OPEN_WEATHER_MAP_URL = `http://api.openweathermap.org/data/2.5/weather?appid=${api_keys.weatherAppID}&units=imperial`;

    var encodedLocation = encodeURIComponent(req.query.location);
    var requestURL = `${OPEN_WEATHER_MAP_URL}&q=${encodedLocation}`;

    axios.get(requestURL).then(function(response) {
        res.json(response.data);
    });
});

router.get('/news', passport.authenticate('jwt', {session: false}), (req, res) => {
    const source = req.query.source;
    const NEWS_API_URL = `https://newsapi.org/v1/articles?source=${source}&sortBy=top&apiKey=${api_keys.newsAPIKey}`;

    axios.get(NEWS_API_URL).then(function(response) {
        res.json(response.data.articles);
    });
});

router.get('/travel', passport.authenticate('jwt', {session: false}), (req, res) => {
    const origin = req.query.origin;
    const destination = req.query.destination;
    const MAPS_API_URL = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&key=${api_keys.mapsAPIKey}`;

    axios.get(MAPS_API_URL).then(function(response) {
        res.json(response.data.routes[0].legs[0].duration.text);
    });
});

router.get('/quote', passport.authenticate('jwt', {session: false}), (req,res) => {
   // Rate limit 10 calls per hour
    const QUOTES_URL = 'http://quotes.rest/qod.json?category=inspire';
    // let quoteOfTheDay = new Quote({quote: {name: 'belive in yoself', date: '2017-07-17'}});
    Quote.getTodaysQuote((err, todaysQuote) => {
       if (err) {
           console.error(err);
       }
        // If there is no quote for today in the database,
        // get it from the API, add it to the database, and send it to client
       if (todaysQuote.length < 1) {

           axios.get(QUOTES_URL).then(function(response) {
               // res.json(response.data.contents.quotes);
               const quoteInfo = response.data.contents.quotes[0];
               let quoteOfTheDay = new Quote({
                   quote: quoteInfo,
                   date: quoteInfo.date
               });

               Quote.addQuote(quoteOfTheDay, (err) => {
                   if (err) {
                       res.json({success: false, msg: "Failed to add quote"});
                   } else {
                       res.json(quoteInfo);
                   }
               });
           }, function(error) {
               res.json(error);
           });
       } else {
           // If there is already a quote in the database for today send it to client
           const quoteData = todaysQuote[0].quote[0];
           res.json(quoteData);
       }
    });



});

// SMS will be sent immediately
router.get('/sendsms', passport.authenticate('jwt', {session: false}), (req, res) => {
    var MESSAGING_API_URL = `https://rest.nexmo.com/sms/json?api_key=${api_keys.nexmoAPIKey}&api_secret=${api_keys.nexmoAPISecret}&to=${req.query.phone_num}&from=12035338496&text=${req.query.text}`;
    axios.get(MESSAGING_API_URL).then(function(response) {
       res.send(stringify(response.status, null, 2));
    }, function (rejection) {
        console.log(rejection);
        return;
    }).catch(function (err) { console.log(err) });
});

// SMS will only be sent at the time the user specifies
router.get('/timedsms', passport.authenticate('jwt', {session: false}), (req, res) => {
    var rule = new schedule.RecurrenceRule();
    rule.dayOfWeek = [new schedule.Range(0, 6)];
    rule.minute = parseInt(req.query.min);
    rule.hour = parseInt(req.query.hour);

    var unique_job_name = req.query.phone_num + req.query._id;

    schedule.scheduleJob(unique_job_name, rule, function () {
        var MESSAGING_API_URL = `https://rest.nexmo.com/sms/json?api_key=${api_keys.nexmoAPIKey}&api_secret=${api_keys.nexmoAPISecret}&to=${req.query.phone_num}&from=12035338496&text=${req.query.text}`;
        console.log('nexmo: ', MESSAGING_API_URL);
        axios.get(MESSAGING_API_URL).then(function (response) {
        }, function (rejection) {
            console.log(rejection);
            return;
        }).catch(function (err) {
            console.log(err)
        });
    });

    User.getUserById(req.query._id, (err, user) => {
        user.jobName = unique_job_name;
        user.settings.isActive = true;
        user.save((err, updatedUser) => {
            if (err) console.log(err);
            res.json(updatedUser);
        });
    });
});

router.post('/cancelsms', (req, res) => {
    User.getUserById(req.body._id, (err, user) => {
        if (user.jobName) {
            var job = schedule.scheduledJobs[user.jobName];
            job.cancel();
            user.jobName = "";
            user.settings.isActive = false;
            user.save((err, updatedUser) => {
                if (err) console.log(err);
                res.json(updatedUser);
                return;
            });
        } else {
           res.json('no job to cancel');
        }
    });
});

module.exports = router;