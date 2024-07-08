// models/user.model.js
const db = require('../config/db.config');
const bcrypt = require('bcryptjs');

// Función para encontrar un usuario por nombre de usuario
const findUserByUsername = (username, callback) => {
  db.query('SELECT * FROM usuarios WHERE username = ?', [username], (err, results) => {
    if (err) {
      return callback(err, null);
    }
    if (results.length === 0) {
      return callback(new Error('Usuario no encontrado'), null);
    }
    return callback(null, results[0]);
  });
};

// Función para crear un nuevo usuario
const createUser = (user, callback) => {
  const hashedPassword = bcrypt.hashSync(user.password, 8);
  const sql = 'INSERT INTO usuarios (username, password, role) VALUES (?, ?, ?)';
  db.query(sql, [user.username, hashedPassword, user.role], (err, result) => {
    if (err) {
      return callback(err, null);
    }
    return callback(null, result.insertId);
  });
};

module.exports = {
  findUserByUsername,
  createUser
};
