function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.status(401).json({message:"Not logged in"}); // Redirect unauthenticated requests to login page
  }
module.exports = {
  isLoggedIn
};