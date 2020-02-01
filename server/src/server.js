require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const server = express();
server.use(express.static(path.join(__dirname, '../public')));
if (process.env.NODE_ENV !== 'production') {
 server.use(cors());
}
// API CALLS SIMPLE EXAMPLE
server.get('/api/basic-string', (req, res) => {
 res.send('Lorem ipsum dolor sit amet');
});
// SERVES THE VUE APP IF NO MATCH WITH THE API ROUTES
// NOTE: 404 IS HANDLED BY THE VUE APP
server.route('/*').get((req, res) => res.sendFile(path.join(__dirname,
'../public/index.html')));
server.listen(process.env.PORT || 3000);
