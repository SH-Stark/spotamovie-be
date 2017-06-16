process.env.NODE_ENV = 'test';

let chai = require('chai');
let chaiHttp = require('chai-http');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const server = require('../index');
let should = chai.should();
const spotifyWebApi = require('spotify-web-api-node');
const songController = require('../controllers/songController');
const Stub = require('./stub');
const mocks = require('./mocks');

chai.use(chaiHttp);
chai.use(sinonChai);

let stubGetUserPlaylists, stubGetPlaylistTracks, stubLikeSongs;

describe('Songs :', () => {
  let request, response;
  beforeEach(() => {
    request = {
      spotifyApi: new spotifyWebApi(mocks.spotifyObj)
    };
    stubGetUserPlaylists = Stub.createStub(request.spotifyApi, 'getUserPlaylists', mocks.playlists);
    stubGetPlaylistTracks = Stub.createStub(request.spotifyApi, 'getPlaylistTracks', mocks.tracks);
    stubLikeSongs = Stub.createStub(songController, 'likeSongs', null);
    response = {};
  });
  afterEach(() => {
    Stub.removeStub(stubGetUserPlaylists);
    Stub.removeStub(stubGetPlaylistTracks);
    Stub.removeStub(stubLikeSongs);
    response = {};
  });


  it('should retrieve songs from a given user\'s playlists', (done) => {
    const user = mocks.userObj;
    const access_token = mocks.accessToken;
    try {
      Promise.resolve(songController.storePlaylists(user, access_token, request))
      .then((songs) =>{
        songs.should.be.a('array');
        done();
      })
      .catch((err) => {
        done(err);
      });
    } catch (err) {
      done(err);
    }
  });


  it('should return null if user has no playlists', (done) => {
    const user = mocks.userObj;
    const access_token = mocks.accessToken;
    Stub.removeStub(stubGetUserPlaylists);
    const emptyItems = mocks.createObj('items', null);
    const emptyBody = mocks.createObj('body', emptyItems);
    stubGetUserPlaylists = Stub.createStub(request.spotifyApi, 'getUserPlaylists', emptyBody);
    try {
      Promise.resolve(songController.storePlaylists(user, access_token, request))
      .then((songs) =>{
        songs.should.be.null;
        done();
      })
      .catch((err) => {
        done(err);
      });
    } catch (err) {
      done(err);
    }
  });


});
