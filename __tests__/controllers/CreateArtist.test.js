// Import all modules
const mongoose = require('mongoose');
const path = require('path');
const httpMocks = require('node-mocks-http');
const events = require('events');
const { post } = require('../../controllers/Artist');
const Artist = require('../../models/Artist');

// Import dotenv to connect to the test database using the connection string.
require('dotenv').config({
  path: path.join(__dirname, '../../settings.env'),
});

// Establish a connection to our database before all test cases run
describe('Artist POST Endpoint', () => {
  beforeAll((done) => {
    mongoose.connect(process.env.TEST_DATABASE_CONN, { useNewUrlParser: true }, done);
  });

  it('should create a new Artist', (done) => {
    expect.assertions(2);
    const request = httpMocks.createRequest({
      method: 'POST',
      url: '/Artist',
      body: {
        name: 'Ludovico Einaudi',
        genre: 'Classical Contemporary',
      },
    });
    const response = httpMocks.createResponse({
      eventEmitter: events.EventEmitter,
    });

    post(request, response);


    response.on('end', () => {
        const artistsFound = JSON.parse(response._getData()); //eslint-disable-line
      expect(artistsFound.name).toBe('Ludovico Einaudi');
      expect(artistsFound.genre).toBe('Classical Contemporary');
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
// Close the connection to the database
afterAll((done) => {
  mongoose.disconnect().then(() => {
    setTimeout(done, 500);
  });
});
