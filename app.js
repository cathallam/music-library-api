const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
// const ArtistModel = require('../models/Artist');
// const ArtistController = require('../Artistcontrollers/Artist');
const Artist = require('./models/Artist');
const ArtistController = require('./controllers/Artist');
const AlbumController = require('./controllers/Album');


require('dotenv').config({
  path: path.join(__dirname, './settings.env'),
});

// Connect app to Express and Mongoose
const app = express();
mongoose.connect(process.env.DATABASE_CONN, { useNewUrlParser: true });

app.use(bodyParser.json());

// Lists of routes
app.get('/', (req, res) => res.send('Hello MongoDb!'));
app.get('/Artist', ArtistController.list);
app.get('/Artist/:artistId', ArtistController.get);
app.post('/Artist', ArtistController.post);
app.delete('/Artist/:artistId', ArtistController.deleteArtist);
app.post('/Artist/:artistId/album', AlbumController.postAlbum);

app.listen(3000, () => console.log('Music Library working'));
