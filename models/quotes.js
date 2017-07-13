const mongoose = require('mongoose');
const moment = require('moment');

const QuoteSchema = new mongoose.Schema({
    quote: {
        type: Object
    },
    date: {
        type: String
    }
});

// Quote model
const Quote = module.exports = mongoose.model('Quote', QuoteSchema);

module.exports.getTodaysQuote = () => {
    var todaysDate = moment().format("YYYY-MM-DD");
};

module.exports.addQuote = (quote, callback) => {
    var todaysDate = moment().format("YYYY-MM-DD");
    console.log('todaysDate', todaysDate);
    // Setup stuff
    var query = { date: todaysDate },
        update = { expire: new Date() },
        options = { upsert: true };

    // Find the document
    Quote.findOneAndUpdate(query, update, options, function(error, result) {
        if (!error) {
            // If the document doesn't exist
            if (!result) {
                // Create it
                result = quote;
            }
            // Save the document
            result.save(callback);
        } else {
            console.error(error);
        }
    });
};