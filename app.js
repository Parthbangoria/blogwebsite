 //jshint esversion:6 
 require("dotenv").config(); 
const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bodyparser = require("body-parser");
const lodash = require("lodash");

// authentication     
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
// const findOrCreate = require("mongoose-findorcreate");
const FacebookStrategy = require("passport-facebook");



const app= express();
app.use(bodyparser.urlencoded({extended:true}));
app.set('view engine','ejs');
app.use(express.static("public"));


app.use(session({
  secret: "this is our little secret",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

// mongoose.set('strictQuery', true);
// mongoose.connect('mongodb://localhost:27017/userDB');

mongoose.set('strictQuery', true);
mongoose.connect('mongodb://localhost:27017/projectdb');




const userschema =new mongoose.Schema({
  googleID:String,
  facebookID: String,
  // topic :String, 
  // heading : String,
  // text : String
});


const blogSchema= {
  username:String,
  topic :String, 
  heading : String,
  text : String
};

// module pluginns   
userschema.plugin(passportLocalMongoose);



// user model     

const User = new mongoose.model("user",userschema);

const Blog = new mongoose.model("blog",blogSchema);

// creating strategies     

passport.use(User.createStrategy());


// serializing and deserializing sessios



passport.serializeUser(function(user, cb) {
    process.nextTick(function() {
      return cb(null, {
        id: user.id,
        username: user.username,
        picture: user.picture
      });
    });
  });
passport.deserializeUser(function(user, cb) {
    process.nextTick(function() {
      return cb(null, user);
    });
  });


// initializing strategies

passport.use(new GoogleStrategy({
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  callbackURL: "http://localhost:3000/auth/google/secrets",
  userProfileURL:"https://www.googleapis.com/oauth2/v3/userinfo"
},
 async function (accessToken, refreshToken, profile, done) {
  try {
    console.log(profile);
    // Find or create user in your database
    let user = await User.findOne({ googleId: profile.id });
    if (!user) {
      // Create new user in database
      const username = Array.isArray(profile.emails) && profile.emails.length > 0 ? profile.emails[0].value.split('@')[0] : '';
      const newUser = new User({
        username: profile.displayName,
        googleId: profile.id
      });
      user = await newUser.save();
    }
    return done(null, user);
  } catch (err) {
    return done(err);
  }
}
));

passport.use(new FacebookStrategy({
clientID: process.env.CLIENT_ID_FB,
clientSecret: process.env.CLIENT_SECRET_FB,
callbackURL: "http://localhost:3000/auth/facebook/callback"
},
async function(accessToken, refreshToken, profile, done) {
  try {
    console.log(profile);
    // Find or create user in your database
    let user = await User.findOne({
      facebookId: profile.id
    });
    if (!user) {
      // Create new user in database
      const newUser = new User({
        username: profile.displayName,
        facebookId: profile.id
      });
      user = await newUser.save();
    }
    return done(null, user);
  } catch (err) {
    return done(err);
  }
}
));


app.get("/auth/google",
passport.authenticate("google", { scope :["profile"] }));  

app.get("/auth/google/secrets", 
  passport.authenticate("google", { failureRedirect: "/register" }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect("/");
  });

// app.get("/",function(req,res){
//     res.render("home");
// });
app.get("/login",function(req,res){
    res.render("login");
}); 
 
// app.get("/register",function(req,res){
//     res.render("register");
// });

// app.get("/secrets",function(req,res){
//    User.find({"secret":{$ne:null}})
//    .then(docs =>{
   
//       if(docs){
//         res.render("secrets",{userWithSecrets: docs});
//       }
//     else{
//       res.redirect("/register");
//     }
//     }
    
//      );
// });

app.get("/logout",function(req,res){
 req.logOut(function(err){
    if(err){
        console.log(err);
    }
    else{
        res.redirect("/");
    }
 });
 });

app.get('/auth/facebook', passport.authenticate('facebook'));

app.get('/auth/facebook/callback', passport.authenticate('facebook', {
  failureRedirect: '/login'
}), function(req, res) {
  res.redirect('/');
});







app.get("/",function(req,res){

  // console.log(req.user);

    // Blog.find({})
    // .then(function(docs){
    //   if(docs){
        res.render("home");
      // }
      // else{
      //   console.log("there is an error");
      // }
    // });

  
});

app.get("/posts",function(req,res){
  res.render("posts");
});


app.get("/posts/:topic",function(req,res){
  // res.render("posts");
   let passedtopic = lodash.lowerCase(req.params.topic);

  Blog.find({})
  .then(function(docs){

    docs.forEach(function(post){
     let currenttopic = lodash.lowerCase(post.heading);
     if(currenttopic===passedtopic){
      console.log("match found");
      res.render("posts",{foundpost:post,user:req.isAuthenticated()});
     }
    });
    
  });
 
});



app.get("/compose",function(req,res){
   res.render("compose");
});

app.post("/compose",function(req,res){
    let post = new Blog({ 
   username: req.user.id,
   topic : req.body.topic,
   heading : req.body.blogheading,
   text : req.body.blogtext
  });
  post.save();
  // posts.push(post);

  res.redirect("/");
});


app.listen(3000,function(){
    console.log("server has been started on port 3000");

});





  
  // res.render("posts");
