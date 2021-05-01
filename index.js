const bodyParser = require('body-parser');
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const Models = require('./models.js');
const { response } = require('express');
const app = express();
const cors = require('cors');
const passport = require('passport');
  require('./passport');
const auth = require('./auth')(app);
const { check, validationResult } = require('express-validator');
const uuid = require('uuid');

app.use(bodyParser.json());
app.use(express.static('public'));
app.use(morgan('common'));

let allowedOrigins = ['http://localhost:8080'];
app.use(cors({
  origin: (origin, callback) => {
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){
      let message = 'The CORS policy for this application doesn\'t allow access from origin'
        + origin;
      return callback(new Error(message ), false);
    }
    return callback(null, true);
  }
}));

const Movies = Models.Movie;
const Users = Models.User;
const Genres = Models.Genre
const Directors = Models.Director

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

mongoose.connect( process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true });

//mongoose.connect("mongodb://localhost:27017/movies", 
//{ useNewUrlParser: true, useUnifiedTopology: true });


// GET requests
app.get('/', (req, res) => {
  res.send('My top movies');
});

app.get('/documentation', (req, res) => {
  res.sendFile('public/documentation.html', {root:__dirname});
});

//get all movies
app.get('/movies', passport.authenticate('jwt', {session: false}), (req, res) => {
  Movies.find()
    .then((movies) => {
      res.status(201).json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err)
    })
});

//get specific movie by title
app.get('/movies/:Title', passport.authenticate('jwt', {session: false}), (req, res) => {
  Movies.findOne({ Title: req.params.Title })
    .then((movie) => {
      res.json(movie);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + err);
  })
});

//get all genres
app.get('/genres', passport.authenticate('jwt', {session: false}), (req, res) => {
  Genres.find()
  .then((genres) => {
    res.status(201).json(genres);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err)
  })
});

//add a genre
app.post('/genres', passport.authenticate('jwt', {session: false}), (req, res) => {
  Genres.findOne({ Name: req.body.Name })
    .then((genre) => {
      if (genre) {
        return res.status(400).send(req.body.Name + 'already exists');
      } else {
        Genres
          .create({
            Name: req.body.Name,
            Description: req.body.Description,
          })
          .then((genre) =>{res.status(201).json(genre) })
        .catch((error) => {
          console.error(error);
          res.status(500).send('Error: ' + err);
        })
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + err);
    });
});

//get a specific genre
app.get('/genres/:Name', passport.authenticate('jwt', {session: false}), (req, res)  => {
  Genres.findOne({ Name: req.params.Name })
    .then((genre) => {
      res.json(genre);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err)
    })
});

//get a specific directors info
app.get('/directors/:Name', passport.authenticate('jwt', {session: false}), (req, res) => {
    Directors.findOne({ Name: req.params.Name })
      .then((director) => {
        res.json(director);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err)
      })
  });

//add a Director
app.post('/directors', passport.authenticate('jwt', {session: false}), (req, res) => {
  Directors.findOne({ Name: req.body.Name })
    .then((director) => {
      if (director) {
        return res.status(400).send(req.body.Name + 'already exists');
      } else {
        Directors
          .create({
            Name: req.body.Name,
            Bio: req.body.Bio,
            Birth: req.body.Birth,
            Death: req.body.Death
          })
          .then((director) => {res.status(201).json(director) })
        .catch((error) => {
          console.error(error);
          res.status(500).send('Error: ' + err);
        })
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + err);
    });
});

//get all users
app.get('/users', passport.authenticate('jwt', {session: false}), (req, res) => {
  Users.find()
    .then((users) => {
      res.status(201).json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    })
});

//get a specific user
app.get('/users/:Username', passport.authenticate('jwt', {session: false}), (req, res) => {
  Users.findOne({ Username: req.params.Username })
    .then((user) => {
      res.status(201).json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    })
});

//Add a user
app.post('/users',
  // Validation logic here for request
  //you can either use a chain of methods like .not().isEmpty()
  //which means "opposite of isEmpty" in plain english "is not empty"
  //or use .isLength({min: 5}) which means
  //minimum value of 5 characters are only allowed
  [
    check('Username', 'Username is required').isLength({min: 5}),
    check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
    check('Email', 'Email does not appear to be valid').isEmail()
  ], (req, res) => {

  // check the validation object for errors
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    let hashedPassword = Users.hashPassword(req.body.Password);
    Users.findOne({ Username: req.body.Username }) // Search to see if a user with the requested username already exists
      .then((user) => {
        if (user) {
          //If the user is found, send a response that it already exists
          return res.status(400).send(req.body.Username + ' already exists');
        } else {
          Users
            .create({
              Username: req.body.Username,
              Password: hashedPassword,
              Email: req.body.Email,
              Birthday: req.body.Birthday
            })
            .then((user) => { res.status(201).json(user) })
            .catch((error) => {
              console.error(error);
              res.status(500).send('Error: ' + error);
            });
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send('Error: ' + error);
      });
  });

//Update a user's info, by username
app.put('/users/:Username', passport.authenticate('jwt', {session: false}), (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username },
{ $set:
    {
      Username: req.body.Username,
      Password: req.body.Password,
      Email: req.body.Email,
      Birthday: req.body.Birthday
    }
  },
  { new: true }, 
  (err, updatedUser) => {
    if(err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
});

app.put('/users/:Username/movies/:Title', passport.authenticate('jwt', {session: false}), (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username },
  {
    $push: { FavoriteMovies: req.params.Title }
  },
  { new: true },
  (err, updatedUser) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
});

app.delete('/users/:Username/movies/:Title', passport.authenticate('jwt', {session: false}), (req, res) => {
  Movies.findOneAndRemove({ Title: req.params.Title})
    .then((movie) => {
      if (!movie) {
        res.status(400).send(req.params.Title + ' was not found.');
      } else {
        res.status(200).send(req.params.Title + ' was deleted.');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
  });
});

app.post('/movies', passport.authenticate('jwt', {session: false}), (req, res) => {
  Movies.findOne({ Title: req.body.Title })
    .then((movie) => {
      if (movie) {
        return res.status(400).send(req.body.Title + 'record already exists');
      } else {
        Movies
          .create({
            Title: req.body.Title,
            Description: req.body.Description,
            Genre: req.body.Genre,
            Director: req.body.Director
          })
          .then((movie) => {res.status(201).json(movie) })
        .catch((error) => {
          console.error(error);
          res.status(500).send('Error: ' + err);
        })
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + err);
    });
});

//delete movie by 
app.delete('/movies/:movieTitle', passport.authenticate('jwt', {session: false}), (req, res) => {
  Movies.findOneAndRemove({ Title: req.params.Title})
    .then((movie) => {
      if (!movie) {
        res.status(400).send(req.params.Title + ' was not found.');
      } else {
        res.status(200).send(req.params.Title + ' was deleted.');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
})

//Delete a user by username
app.delete('/users/:Username', passport.authenticate('jwt', {session: false}), (req, res) => {
  Users.findOneAndRemove({ Username: req.params.Username })
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.Username + ' was not found.');
      } else {
        res.status(200).send(req.params.Username + ' was deleted.');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0',() => {
 console.log('Listening on Port ' + port);
});

