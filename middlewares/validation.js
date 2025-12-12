const { celebrate, Joi, Segments } = require("celebrate");
const validator = require("validator");

// Custom URL validator
const urlValidator = (value, helpers) => {
  if (!validator.isURL(value)) {
    return helpers.error("string.uri");
  }
  return value;
};

// ------------------------
// User Validations
// ------------------------
const validateSignup = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    avatar: Joi.string().custom(urlValidator).required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
});

const validateSignin = celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
});

const validateUpdateUser = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    avatar: Joi.string().custom(urlValidator).required(),
  }),
});

// ------------------------
// Clothing Item Validations
// ------------------------
const validateCreateItem = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    weather: Joi.string().valid("hot", "warm", "cold").required(),
    imageUrl: Joi.string().custom(urlValidator).required(),
  }),
});

const validateItemIdParam = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    itemId: Joi.string().hex().length(24).required(),
  }),
});

module.exports = {
  validateSignup,
  validateSignin,
  validateUpdateUser,
  validateCreateItem,
  validateItemIdParam,
};
