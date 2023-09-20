const { ExpressValidator, body } = require("express-validator");

const notesval = function notesValidate() {
  return [
    body("title")
      .isLength({ min: 4 })
      .withMessage("username must be at least 4 chars long")
      .isLength({ max: 12 })
      // .withMessage(' username must be less than 12 chars long')
      // .exists()
      // .withMessage('username is required')
      // .trim()
      // .matches(/^[A-Za-z0-9\_]+$/)
      // .withMessage('username must be alphanumeric only')
      .escape(),
    body("description")
      .isLength({ min: 6 })
      .withMessage("description must be at least 6 characters"),
  ];
};

module.exports = notesval;
