const SpotifyWebApi = require('spotify-web-api-node');
const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');
require("dotenv").config();

app.use(express.static('public'));
app.use(expressLayouts);
app.set('layout', 'layouts/main-layout');
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// Paste your credentials here
var clientId = process.env.clientId,
  clientSecret = process.env.clientSecret,
  accessToken = '';

var spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret
});

spotifyApi.clientCredentialsGrant()
  .then(function(data) {
    spotifyApi.setAccessToken(data.body['access_token']);
  }, function(err) {
    console.log('Something went wrong when retrieving an access token', err);
  });

app.get('/', (req, res, next) => {
  res.render('home');
});

app.get('/artists', (req, res, next) => {
  spotifyApi.searchArtists(req.query.artist)
    .then(function(data) {
      res.render('artists', {
        artists: data.body.artists.items
      });
    }, function(err) {
      console.log('Something went wrong!', err);
    });
});

app.get('/albums/:artistId', (req, res, next) => {
  spotifyApi.getArtistAlbums(req.params.artistId)
    .then(function(data) {
      res.render('albums', {
        albums: data.body.items
      });
    }, function(err) {
      console.log('Something went wrong!', err);
    });
});

app.get('/tracks/:albumId', (req, res, next) => {
  spotifyApi.getAlbumTracks(req.params.albumId)
    .then(function(data) {
      res.render('tracks', {
        tracks: data.body.items
      });
    }, function(err) {
      console.log('Something went wrong!', err);
    });
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
