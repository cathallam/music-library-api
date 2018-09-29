// Import all modules
const mongoose = require('mongoose');
const path = require('path');
const httpMocks = require('node-mocks-http');
const events = require('events');
const { deleteArtist } = require('../../controllers/Artist');
const Artist = require('../../models/Artist');

// Connect to mLab
require('dotenv').config({
  path: path.join(__dirname, '../../settings.env'),
});

// Establish a connection to our database before all test cases run
describe('Artist DELETE Endpoint', () => {
  beforeAll((done) => {
    mongoose.connect(process.env.TEST_DATABASE_CONN, { useNewUrlParser: true }, done);
  });
  it('Should delete an artist record when DELETE endpoint is called', (done) => {
    // expect.assertions(1);

    //  Create an Artist record which will be updated.
    const artist = new Artist({
      name: 'Ludovico Einaudi',
      genre: 'Contemporary Classical Music',
    });

    artist.save((err, artistCreated) => {
      // Display error if a new artist is not created
      if (err) {
        console.log(err, 'Something went wrong');
      }

      // mock a request object
      const request = httpMocks.createRequest({
        method: 'DELETE',
        URL: '/Artist/1234',
        params: {
          artistId: artistCreated._id, // eslint-disable-line 
        },
      });

      const response = httpMocks.createResponse({
        eventEmitter: events.EventEmitter,
      });

      // mock a response object
      deleteArtist(request, response);

      /* You should assert that once delete handler is called, it should delete the Artist record from the database. */
      response.on('end', () => {
        Artist.findById(artistCreated._id, (err, noSuchArtist) => {
          expect(noSuchArtist).toBe(null);
          done();
        });
      });
    });
  });

  // Delete all the documents, Mongoose to delete(drop) a collection.

  afterEach((done) => {
    Artist.collection.drop((e) => {
      if (e) {
        console.log(e);
      }
      done();
    });
  });

  // Close connection to the database
  afterAll(() => {
    mongoose.connection.close();
  });
});
