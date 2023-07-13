const joi = require("joi");

const registerSchema = joi.object({
  username: joi.string().trim().required().min(3),
  password: joi
    .string()
    .trim()
    .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
    .min(6)
    .required(),

  email: joi.string().required().trim().email(),
});

const validateRegister = async (req, res, next) => {
  const { error } = registerSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    const newMsg = msg.replace(/"/g, "");

    req.flash("error", newMsg);
    return res.redirect("/register");
  }
  next();
};

const loginSchema = joi.object({
  username: joi.string().trim().required().min(3),
  password: joi
    .string()
    .trim()
    .required()
    .min(6)
    .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
});

const validateLogin = async (req, res, next) => {
  const { error } = loginSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    const newMsg = msg.replace(/"/g, "");
    req.flash("error", newMsg);
    return res.redirect("/login");
  }
  next();
};
module.exports = { validateRegister, validateLogin };
