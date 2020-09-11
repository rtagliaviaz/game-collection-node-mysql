const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const pool = require('../database');
const helpers = require('./helpers');

//definir autentication

/* 
name local.admin

*/
passport.use('local.admin', new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password',
  passReqToCallback: true
}, async (req, username, password, done) => {
  
  if (username == 'admin') {
    const rows = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
    if (rows.length > 0) {
      const user = rows[0]
      const validPassword = await helpers.matchPassword(password, user.password)
      if(validPassword){
        done(null, user, req.flash('success', 'Welcome ' + user.username));
      } else {
        done(null, false, req.flash('error', 'Incorrect Password'));
      }
    }
  } else {
    return done(null, false, req.flash('error', 'Access Denied: You are not an Admin'));
  }
  
}))

/*
  nombre local.signin
  instanciacion new LocalStrategy
  usernameField,
  password
*/
passport.use('local.signin', new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password',
  passReqToCallback: true
}, async (req, username, password, done) => {
  console.log(username, password);
  const rows = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
  if (rows.length > 0) {
    const user = rows[0];
    const validPassword = await helpers.matchPassword(password, user.password)
    if(validPassword){
      done(null, user, req.flash('success', 'Welcome' + user.username));
    } else {
      done(null, false, req.flash('error', 'Incorrect Password'));
    }
  } else {
    return done(null, false, req.flash('error', 'The username does not exist'));
  }
}))

/*
  nombre local.signup,
  instanciacion new LocalStrategy
  usernameField: username -> campo username determinado en view y en la db
  passwordField: 'password' -> campo password
*/
passport.use('local.signup', new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password',
  passReqToCallback: true //recibir otros campos adicionales, en este aso fullName, los recibe de la ruta auth cuando pasa passport
}, async (req, username, password, done) => {
  const {fullname} = req.body;
  const newUser = {
    username,
    password,
    fullname
  };
  // newUser.username = mysql_real_escape_string($username); // escape string before passing it to query.
  const duplicateUser = await pool.query("SELECT username FROM users WHERE username = ?", newUser.username);
  if (duplicateUser != 0) {
    done(null, false, req.flash('error', 'Username Already Exists'));
    console.log('USERNAME ALREADY EXISTS');
  } else {
    newUser.password = await helpers.encryptPassword(password); //encrypt pass
    //insertar datos a la db
    const result = await pool.query('INSERT INTO users SET ?', [newUser]);
    console.log(result)
    newUser.id = result.insertId;
    return done(null, newUser);
  }
}));

passport.serializeUser((user, done) => { //guardo id usuario
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => { //id seleccionado para obtener los datos
  const rows = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
  done(null, rows[0]); //row, objeto 0 del array ya que rows devuelve un array, y ese objeto v aa devolver los datos es decir username, pass y fullname
});



