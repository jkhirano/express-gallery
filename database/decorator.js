const User = require("./models/User");
const Photo = require("./models/Photo");

module.exports = function(req, res, next) {
  req.database = { User: User, Photo: Photo };
  // OR req.database = { Photo: Photo };
  next();
};
