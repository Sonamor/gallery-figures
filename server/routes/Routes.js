const express = require('express');

const app = express.Router();
const repository = require('../repositories/PictureRepository');

// get all picture items in the db
app.get('/', (req, res) => {
  repository.findAll().then((pictures) => {
    res.json(pictures);
  }).catch((error) => console.log(error));
});

// add a picture item
app.post('/', (req, res) => {
  const { id } = req.body;
  const { title } = req.body;
  const { filename } = req.body;
  const { information } = req.body;
  const { creation_date } = req.body;
  repository.create(id, title, filename, information, creation_date).then((picture) => {
    res.json(picture);
  }).catch((error) => console.log(error));
});

// delete a picture item
app.delete('/:id', (req, res) => {
  const { id } = req.params;
  repository.deleteById(id).then((ok) => {
    console.log(`Deleted record with id: ${id}`);
    res.status(200).json([]);
  }).catch((error) => console.log(error));
});

// update a picture item
app.put('/:id', (req, res) => {
  const { id } = req.params;
  const picture = { name: req.body.name, done: req.body.done };
  repository.updateById(id, picture)
    .then(res.status(200).json([]))
    .catch((error) => console.log(error));
});
module.exports = app;
