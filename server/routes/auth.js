const express = require("express");
const router = express.Router();
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../model/User");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async function (accessToken, refreshToken, profile, done) {
      const newUser = {
        googleId: profile.id,
        displayName: profile.displayName,
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        profileImage: profile.photos[0].value,
      };

      try {
        let user = await User.findOne({ googleId: profile.id });
        if (user) {
          done(null, user);
        } else {
          user = await User.create(newUser);
          done(null, user);
        }
      } catch (error) {
        console.log(error);
      }
    }
  )
);

// Google Login Route
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

// Retrieve user data
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login-failure",
    successRedirect: "/dashboard",
  })
);

// Route if something goes wrong
router.get('/login-failure', (req, res) => {
  res.send('Something went wrong...');
});

// Destroy user session
router.get('/logout',function(req,res){
    req.session.destroy(function(err){
        if(err){
            console.log(err);
            res.send('Error log out');
        }
        else
        {
            res.redirect("/");
        }
    })
})

// Presist user data after successful authentication
passport.serializeUser(function (user, done) {
    try{
        done(null,user.id);
    }
    catch(err)
    {
        done(err);

    }

});

// Retrieve user data from session.
// IMPORTAANT USE TRY CATCH IN EVERY AUTHENTICATION


passport.deserializeUser(function (id, done) {
  User.findById(id).then(function (user){
done(null,user);

  }).catch(function(err){
    done(err,null,{message:'user doent exist'})
  });

    
  
});




module.exports = router;