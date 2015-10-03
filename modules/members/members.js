/**
 * Created by natalie on 10/2/2015.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var Members = new Schema({
    username: String,
    firstName: String,
    lastName: String,
    birthday: Date,
    bio: String,
    interests: String
});

module.exports = mongoose.model('Members', Members);