const Artist = require('../models/Artist');
const Album = require('../models/Album');

// Add a new handle POST which creates an artist\'s album (endpoint)
exports.postAlbum = (req, res) => {
  Artist.findById(req.params.artistId, (err, artist) => {
    if (err) {
      res.json('Artist does not exist');
    }
    // Create a new album
    const myAlbum = new Album({
      artist,
      name: req.body.name,
      year: req.body.year,
    });
    // Save & create the album. Generate an error if not found
    myAlbum.save((createErr, createdAlbum) => {
      if (createErr) {
        res.json('Could not create an album');
      }

      res.json(createdAlbum);
    });
  });
};
// Populate the Album collection with a new record that references the Artist
exports.getAlbums = (req, res) => {
  Album.find({ artist: req.params.artistId }).populate('artist').exec((err, albums) => {
    if (err) {
      res.json('Unable to retrieve albums');
    }

    res.json(albums);
  });
};
