const validator = require("validator");
const User = require("../models/schemas/user");

const validateEmail = (content) => {
  return validator.isEmail(content);
};
const validateMobile = (content) => {
  return validator.isMobilePhone(content, "en-IN");
};
const validatePassword = (content) => {
  return validator.isStrongPassword(content);
};

//middlewares
const validateData = (req, resp, next) => {
  try {
      console.log(req.body)
    //check if necessary keys are present
    if (!req.body || JSON.stringify(req.body) == "{}") {
      throw new Error("no body was given in user information");
    }
    let temp = new User(req.body);
    console.log(temp)
    if (!req.body.email) {
      throw new Error("No email found");
    }
    if (!req.body.mobilePrimary) {
      throw new Error("No primary mobile found");
    }
    if (!req.body.password) {
      throw new Error("No password found");
    }
    //validate given emails
    if (!validateEmail(req.body.email)) {
      throw new Error("Not a valid primary email address");
    }
    if (req.body.alternateEmail && !validateEmail(req.body.alternateEmail)) {
      throw new Error("Not a valid secondary email address");
    }
    //validate given phone numbers
    if (!validateMobile(req.body.mobilePrimary)) {
      throw new Error("Not a valid primary mobile number");
    }
    if (req.body.mobileSecondary && !validateEmail(req.body.mobileSecondary)) {
      throw new Error("Not a valid secondary mobile number");
    }
    //validate password
    if (!validatePassword(req.body.password)) {
        let errString=`Got a weak or invalid Password.Criteria for acceptable password are
            1. minimum length  - 8
            2. least lowercase - 1
            3. least uppercase - 1
            4. least symbols   - 1
        `;
      throw new Error(errString);
    }
    next();
  } catch (err) {
    console.log(err);
    resp.status(400).send(err.toString());
  }
};

module.exports = {
  validateData,
};
