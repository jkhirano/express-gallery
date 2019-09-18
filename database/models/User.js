const bookshelf = require("../bookshelf");

class User extends bookshelf.Model {
  get tableName() {
    return "users";
  }

  get hasTimestamps() {
    return true;
  }
}

module.exports = bookshelf.model("User", User);

// Model = class
// model = method

// if you have many to many tables, you'd need to define how that works in this file
