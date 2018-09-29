const mongoose = require('mongoose');
const path = require('path');
const httpMocks = require('node-mocks-http');
const events = require('events');
const { put } = require('../../controllers/Artist');
const Artist = require('../../models/Artist');

// Connect to mLab
require('dotenv').config({
  path: path.join(__dirname, '../../settings.env'),
});

describe('PUT Artist endpoint', () => {
// establish a connection to database before all test cases run
  beforeAll((done) => {
    mongoose.connect(process.env.TEST_DATABASE_CONN, done);
  });
  it('Should update an artist record when PUT endpoint is called', (done) => {
  //  Create an Artist record which will be updated.
    const artist = new Artist({ name: 'Ludovico Einaudi', genre: 'Contemporary Classical' });
    artist.save((err, artistCreated) => {
      // Display error if a new artist is not created
      if (err) {
        console.log(err, 'Something went wrong');
      }
      // Create request and response Mocks to update artist genre from Rock to Classical Music.
      const request = httpMocks.createRequest({
        method: 'PUT',
        URL: '/Artist/1234',
        params: {
          artistId: artistCreated._id, // eslint-disable-line

        },
        body: {
          name: 'Ludovico Einaudi',
          genre: 'Contemporary Classical',
        },
      });

      const response = httpMocks.createResponse({
        eventEmitter: events.EventEmitter,
      });
      /* Call the put handler with the mock request and make assertions
      against the response expect to see the same artist record but with the updated genre. */
      put(request, response);

      response.on('end', () => {
        const updatedArtist = JSON.parse(response._getData()); //eslint-disable-line
        expect(updatedArtist).toEqual({
          __v: 0, 
          _id: artistCreated._id.toString(), // eslint-disable-line
          name: 'Ludovico Einaudi',
          genre: 'Classical Contemporary',
        });
        done();
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
