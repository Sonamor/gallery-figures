const mongoose = require('mongoose');

const { Schema } = mongoose;

// Define schema for picture items
const pictureSchema = new Schema({
  // Custom id of the picture. Custom increment
  id: {
    type: Number,
  },
  // Title of the picture
  title: {
    type: String,
  },
  // Filename of the picture
  filename: {
    type: String,
  },
  // Text accompanying the picture
  information: {
    type: String,
  },
  // Creation date of the post
  creation_date: {
    type: Date,
  },
  // Importance of the picture, will define the size of the picture within the gallery grid
  size: {
    type: String,
  },
  // Sets up the visibility of the post
  active: {
    type: Boolean,
  }
});

const Picture = mongoose.model('Picture', pictureSchema);

module.exports = Picture;
