const jwt = require("jsonwebtoken");
require("dotenv").config();

class AuthMiddleware {
  isAuthenticated(req, res, next) {
    try {
      const token = req.cookies[process.env.TOKEN_KEY];

      if (!token) {
        res.redirect("/user/login");
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

      if (!decoded.userId) {
        res.clearCookie(process.env.TOKEN_KEY);
        res.redirect("/user/login");
      }

      req.tokenInfo = decoded;
      next();
    } catch (err) {
      res.clearCookie(process.env.TOKEN_KEY);
      res.redirect("/user/login");
    }
  }
}

module.exports = new AuthMiddleware();
