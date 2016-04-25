/**
 * Created by Seva on 16/03/2016.
 */

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var CommentSchema = new Schema({
    "text": String,
    "author": String
});

module.exports = mongoose.model('Comment', CommentSchema);