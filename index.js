const express = require("express");
const Amadeus = require("amadeus");
// const db = require("./connections/db");
const session = require('express-session');
const passport = require('passport'); // Moved up
const LocalStrategy = require('passport-local').Strategy;
const crypt = require('bcrypt');
const model = require('./models/pass'); 

const app = express();
const api = require("./routes/api");
const auth = require("./routes/login");

app.use(session({ secret: 'your_secret_key', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static("public"));

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },
  async (email, password, done) => {
    try {
      const user = await model.findOne({ email: email });
      if (!user) {
        return done(null, false, { message: 'Incorrect email.' });
      }
      const isValid = await crypt.compare(password, user.password);
      if (!isValid) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    } catch (e) {
      return done(e);
    }
  }
));

// Serialize user
passport.serializeUser((user, done) => {
  done(null, {id: user.id, email: user.email});
});

// Deserialize user
passport.deserializeUser(async (obj, done) => {
  try {
    const user = await model.findById(obj.id);
    if(user){
        user.email = obj.email;
        done(null,user);
    }
    else{
        done(new Error("User not found"),null);
    }
  } catch (e) {
    done(e, null);
  }
});


app.use("/api", api);
app.use("/auth",auth);

app.get("/*",(req,res)=>{
    res.status(404).json({message:"Page not found"});
});
app.post("/*",(req,res)=>{
    res.status(404).json({message:"Page not found"});
});
app.listen(4000,()=>{
    console.log("Server started at port 4000");
})