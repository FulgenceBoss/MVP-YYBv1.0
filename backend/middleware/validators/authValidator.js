const { check, validationResult } = require("express-validator");

exports.validateRegister = [
  check("phoneNumber")
    .trim()
    .isLength({ min: 8, max: 9 })
    .withMessage("Le numéro de téléphone doit être valide.")
    .isNumeric()
    .withMessage("Le numéro de téléphone ne doit contenir que des chiffres."),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

exports.validateVerify = [
  check("phoneNumber")
    .trim()
    .notEmpty()
    .withMessage("Le numéro de téléphone est requis."),
  check("otpCode")
    .isLength({ min: 6, max: 6 })
    .withMessage("Le code OTP doit faire 6 chiffres.")
    .isNumeric()
    .withMessage("Le code OTP ne doit contenir que des chiffres."),
  check("pin")
    .isLength({ min: 4, max: 4 })
    .withMessage("Le PIN doit faire 4 chiffres.")
    .isNumeric()
    .withMessage("Le PIN ne doit contenir que des chiffres."),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

exports.validateLogin = [
  check("phoneNumber")
    .trim()
    .notEmpty()
    .withMessage("Le numéro de téléphone est requis."),
  check("pin")
    .isLength({ min: 4, max: 4 })
    .withMessage("Le PIN doit faire 4 chiffres.")
    .isNumeric()
    .withMessage("Le PIN ne doit contenir que des chiffres."),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
