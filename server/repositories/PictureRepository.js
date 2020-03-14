const Picture = require('../models/Picture');

class PictureRepository {

  constructor(model) {
    this.model = model;
  }

  // Create a new picture
  create(id, title, filename, information, creation_date, size, active) {
    const newPicture = { id, title, filename, information, creation_date, size, active };
    const picture = new this.model(newPicture);

    return picture.save();
  }

  getLastPicture(){
    return this.model.find().sort({id:-1}).limit(1);
  }

  countPictures(){
    return this.model.countDocuments();
  }

  // Return all pictures
  findAll() {
    return this.model.find();
  }

  // Return all pictures
  findByField(keyValue) {
    return this.model.find(keyValue);
  }

  // Find picture by the id
  findById(id) {
    return this.model.findById(id);
  }

  // Delete picture
  deleteById(id) {
    return this.model.findByIdAndDelete(id);
  }

  deleteByField(keyValue){
    return this.model.deleteOne(keyValue, function (err) {
      if (err) return handleError(err);
      // deleted at most one tank document
    });
  }

  // Update picture
  async updateById(picId, object) {

    let doc = await this.model.findOne({ id: picId });

    doc.title = object.title;
    doc.filename = object.filename;
    doc.information = object.information;
    doc.creation_date = object.creation_date;
    doc.size = object.size;
    doc.active = object.active;

    return await doc.save();
  }
}

module.exports = new PictureRepository(Picture);
