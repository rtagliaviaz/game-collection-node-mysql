const bcrypt = require('bcryptjs');

const helpers = {};

//register password return-> hash password
helpers.encryptPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  return hash;
};

//compare password when loggin (password in the loggin form vs password stored in the DB)
//return bool
helpers.matchPassword =  async (password,  savedPassword) => {
  try {
    return await bcrypt.compare(password, savedPassword);
  } catch (error) {
    console.log(error);
  }
}


module.exports = helpers;