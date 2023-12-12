const MIN_PASSWORD_LENGTH = 8;

const validatePassword = (password) => {
    if (!checkLength(password)) {
        return false;
    }

    if (!checkSymbol(password)) {
        return false;
    }

    return true;
}

const checkCapitalLetter = (password) => {
    return /[A-Z]/.test(password);
  };

const checkNumber = (password) => {
    return /\d/.test(password);
  };
  
const checkLength = (password) => {
    return password.length >= MIN_PASSWORD_LENGTH;
}

const checkSymbol = (password) => {
    const regEx = new RegExp("[#?!@$ %^&*-]");
    return regEx.test(password);
}

module.exports = {validatePassword, checkLength, checkSymbol,checkCapitalLetter,checkNumber};