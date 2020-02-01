const Picture = require('../models/Picture');

class PictureRepository {

  constructor(model) {
    this.model = model;
  }

  // Create a new picture
  create(id, title, filename, information, creation_date) {
    const newPicture = { id, title, filename, information, creation_date };
    const picture = new this.model(newPicture);

    return picture.save();
  }

  // Return all pictures
  findAll() {
    return this.model.find();
  }

  // Find picture by the id
  findById(id) {
    return this.model.findById(id);
  }

  // Delete picture
  deleteById(id) {
    return this.model.findByIdAndDelete(id);
  }

  // Update picture
  updateById(id, object) {
    const query = { _id: id };
    return this.model.findOneAndUpdate(query, { $set: { title: object.title, filename: object.filename, information: object.information, creation_date: object.creation_date } });
  }
}

module.exports = new PictureRepository(Picture);
