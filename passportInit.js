var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
// load the auth variables

module.exports = function(passport) {

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        console.log("in serialize",user)
        done(null, user);
    });

    // used to deserialize the user
    passport.deserializeUser(function(user, done) {
        console.log("in deserialize",user)
        done(null, user);
    });

    // code for login (use('local-login', new LocalStategy))
    // code for signup (use('local-signup', new LocalStategy))
    // code for facebook (use('facebook', new FacebookStrategy))
    // code for twitter (use('twitter', new TwitterStrategy))

    // =========================================================================
    // GOOGLE ==================================================================
    // =========================================================================
    passport.use(new GoogleStrategy({
        clientID        : process.env.CLIENT_ID,
        clientSecret    : process.env.CLIENT_SECRET,
        callbackURL     : process.env.HOST+'/auth/google/callback',
    },
    (token, refreshToken, profile, done)=>{
        // make the code asynchronous
        // User.findOne won't fire until we have all our data back from Google
        process.nextTick(function() {
            console.log(profile)
            done(null,profile.emails);
        });
    }));

};
