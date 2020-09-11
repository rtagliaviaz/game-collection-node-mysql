module.exports = {

  isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    return res.redirect('/signin');
  },

  isNotLoggedIn(req, res, next) {
    if (!req.isAuthenticated()) {
      return next();
    }
    return res.redirect('/profile');
  },

  //middleware to protect routes to only admin
  //https://stackoverflow.com/a/61881181/13038809
  isAdmin(req, res, next) {
    if(req.isAuthenticated() && (req.user.username == "admin")) {
      return next();
    } 
    return res.redirect('/profile')
  }


};