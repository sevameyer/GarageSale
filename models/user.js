/**
 * Created by Seva on 20/02/2016.
 */
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var Schema = mongoose.Schema;

var UserSchema = new Schema({

    "fb_id": String,
    "name": String, //name for Facebook SDK
    "email": String,
    "password": String, //in case of local login
    "fb_token": String, //access token for FB
    "posts":[]
   /* local: {
        "name": String,
        "username": String,
        "email": String,
        "password": String,
        "posts": []
    },

    facebook: {
        "id": String,
        "token": String,
        "email": String,
        "name": String,
        "posts": []
    }*/
});

// methods ======================
// generating a hash
UserSchema.methods.generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
UserSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.local.password);
};

module.exports = mongoose.model('User', UserSchema);