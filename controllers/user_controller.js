/**
 * Created by Seva on 20/02/2016.
 */
/**
 *
 * @type {*|exports|module.exports}
 */
var User = require('../models/user');
var Post = require('../models/post');

module.exports.getUsers = function(req, res){
   User.find({}, function(err, user){
       //var users = {};

       if(err) {
           console.log("muh error");
           return console.error(err);
       }
       else{
           //users[user._id] = user;
           //console.log(user);
           res.json(user);
       }
   });
};

module.exports.getUserByEmail = function(req, res){
    User.findOne({"email":req.params.email}, //todo change email to local.email later
        function (err, user) {
            // In case of any error, return using the done method
            if (err)
               res.send(err);

            // Username does not exist, log error & redirect back
            if (!user) {
                res.send('User Not Found with email ' + req.params.email);

            }
            console.log(user);
            res.send(user);

        }
    );
};

module.exports.getUserPosts = function(req, res){
    User.findOne({"email":req.params.email},
        function (err, user) {
            Post.find({
                '_id': { $in: user.posts}
            }, function (err, posts) {
                //console.log(comments);
                res.send(posts);
            });
        });
};

module.exports.getUserById = function(value){
    User.findOne({'_id': value}, //todo change email to local.email later
        function (err, user) {
            // In case of any error, return using the done method
            if (err)
                res.send(err);

            // Username does not exist, log error & redirect back
            if (!user) {
                res.send('User Not Found with email ' + req.params.email);

            }
            console.log(user);
            res.send(user);

        }
    );
};
module.exports.deleteUser = function(req, res) {


    User.remove({"email": req.params.email}  , function (err) {
        if (err){
            res.send("Could not remove " + err);
        }else{
            res.send("Removed "+ req.params.email);
        }
    });


};


module.exports.updateUser = function(req, res) {

    User.findByIdAndUpdate(req.params.id,function (error){
        res.send(error);
    });
};

module.exports.editUser = function(value, postId) {

    User.findByIdAndUpdate(value, {
        "$push":{ "posts":postId}
    }, function(error){
        //res.send(error);
    });
};

//MyModel.remove({}, function(err,removed) {});

