/**
 * Created by Seva on 06/03/2016.
 */
var passport = require('passport');
var User = require('../models/user');
// load all the things we need
var LocalStrategy   = require('passport-local').Strategy;
var bCrypt = require("bcrypt-nodejs");
var JsonStrategy = require('passport-json').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var configAuth = require('./auth');
module.exports = function(passport) {

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findOne({ _id: id }, function(err, user) {
            done(err, user);
        });
    });

    passport.use('login', new JsonStrategy({
            passReqToCallback: true,
            usernameProp:'email',
            passwordProp:'password'
        },
        function (req, email, password, done) {
            // check in mongo if a user with username exists or not
            User.findOne({'email': email}, //todo change email to local.email later
                function (err, user) {
                    // In case of any error, return using the done method
                    if (err)
                        return done(err);
                    // Username does not exist, log error & redirect back
                    if (!user) {
                        console.log('User Not Found with username ' + email);
                        return done(null, false,
                            req.flash('message', 'User Not found.'));
                    }
                    // User exists but wrong password, log the error
                    if (!isValidPassword(user, password)) {
                        console.log('Invalid Password');
                        return done(null, false,
                            req.flash('message', 'Invalid Password'));
                    }
                    // User and password both match, return user from
                    // done method which will be treated like success

                    return done(null, user);
                }
            );
        }));




    passport.use('signup', new JsonStrategy({
            passReqToCallback: true,
            usernameProp: 'email',
            passwordProp: 'password'
        },
        function (req, email, password, done) {
            findOrCreateUser = function () {
                // find a user in Mongo with provided username
                User.findOne({'email': email}, function (err, user) {
                    // In case of any error return
                    if (err) {
                        console.log('Error in SignUp: ' + err);
                        return done(err);
                    }
                    // already exists
                    if (user) {
                        console.log('User already exists');
                        return done(null, false,
                            req.flash('message', 'User Already Exists'));
                    } else {
                        // if there is no user with that email
                        // create the user
                        var newUser = new User();
                        // set the user's local credentials
                        newUser.email = req.body.email;
                        newUser.password = createHash(req.body.password);
                        newUser.name = req.body.name;

                        // save the user
                        newUser.save(function (err) {
                            if (err) {
                                console.log('Error in Saving user: ' + err);
                                throw err;
                            }
                            console.log('User Registration succesful');
                            return done(null, newUser);
                        });
                    }
                });
            };

            // Delay the execution of findOrCreateUser and execute
            // the method in the next tick of the event loop
            process.nextTick(findOrCreateUser);
        }));


    passport.use('facebook', new FacebookStrategy({

            // pull in our app id and secret from our auth.js file
            clientID        : configAuth.facebookAuth.clientID,
            clientSecret    : configAuth.facebookAuth.clientSecret,
            callbackURL     : configAuth.facebookAuth.callbackURL,
            profileFields   : configAuth.facebookAuth.profileFields

        },

        // facebook will send back the token and profile
        function(token, refreshToken, profile, done) {

            // asynchronous
            process.nextTick(function() {

                // find the user in the database based on their facebook id
                User.findOne({ 'fb_id' : profile.id }, function(err, user) {

                    // if there is an error, stop everything and return that
                    // ie an error connecting to the database
                    if (err)
                        return done(err);

                    // if the user is found, then log them in
                    if (user) {
                        return done(null, user); // user found, return that user
                    } else {
                        // if there is no user found with that facebook id, create them
                        var newUser = new User();

                        //console.log("MY FACEBOOK: "+ profile.givenName);
                        // set all of the facebook information in our user model
                        newUser.fb_id    = profile.id; // set the users facebook id
                        newUser.fb_token = token; // we will save the token that facebook provides to the user
                        newUser.name  = profile.name.givenName + " "+ profile.name.familyName; // look at the passport user profile to see how names are returned
                        newUser.email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first

                        // save our user to the database
                        newUser.save(function(err) {
                            if (err)
                                throw err;

                            // if successful, return the new user
                            return done(null, newUser);
                        });
                    }

                });
            });

        }));

    var isValidPassword = function (user, password) {
        return bCrypt.compareSync(password, user.password);
    };

// Generates hash using bCrypt
    var createHash = function (password) {
        return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
    };

};