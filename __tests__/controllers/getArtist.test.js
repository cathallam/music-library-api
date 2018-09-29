const mongoose = require('mongoose');
const path = require('path');
const httpMocks = require('node-mocks-http');
const events = require('events');
const { get } = require('../../controllers/Artist');
const Artist = require('../../models/Artist');

require('dotenv').config({
  path: path.join(__dirname, '../../settings.env'),
});

describe('Artist GET Endpoint', () => {
  beforeAll((done) => {
    mongoose.connect(
      process.env.TEST_DATABASE_CONN,
      { useNewUrlParser: true },
      done,
    );
  });

  it('should retrieve an Artist from the database', (done) => {
    const artist = new Artist({ name: 'Tame Impala', genre: 'Rock' });
    artist.save((err, artistCreated) => {
      const request = httpMocks.createRequest({
        method: 'GET',
        url: '/Artist/1234',
        params: {
          artistId: artistCreated._id, //eslint-disable-line
        },
      });
      /* it('should get the list of multiple artists', (done) => {
        expect.assertions(2);
        const artists = [
          { name: 'Ludwig Beethoven', genre: 'Classical' },
          { name: 'Avicii', genre: 'Electronic dance' },
          { name: 'Aretha Franklin', genre: 'Soul' },
        ];
        Artist.create(artists, (err) => {
          if (err) {
            console.log(err, 'something went wrong');
          }
        }); */
      const response = httpMocks.createResponse({
        eventEmitter: events.EventEmitter,
      });

      get(request, response);

      response.on('end', () => {
        const artistFound = JSON.parse(response._getData()); //eslint-disable-line
        expect(artistFound.name).toBe('Tame Impala');
        expect(artistFound.genre).toBe('Rock');
        done();
      });
    });
  });

  afterEach((done) => {
    Artist.collection.drop((e) => {
      if (e) {
        console.log(e);
      }
      done();
    });
  });
  afterAll(() => {
    mongoose.connection.close();
  });
});
