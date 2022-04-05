const Joi = require("joi");
require("dotenv").config();
const envVariables = {
  client_id: process.env.REACT_APP_CLIENT_ID,
  redirect_uri: process.env.REACT_APP_REDIRECT_URI,
  client_secret: process.env.REACT_APP_CLIENT_SECRET
};
const validateSchema = Joi.object({
  client_id: Joi.string().required(),
  redirect_uri: Joi.string().required(),
  client_secret: Joi.string().required()
});
const { error } = validateSchema.validate(envVariables);
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}
module.exports = envVariables;
