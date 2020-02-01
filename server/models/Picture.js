const mongoose = require('mongoose');

const { Schema } = mongoose;

// Define schema for picture items
const pictureSchema = new Schema({
  id: {
    type: Number,
  },
  title: {
    type: String,
  },
  filename: {
    type: String,
  },
  information: {
    type: String,
  },
  creation_date: {
    type: Date,
  }
});

const Picture = mongoose.model('Picture', pictureSchema);

module.exports = Picture;
