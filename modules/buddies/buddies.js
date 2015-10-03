/**
 * Created by natalie on 10/1/2015.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var Buddies = new Schema({
    username: String,
    firstName: String,
    lastName: String,
    status: String,
    team: String,
    task: String,
    lastOnline: Date,
    email: String,
    birthday: Date,
    bio: String,
    priority: Number
});

module.exports = mongoose.model('Buddies', Buddies);