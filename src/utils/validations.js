const validator = require("validator");

const validateSignUpDetails = (req) => {
  const { firstName, email, password, age, gender } = req.body;
  const errors = [];

  if (!firstName || typeof firstName !== "string" || firstName.trim() === "") {
    errors.push("Name is required and must not be empty.");
  }

  if (!email || typeof email !== "string" || !validator.isEmail(email)) {
    errors.push("Email is required and must be a valid email address.");
  }
  if (
    !password ||
    validator.isStrongPassword(password, { minLength: 6 }) === false
  ) {
    errors.push("Password is required and must be at least 6 characters long.");
  }
  if (errors.length > 0) {
    throw new Error(errors.join(" "));
  }
};
const validateProfileEditDetails = (req, res) => {
  const ALLOWED_FILEDS_TO_BE_UPDATE = [
    "firstName",
    "lastName",
    "age",
    "gender",
    "profilePicture",
    "bio",
    "skills",
    "location",
  ];
  const updatedData = req.body;
  Object.keys(updatedData).forEach((update) => {
    if (!ALLOWED_FILEDS_TO_BE_UPDATE.includes(update)) {
      throw new Error(`Invalid update field: ${update} field is not allowed to be updated`);
    }
  });
  if (updatedData["age"] && updatedData["age"] < 18) {
    throw new Error("Age must be at least 18");
  }
  if (updatedData["skills"]?.length > 10) {
    throw new Error("Skills must be less than 10");
  }
};
module.exports = {
  validateSignUpDetails,
  validateProfileEditDetails,
};
