const jwt = require("jsonwebtoken");

const authConstant = require("../constants/authConstant");

class AuthMiddleware {
  isAuthenticated(req, res, next) {
    try {
      const token = req.cookies[authConstant.TOKEN_KEY];
      
      if (!token) {
        res.redirect("/user/login");
      }

      const decoded = jwt.verify(token, authConstant.JWT_SECRET_KEY);

      if (!decoded.userId) {
        res.clearCookie(authConstant.TOKEN_KEY);
        res.redirect("/user/login");
      }

      req.tokenInfo = decoded
      next();
    } catch (err) {
      res.clearCookie(authConstant.TOKEN_KEY);
      res.redirect("/user/login");
    }
  }
}

module.exports = new AuthMiddleware();
