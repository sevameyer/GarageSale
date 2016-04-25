/**
 * Created by Seva on 08/03/2016.
 */

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var PostSchema = new Schema({
    "image": String,
    "actualWidth": Number,
    "actualHeight": Number,
    "message":String,
    "price": String,
    "location": String,
    "comments":[],
    "is_available": Boolean
});

module.exports = mongoose.model('Post', PostSchema);