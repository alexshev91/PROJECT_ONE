var bcrypt = require("bcrypt");
var passport = require("passport");
var passportLocal = require("passport-local");
var salt = bcrypt.genSaltSync(10);

module.exports = function (sequelize, DataTypes){
   var User = sequelize.define('user', {
     username: { 
        type: DataTypes.STRING, 
        unique: true, 
        validate: {
          len: [4, 30],
          }
    },
    password: {
        type:DataTypes.STRING,
        validate: {
          notEmpty: true
        }
      }
    },
    
    {
      classMethods: {
        associate: function (db){
          User.hasMany(db.hashtag);
        },
        encryptPassword: function (pswrd) {
          // Add a salt to obfuscate the raw pswrd
          var hash = bcrypt.hashSync(pswrd, salt);
          return hash;
        },
        comparePass: function(userpass, dbpass) {
      // don't salt twice when you compare....watch out for this
        return bcrypt.compareSync((userpass), dbpass);
        },
        createNewUser: function (newUser, err, success) {
          if (newUser.password.length < 6){
            err(new Error("PASSWORD TOO-SHORT"));
          } else {
            newUser.password = this.encryptPassword(newUser.password);
            User.create(newUser)
            .failure(function (error){
              console.error(error);

              if( error.username ) {
                err(new Error("We didn't want to say your username was too short, but yeah..."));
              } else {
                err(new Error("My reply is no... concentrate and ask again..."));
              }
            })
            .ok(function (user){
              success(user, {message: "Welcome!!"});
            });
          }
        },
      }
    } //close classMethods outer 

  ); // close define user

passport.use(new passportLocal.Strategy({
      usernameField: 'username',
      passwordField: 'password',
      passReqToCallback : true
    },

    function(req, username, password, done) {
      // find a user in the DB
      User.find({
          where: {
            username: username
          }
        })
        // when that's done, 
        .done(function(error,user){
          if(error){
            console.log(error);
            return done (err, req.flash('loginMessage', 'Oops! Something went wrong.'));
          }
          if (user === null){
            return done (null, false, req.flash('loginMessage', 'Username does not exist.'));
          }
          if ((User.comparePass(password, user.password)) !== true){
            return done (null, false, req.flash('loginMessage', 'Invalid Password'));
          }
          done(null, user); 
        });
    }));
  return User;
}; // close User function