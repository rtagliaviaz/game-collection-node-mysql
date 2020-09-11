const express = require('express');
const router = express.Router();

const pool = require('../database');

router.get('/', async (req, res) => {
  const users = await pool.query('SELECT * FROM users')
  res.render('users/list', {users})
});


//Delete users
router.get('/delete/:id', async (req, res) => {
  const {id} = req.params;
  if (id == 16) {
    req.flash('error', 'this user cant be deleted');
    res.redirect('/users')
  } else {
  await pool.query('DELETE FROM users WHERE id = ?', [id])
  req.flash('success', 'User deleted successfully');
  res.redirect('/users')
  }
})

//edit users
//get route
router.get('/edit/:id', async(req, res) => {
const {id} = req.params;
const users = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
console.log(users)
req.flash('success', 'User edited successfully');
res.render('users/edit', {user: users[0]});
})

//post route
router.post('/edit/:id', async (req, res) => {
  const {id} = req.params;
  const {fullname, username} = req.body;
  const editedUser = {
    fullname,
    username
  };
  //quiero hacer un update en la tabla users con los datos de editedUser donde el id sea el que te estoy pasando
  await pool.query('UPDATE users set ? WHERE id = ?', [editedUser, id]);
  res.redirect('/users');
})


module.exports = router;