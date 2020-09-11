CREATE DATABASE database_games;

USE database_games;

--USER TABLE
CREATE TABLE users(
  id INT(11) NOT NULL,
  username VARCHAR(16) NOT NULL,
  password VARCHAR(60) NOT NULL,
  fullname VARCHAR(100) NOT NULL
);

ALTER TABLE users
  ADD PRIMARY KEY (id);

ALTER TABLE users
  MODIFY id INT(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT = 2;

ALTER TABLE users
  MODIFY username VARCHAR(16) NOT NULL UNIQUE;

DESCRIBE users;

--GAMES TABLE
CREATE TABLE games(
  id INT(11) NOT NULL,
  title VARCHAR(150) NOT NULL,
  genre VARCHAR(150) NOT NULL,
  description TEXT,
  user_id INT(11),
  created_at timestamp NOT NULL DEFAULT current_timestamp,
  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id)
);
/*
  user_id - cada game pertenece a un usuario especifico
  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id)
  llave foranea user id y esta refenreciada en la tabla users, la llave es el id
*/

ALTER TABLE games
  ADD PRIMARY KEY (id);

ALTER TABLE games
  MODIFY id INT(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT = 2;

DESCRIBE games;
