var express = require('express');
var userCtrl = require('../controllers/user_controller');
var router = express.Router();

function isLoggedIn(req, res, next) {
    if (req.query.user || req.body.user) {
        return next();
    } else {
        return res.send(401);
    }
}
    /* GET users listing. */
    router.get('/users',isLoggedIn,userCtrl.getUsers); //list all the users
  //  router.post('/users', userCtrl.addUser); //create a user
    router.delete('/users/:email',isLoggedIn, userCtrl.deleteUser); //remove a user
    router.get('/users/:email', isLoggedIn,userCtrl.getUserByEmail);
    router.get('/users/posts/:email',isLoggedIn, userCtrl.getUserPosts);


module.exports = router;
