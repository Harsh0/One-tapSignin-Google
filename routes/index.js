const express = require('express');
const router = express.Router();
const passport = require('passport');
const GoogleAuth = require('google-auth-library');

router.get('/oauth',passport.authenticate('google', { scope : ['email'] }));

router.get('/getClientId',(req,res,next)=>{
  res.json({
    CLIENT_ID:process.env.CLIENT_ID
  });
})

router.get('/auth/google/callback',
  passport.authenticate('google', {
    successRedirect : '/',
    failureRedirect : '/oauth'
  })
);

router.post('/authWithIdToken',(req,res,next)=>{
  let {idToken} = req.body;
  var auth = new GoogleAuth;
  var client = new auth.OAuth2(process.env.CLIENT_ID, '', '');
  client.verifyIdToken(
    idToken,
    process.env.CLIENT_ID,
    // Or, if multiple clients access the backend:
    //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3],
    (e, login)=>{
      var payload = login.getPayload();
      console.log(payload);
      var userid = payload['sub'];
      res
      .cookie('id_token',idToken)
      .json({
        success:true
      });
      // If request specified a G Suite domain:
      //var domain = payload['hd'];
    });
})

router.get('/logout', (req, res)=>{
  res
  //clear cookie
  .cookie('id_token','')
  .redirect('/');
  //This will logout from all loggedin google account and return to application homepage
  // .redirect(`https://www.google.com/accounts/Logout?continue=https://appengine.google.com/_ah/logout?continue=${process.env.HOST}`);
});


module.exports = router;
