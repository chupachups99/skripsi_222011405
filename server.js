const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require('body-parser');
const csvToJson = require('convert-csv-to-json');
const usersRoutes = require('./router/users');
 const indexRoutes = require('./router/indikator');
 const brsRoutes = require('./router/brs');
const session = require('express-session');
var GoogleStrategy = require('passport-google-oauth2').Strategy;
const passport = require('passport');
const model = require('./models/users');
const { isNull } = require("util");
const dbPool = require('./config/db');
const LocalStrategy = require('passport-local').Strategy;
// var user=[];

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/users', usersRoutes);
app.use('/indicator', indexRoutes);
app.use('/brs', brsRoutes);
app.use(session({ secret: 'secret', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use('/assets', express.static('assets'));


function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) { next(); }
};




passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (user, cb) {
  cb(null, user);
});

passport.use(new GoogleStrategy({
  clientID: '872585684257-dnlrrito1rtvdiofu41c745lsfuvv863.apps.googleusercontent.com',
  clientSecret: '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',
  callbackURL: "http://localhost:4000/google/callback",
  scope: ['email', 'profile'],
  passReqToCallback: true
},
  function (request, accessToken, refreshToken, profile, done) {
    return done(null, profile);
  }
));
// authUser = (user, password, done) => {
//   //Search the user, password in the DB to authenticate the user
//   //Let's assume that a search within your DB returned the username and password match for "Kyle".
//   let authenticated_user = { id: 123, name: "Kyle" }
//   return done(null, authenticated_user)
// }
checkAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) { return next() }
  res.redirect("/login")
}




passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
},async function(username, password, cb) {
  let temp = {email:username,password:password};
  const response = await model.ifUser(temp);
  console.log(response);
  if(response[0].length>0){
    cb(null,response[0]);
  }
  else{
    cb(null,null);
  }
}
));


app.get('/google',
  passport.authenticate('google', {
    scope:
      ['email', 'profile']
  }
  ));

app.get('/signout', (req, res) => {
  req.logout();
  req.session.destroy();
  res.send('Goodbye!');
});

app.get('/logout', (req, res) => {
  req.session.destroy();
  res.send('Goodbye!');
});



app.get('/google/callback',
  passport.authenticate('google', {
    successRedirect: '/index',
    failureRedirect: '/login'
  }));

app.post('/auth_user',
  passport.authenticate('local', {
    successRedirect: '/index',
    failureRedirect: '/fail'
  }));

app.get('/fail', (req, res) => {
  res.send('Gagal');
})


app.get('/index', checkAuthenticated, (req, res) => {
  res.render('index');
  //res.send(req.user.name);
});
// app.get('/index', (req, res) => {
//   res.render('index');
//   //res.send(req.user.name);
// });
app.get('/link_brs',checkAuthenticated, (req, res) => {
  res.render('brs');
  //res.send(req.user.name);
});

app.get('/dataAsal', (req, res) => {
  let json = csvToJson.getJsonFromCsv('./assets/Prov_Asal.csv');
  var result = [];
  json.reduce(function (ret, nilai) {
    if (!ret[nilai.name]) {
      ret[nilai.name] = { name: nilai.name, value: 0 };
      result.push(ret[nilai.name])
    }
    ret[nilai.name].value += parseInt(nilai.value);
    return ret;
  }, {});
  res.send(result)
});



app.get('/dataTujuan', (req, res) => {
  let json = csvToJson.getJsonFromCsv('./assets/Prov_Tujuan.csv');
  var result = [];
  json.reduce(function (ret, nilai) {
    if (!ret[nilai.name]) {
      ret[nilai.name] = { name: nilai.name, value: 0 };
      result.push(ret[nilai.name])
    }
    ret[nilai.name].value += parseInt(nilai.value);
    return ret;
  }, {});
  res.send(result)
});

app.get("/", (req, res) => {
  res.render('login')
});

app.get("/login", (req, res) => {
  res.render('login')
});
app.get("/signup", (req, res) => {
  res.render('signup')
});

app.listen(4000, () => {
  console.log('Running on port 4000');
})