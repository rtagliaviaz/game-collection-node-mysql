const {format} = require('timeago.js');

//helpers esta en index
const helpers = {};

//helpers va ausar timeago y le vamos a apsar created_at que es de nuestra DB
helpers.timeago = (created_at) => {
  //return timestapm with a new format
  return format(created_at);
};

helpers.isEq = (user) => {
  return user == 'admin';
};


module.exports = helpers;