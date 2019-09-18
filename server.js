const express = require("express");
const bodyParser = require("body-parser");
const decorator = require("./database/decorator");
const session = require("express-session"); // handles the session part of encryption, takes care of adding, checking and creating the table (key value pair)
const passport = require("passport"); // authentication framework - checks for user and responds with cookie
const LocalStrategy = require("passport-local");
const bcrypt = require("bcryptjs");
const redis = require("redis");
const RedisStore = require("connect-redis")(session);

const PORT = 8080;
const saltRounds = 12; // hash 12 x in a row
const User = require("./database/models/User");

require("dotenv").config();

const client = redis.createClient({ url: process.env.REDIS_URL });
const app = express();
app.use(express.static("./public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(decorator);
app.use(
  //session uses this as middleware
  session({
    store: new RedisStore({ client }),
    secret: process.env.REDIS_SECRET,
    resave: false,
    saveUninitialized: false
  })
);

// need these two - 1st starts up passport
// sets up middleware for you
app.use(passport.initialize());
// needs to come after app.use(session)..
app.use(passport.session());

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    return res.redirect("/login.html");
  }
}

// LocalStrategy - how to handle authenticating the user ourselves
// creates it as a middleware so we can use in the future
passport.use(
  new LocalStrategy(function(username, password, done) {
    return new User({ username: username })
      .fetch()
      .then(user => {
        console.log(user);

        if (user === null) {
          return done(null, false, { message: "bad username or password" });
        } else {
          user = user.toJSON();

          bcrypt.compare(password, user.password).then(res => {
            // Happy route: username exists, password matches
            if (res) {
              return done(null, user); // this is the user that goes to serialize
            }
            // Error Route: Username exists, password does not match
            else {
              return done(null, false, { message: "bad username or password" });
            }
          });
        }
      })
      .catch(err => {
        console.log("error: ", err);
        return done(err);
      });
  })
);

// takes user from db, strip to bare essentials to store, create session object
// happens only when you log in
passport.serializeUser(function(user, done) {
  console.log("serializing");

  return done(null, { id: user.id, username: user.username }); // session object - only id and username required
});

// when user comes back to website with cookie, cookie - looked for matching string, grabs session object, and the user is listed here
// pulls session info and adds it to the request itself
// after you've logged in, happens each time you make a request
passport.deserializeUser(function(user, done) {
  console.log("deserializing");
  console.log(user);
  return done(null, user); // if you added items to session, req.user will have that info
});

// if any request comes in here, passport.auth..will take care of that for us
// will run LocalStrategy
// if that gives back user, redirect to secret route, if it fails, go to login page
app.use(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/secret",
    failureRedirect: "/login.html"
  })
);

// how to create user accounts
// genSalt - generates a random string for us
app.post("/register", (req, res) => {
  bcrypt.genSalt(saltRounds, (err, salt) => {
    if (err) {
      console.log(err); // shouldn't console.log, do res.send etc.
    } // return 500

    bcrypt.hash(req.body.password, salt, (err, hash) => {
      if (err) {
        console.log(err);
      } // return 500

      return new User({
        username: req.body.username,
        password: hash // stores hashed pw
      })
        .save()
        .then(user => {
          console.log(user);
          return res.redirect("/login.html");
        })
        .catch(err => {
          console.log(err);
          return res.send("Error creating account");
        });
    });
  });
});

// route that using isAuthenticated middleware - it runs the function at the top
// shouldn't be able to get to this route, unless you're logged in
app.get("/secret", isAuthenticated, (req, res) => {
  return res.send("You found the secret!");
});

// it kills session, cookie and cleans everything out for user
app.get("/logout", (req, res) => {
  req.logout();
  res.send("logged out");
});

app.listen(PORT, () => {
  console.log(`Server started on PORT: ${PORT}`);
});
