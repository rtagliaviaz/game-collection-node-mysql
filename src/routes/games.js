const express = require('express');
const router = express.Router();

//db es pool usaremos pool por nombre
const pool = require('../database');
const {isLoggedIn} = require('../lib/auth')

router.get('/add', isLoggedIn, (req, res) => {
  res.render('games/add');
});

router.post('/add', isLoggedIn, async (req, res) => {
  //destructuring
  const {title, genre, description} = req.body;
  //asign values to a newGame object
  const newGame = {
    title,
    genre,
    description,
    user_id: req.user.id// relaciona la tabla con el user
    //el user.id lo obtenemos porque lo obtenemos en passport y lo pasamos a index como global var
  };
  /*save this data in the db with pool.query()

  */
  await pool.query('INSERT INTO games set ?', [newGame]);
  //connect-flash msg
  //success was predefined in index.js
  req.flash('success', 'Game added successfully');
  res.redirect('/games');
})

//SHOW ALL GAMES
router.get('/', isLoggedIn, async (req, res) => {
  // SELECT * FROM games -> consulta la tabla games de la DB
  // const games = await pool.query('SELECT * FROM games');
  const games = await pool.query('SELECT * FROM games WHERE user_id = ?', [req.user.id]) // donde el id sea igual a req.user.id
  // paso games a la view 'links/games' 
  res.render('games/list', {games});
});

//DELETE
router.get('/delete/:id', isLoggedIn, async (req, res) => {
  const {id} = req.params;
  //del el id que coincida con el id que te manda el usuario
  await pool.query('DELETE FROM games WHERE id = ?', [id]);
  req.flash('success', 'Game deleted successfully');
  res.redirect('/games')
});

//EDIT
router.get('/edit/:id', isLoggedIn, async (req, res) => {
  const {id} = req.params;
  //quiero los datos de games donde el id sea igual al que te estoy pasando
  const games = await pool.query('SELECT * FROM games WHERE id = ?', [id]);
  console.log(games)
  req.flash('success', 'Game edited successfully');
  res.render('games/edit', {game: games[0]});
})

router.post('/edit/:id', isLoggedIn, async (req, res) => {
  const {id} = req.params;
  const {title, genre, description} = req.body;
  const editedGame = {
    title,
    genre,
    description
  };
  //quiero hacer un update en la tabla games con los datos de editedGame donde el id sea el que te estoy pasando
  await pool.query('UPDATE games set ? WHERE id = ?', [editedGame, id]);
  res.redirect('/games');
})

module.exports = router;