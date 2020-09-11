const express = require('express');
const router = express.Router();

const passport = require('passport');
const pool = require('../database');
const {isLoggedIn, isNotLoggedIn, isAdmin} = require('../lib/auth')



//signup
//render
router.get('/signup', isNotLoggedIn, (req, res) => {
  res.render('auth/signup');
});

//receive
// router.post('/signup', (req, res) => {
//   passport.authenticate('local.signup', {
//     successRedirect: '/profile',
//     failureRedirect: '/signup',
//     failureFlash: true
//   })
//   res.send('received')
// });

router.post('/signup', isNotLoggedIn, passport.authenticate('local.signup', {
  successRedirect: '/profile',
  failureRedirect: '/signup',
  failureFlash: true
}));

//signin
router.get('/signin', isNotLoggedIn, (req, res) => {
  res.render('auth/signin');
});

router.post('/signin', isNotLoggedIn, (req, res, next) => {
  passport.authenticate('local.signin', {
    successRedirect: '/profile',
    failureRedirect: '/signin',
    failureFlash: true
  })(req, res, next);
});

//admin
router.get('/admin', isNotLoggedIn,  (req, res) => {
  res.render('auth/admin');
});

router.post('/admin', isNotLoggedIn, (req, res, next) => {
  passport.authenticate('local.admin', {
    successRedirect: '/users',
    failureRedirect: '/admin',
    failureFlash: true
  })(req, res, next);
})

//profile
router.get('/profile', isLoggedIn, (req, res) => {
    res.render('profile');
});

//users
router.get('/users', isAdmin, async (req, res) => {

    const users = await pool.query('SELECT * FROM users')
    res.render('users/list', {users}) 
  
});

//logout
router.get('/logout', isLoggedIn, (req,res) => {
  req.logOut();
  res.redirect('/signin');
});

module.exports = router;