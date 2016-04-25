///**
// * Created by Seva on 16/03/2016.
// */
//
//var Comm = require('../models/comment'); //importing Comment model
//var Post = require('../models/post'); //importing Post model
//
///* Get all the posts stored in the DB */
//module.exports.getComments = function(req, res){
//    Comm.find({}, function(err, post){
//        if(err){
//            res.send("Error occurred while retrieving posts: "+ err);
//        }else{
//            res.send(post);
//        }
//    });
//};
//
//module.exports.getCommentsByPost = function (req, res) {
//
//};
///* Create a new post */
//module.exports.addComm = function(req, res){
//    var comm = new Comm(req.body);
//    comm.save(function(err){
//        if(err) {
//            res.send("Could not save the comment: " + err);
//        }
//        else{
//
//            Post.update(
//                {_id: req.body.postId},
//                {$push :{"comments":comm._id}}
//            );
//            res.send(comm);
//        }
//    });
//};
//
///* Get a post by its ID*/
//module.exports.getCommById = function(req, res){
//    Comm.find({id: req.params.id}, function(err, post){
//        if(err){
//            res.send("Error occurred while retrieving a comment: "+ err);
//        }else if(!post){
//            res.send("No comments found");
//        }else{
//            res.send(post);
//        }
//    })
//};
//
///* Get a post by its ID and remove from DB*/
//module.exports.deleteComm = function(req, res){
//    Comm.findByIdAndRemove(req.params.id,function (error){
//        res.send(error);
//    });
//};
//
//////todo fix cascade on removing users(posts) and posts(comments)
/////* Edit a post in DB*/
////module.exports.editPost = function(req, res){
////    Comm.findByIdAndUpdate(req.params.id,function (error){
////        res.send(error);
////    });
////};
//
