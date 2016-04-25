/**
 * Created by Seva on 08/03/2016.
 */
var express = require('express');
var postCtrl = require('../controllers/post_controller');
var router = express.Router();

//function ensureAuthenticated(req, res, next) {
//    if (req.isAuthenticated()) { return next(); }
//    res.redirect('login')
//}
function isLoggedIn(req, res, next) {
    if (req.query.user || req.body.user) {
        return next();
    } else {
        return res.send(401);
    }
}

router.get('/posts', isLoggedIn, postCtrl.getPosts);
router.get('/posts/:id',isLoggedIn, postCtrl.getPostById);
router.post('/posts',isLoggedIn, postCtrl.addPost);
router.delete('/posts/:id',isLoggedIn, postCtrl.deletePost);
router.put('/posts/:id',isLoggedIn, postCtrl.editPost);
router.put('/posts/comments/:id',isLoggedIn, postCtrl.addComment);
router.get('/posts/comments/:id',isLoggedIn, postCtrl.getCommentsById);
module.exports = router;