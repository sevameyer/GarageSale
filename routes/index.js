var express = require('express');
var router = express.Router();
var User = require('../models/user');
//

//
//module.exports = router;


module.exports = function(passport){

///* GET home page. */
//router.get('/', function(req, res, next) {
//        res.render('index', { title: 'Express' });
//    });
//
//    router.get('/home', function(req, res, next){
//        res.render('home',{});
//    });
//
//    router.get('/error', function(req, res, next){
//        res.render('error',{});
//    });

  /* Handle Login POST */
  router.post('/login', passport.authenticate('login'),
  function(req, res, next){
      //console.log(req.user);
      res.send(req.user);
  });

  /* GET Registration Page */
  //router.get('/signup', function(req, res){
  //  res.render('register',{message: req.flash('message')});
  //});

  /* Handle Registration POST */
  router.post('/signup', passport.authenticate('signup', {
    //successRedirect: '/home',
    //failureRedirect: '/error',
    failureFlash : true
  }),
      function(req, res, next){
          console.log(req.user);
          res.send(req.user); //todo try to print out the user
      });

    // route for facebook authentication and login
    router.get('/auth/facebook', passport.authenticate('facebook', { scope : ['email'] }));

    // handle the callback after facebook has authenticated the user
    router.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            //successRedirect : '/profile',
            //failureRedirect : '/'
        }),
        function(req, res, next){
            console.log("facebook"+ req.user);
            res.send(req.user);
        }
    );

    router.get('/logout', function(req, res) {
        req.logOut();
        res.end();
        //req.logout();
    });

  return router;
};