const { Number } = require('mongoose');
const mongoose = require('mongoose');

const tweet = new mongoose.Schema({
    index: {type: Number},
    tweet_id: {type: String, unique: true, dropDups: true},
    conversation_id: {type: String, require: true},
    text: {type: String, require: true},
    lang: {type: String, require: true},
    created_tweet_at: {type: String, require: true},
    public_metrics: {type: Object, require: true},
    referenced_tweets: {type: Array, require: true, default: []},
    next_token: String,
    key_words: String
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

module.exports = mongoose.model('v4_tweets', tweet);;