const bycrpt = require('bcryptjs');

const comparePassword = (password, hashedPassword) => {
  return bycrpt.compareSync(password, hashedPassword);
};

const validateUserInput = (email, password) => {
  return(
    email && password
  );
};

module.exports = {
  validateUserInput,
  comparePassword
};