const express = require("express");
const bodyParser = require("body-parser");
const decorator = require("./database/decorator");
const exphbs = require("express-handlebars");
const methodOverride = require("method-override");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const bcrypt = require("bcryptjs");
const redis = require("redis");
const RedisStore = require("connect-redis")(session);
const galleryRoutes = require("./routes/gallery");

const PORT = 8080;
const saltRounds = 12;
const User = require("./database/models/User");
const Photo = require("./database/models/Photo");

require("dotenv").config();

const client = redis.createClient({ url: process.env.REDIS_URL });
const app = express();
app.use(express.static("./public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(decorator);
app.use(
  session({
    store: new RedisStore({ client }),
    secret: process.env.REDIS_SECRET,
    resave: false,
    saveUninitialized: false
  })
);

app.use(passport.initialize());
app.use(passport.session());

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    return res.redirect("/login.html");
  }
}

app.engine(
  ".hbs",
  exphbs({
    extname: ".hbs",
    defaultLayout: "main.hbs"
  })
);
app.set("views", __dirname + "/views");
app.set("view engine", ".hbs");

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
            if (res) {
              return done(null, user);
            } else {
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

passport.serializeUser(function(user, done) {
  console.log("serializing");

  return done(null, { id: user.id, username: user.username });
});

passport.deserializeUser(function(user, done) {
  console.log("deserializing");
  console.log(user);
  return done(null, user);
});

app.use(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/secret",
    failureRedirect: "/login.html"
  })
);

app.post("/register", (req, res) => {
  bcrypt.genSalt(saltRounds, (err, salt) => {
    if (err) {
      console.log(err);
    }

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

app.get("/secret", isAuthenticated, (req, res) => {
  return res.send("You found the secret!");
});

app.get("/logout", (req, res) => {
  req.logout();
  res.send("logged out");
});

app.listen(PORT, () => {
  console.log(`Server started on PORT: ${PORT}`);
});
