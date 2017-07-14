const mongoose = require('mongoose');
const moment = require('moment');

const QuoteSchema = new mongoose.Schema({
    quote: {
        type: Array
    },
    date: {
        type: String
    }
});

// Quote model
const Quote = module.exports = mongoose.model('Quote', QuoteSchema);

module.exports.getTodaysQuote = (callback) => {
    const todaysDate = moment().format("YYYY-MM-DD");
    const tomorrowsDate = moment().add(1, 'day').format("YYYY-MM-DD");

    const query = { $or: [{"date": todaysDate}, {"date": tomorrowsDate} ]};
    Quote.find(query, callback);
};

// module.exports.checkTomorrowsQuote = (callback) => {
//
//     const query = {"date": tomorrowsDate};
//     Quote.find(query, callback);
// };

module.exports.addQuote = (quote, callback) => {
    const todaysDate = moment().format("YYYY-MM-DD");
    const tomorrowsDate = moment().add(1, 'day').format("YYYY-MM-DD");

    const query = { $or: [{"date": todaysDate}, {"date": tomorrowsDate} ]};

    Quote.update(
        query,
        {$setOnInsert: quote},
        {upsert: true},
        callback
    );
};