// Created a controller to handle creating and getting artist information
const Artist = require('../models/Artist');

// Add a new handle POST which creates an artist\'s profile (endpoint)
exports.post = (req, res) => {
  const artist = new Artist({ name: req.body.name, genre: req.body.genre });
  artist.save((err, artistCreated) => {
    res.json(artistCreated);
  });
};

/* Add a new handler called list to find a list of all the artists
 Mongoose will return all documents within the Artist collection upon executing the find query */
exports.list = (req, res) => {
  Artist.find({}, (err, artists) => {
    if (err) {
      res.json('Something went wrong');
    }
    res.json(artists);
  });
};

// Allow users to query specific Artist information e.g. Matching Artist ID value
exports.get = (req, res) => {
  Artist.findById(req.params.artistId, (err, artist) => {
    if (err) {
      res.json('Something went wrong');
    }
    res.json(artist);
  });
};

// Allow users to add to the database
exports.put = (req, res) => {
  Promise.resolve().then(() => {
    res.json('not implemented yet');
  });
};

// Add an export deleteArtist handler, a stub implementation for it which is not functional
exports.deleteArtist = (req, res) => {
  Promise.resolve().then(() => {
    res.json('not implemented yet');
  });
};
