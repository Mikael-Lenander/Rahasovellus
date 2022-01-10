const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

const User = require('./models/user');

module.exports = function(passport) {
  passport.use(new LocalStrategy(function(username, password, done) {
      User.findOne({username: username}, function(err, user) {
          if (err) return done(err)
          if (!user) return done(null, false, {message: 'Invalid username'})
          bcrypt.compare(password, user.password, (err, result) => {
            if (err) return console.log(err)
            if (!result) return done(null, false, {message: 'Invalid password'})
            return done(null, user)
          })
      })
  }))

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
}