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

  // Return all pictures based on the condition
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
    return this.model.deleteOne(keyValue);
  }

  // Update picture
  async updateById(pictureId, object) {

    let doc = await this.model.findOne({ id: pictureId });

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
