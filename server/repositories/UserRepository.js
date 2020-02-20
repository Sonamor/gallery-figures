const User = require('../models/User');

class UserRepository {

  constructor(model) {
    this.model = model;
  }

  // Find picture by the id
  findById(id) {
    return this.model.findById(id);
  }
}

module.exports = new UserRepository(User);
