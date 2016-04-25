/**
 * Created by Seva on 08/03/2016.
 *
 * This controller handles all the operations on posts in the database
 *
 */

var Post = require('../models/post'); //importing Post model
var Comm = require('../models/comment'); //importing Comment model
var userCtrl = require('../controllers/user_controller');

/* Get all the posts stored in the DB */
module.exports.getPosts = function(req, res){
  Post.find({}, function(err, post){
      if(err){
          res.send("Error occurred while retrieving posts: "+ err);
      }else{
          res.send(post);
      }
  });
};


/* Create a new post */
module.exports.addPost = function(req, res){
    req.body.image = req.files[0].path;
    console.log(req.files[0].path);
    var id = "";
    //var file = req.files.file,
    //    filePath = file.path,
    //    lastIndex = filePath.lastIndexOf("/"),
    //    tmpFileName = filePath.substr(lastIndex + 1),
    //    image = req.body;
    var temp = {
        image:req.body.image,
        price: req.body.price,
        message: req.body.message,
        location: req.body.location
    };

    var userId = req.body.userId;
    var post = new Post(temp); //todo add id to the user
    post.save(function(err){
        if(err) {
            res.send("Could not save the post: " + err);
        }
        else{
            postId = post._id;
            //userCtrl.getUserById(userId);
            userCtrl.editUser(userId, postId);
            res.send(post);
        }
    });


};

/* Get a post by its ID*/
module.exports.getPostById = function(req, res){
    Post.find({"_id": req.params.id}, function(err, post){
        if(err){
            res.send("Error occurred while retrieving a post: "+ err);
        }else if(!post){
            res.send("No posts found");
        }else{

            res.send(post);
        }
    })
};

module.exports.getCommentsById = function(req, res){
    Post.findById(req.params.id, function (err, post) {
        if(err){
            res.send("Error occurred while retrieving a post: "+ err);
        }else if(!post){
            res.send("No posts found");
        }else{
            //var comments = [];
            Comm.find({
                '_id': { $in: post.comments}
            }, function (err, comments) {
                console.log(comments);
                res.send(comments);
            });

        }
    })
};


/* Get a post by its ID and remove from DB*/
module.exports.deletePost = function(req, res){
    Post.findByIdAndRemove(req.params.id,function (error){
        res.send(error);
    });
};

//todo fix cascade on removing users(posts) and posts(comments)
// $set should only update the specified field
/* Edit a post in DB*/
module.exports.editPost = function(req, res){
    Post.findByIdAndUpdate(req.params.id,{
        $set: {
            is_available: req.body.is_available,
            message: req.body.message,
            price:req.body.price
        }
    },function (error){
        res.send(error);
    });
};

module.exports.addComment = function (req, res) {

    var comment = new Comm(req.body);
    comment.save(function(err){
        if(err){
            res.send("Error has occured while adding a comment: "+ err);
        }
        else{
            Post.findByIdAndUpdate(
                req.params.id,
                {"$push":{"comments":comment._id}},
                function (error){
                    res.send(error);
                }
            )
        }
    });

};

