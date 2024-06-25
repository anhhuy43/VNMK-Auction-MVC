const User = require("../models/User");
const { mongooseToObject } = require("../../util/mongoose");
const { multipleMongooseToObject } = require("../../util/mongoose");
const bcrypt = require("bcrypt");
const dayjs = require("dayjs");
const customParseFormat = require("dayjs/plugin/customParseFormat");
const utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone");
const jwt = require("jsonwebtoken");
const authConstant = require("../../constants/authConstant");
dayjs.extend(utc);
dayjs.extend(customParseFormat);
dayjs.extend(timezone);

class UserController {
  login(req, res, next) {
    res.render("user/login");
  }

  async loginUser(req, res, next) {
    try {
      const foundUser = await User.findOne({ email: req.body.email });

      if (!foundUser) {
        res.render("user/login", {
          userNotFound: {
            isUserNotFound: true,
          },
        });
      } else {
        //compare the hash password from the database with the plain text
        const isPasswordMatch = await bcrypt.compare(
          req.body.password,
          foundUser.password
        );

        if (isPasswordMatch) {
          const token = jwt.sign(
            { userId: foundUser._id.toString() },
            authConstant.JWT_SECRET_KEY
          );
          res.cookie(authConstant.TOKEN_KEY, token);
          res.redirect("/");
        } else {
          res.render("user/login", {
            wrongPassword: {
              isWrongPassword: true,
            },
          });
        }
      }
    } catch {
      res.send("wrong details");
    }
  }

  create(req, res, next) {
    res.render("user/create");
  }

  async createUser(req, res, next) {
    const formData = req.body;

    const formData1 = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.password,
    };

    // already exists user check
    const existingUser = await User.findOne({ email: formData1.email });
    console.log(existingUser);
    if (existingUser) {
      res.render("user/create", {
        formError: {
          isUserExisting: true,
        },
      });
    } else {
      //hash the password using bcrypt
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(formData1.password, saltRounds);

      formData1.password = hashedPassword; //replace the hash password w original password

      const user = new User(formData1);
      user
        .save()
        .then(() => res.redirect("/user/login"))
        .catch(next);
    }
  }

  async info(req, res, next) {
    try {
      const userDetail = await User.findOne({ _id: req.tokenInfo.userId }).then(
        (user) => {
          return mongooseToObject(user);
        }
      );
      res.render("user/info", {
        user: userDetail,
      });
    } catch (err) {
      console.log("err", err);
      next();
    }
  }

  async logout(req, res, next) {
    res.clearCookie(authConstant.TOKEN_KEY);
    res.redirect("/user/login");
  }

  // [GET] /user/edit
  async edit(req, res, next) {
    try {
      const userDetail = await User.findOne({ _id: req.tokenInfo.userId }).then(
        (user) => {
          return mongooseToObject(user);
        }
      );
      res.render("user/edit", {
        user: userDetail,
      });
    } catch (err) {
      console.log("err", err);
      next();
    }
  }

  // [PUT] /user/:id
  update(req, res, next) {
    User.updateOne({ _id: req.tokenInfo.userId }, req.body)
      .then(() => res.redirect("/user/info"))
      .catch(next);
  }

  changePassword(req, res, next) {
    res.render("user/changePassword");
  }

  async updatePassword(req, res, next) {
    try {
      const foundUser = await User.findOne({ _id: req.tokenInfo.userId });
      console.log(
        "🚀 ~ UserController ~ updatePassword ~ foundUser:",
        foundUser
      );

      const isCheckPasswordMatch = await bcrypt.compare(
        req.body.password,
        foundUser.password
      );

      //check matches current password
      if (isCheckPasswordMatch) {
        const formData = req.body;
        console.log(
          "🚀 ~ UserController ~ updatePassword ~ formData:",
          req.body
        );

        //check new password match comfirm password
        if (formData.newPassword === formData.confirmPassword) {
          const isCheckNewPasswordMatchCurrent = await bcrypt.compare(
            req.body.newPassword,
            foundUser.password
          );
          //check new password match current password
          if (isCheckNewPasswordMatchCurrent) {
            res.render("user/changePassword", {
              checkNewPasswordMatchCurrent: {
                isCheckNewPasswordMatchCurrent: true,
              },
            });
          } else {
            //hash the password using bcrypt
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(
              formData.newPassword,
              saltRounds
            );

            formData.password = hashedPassword; //replace the hash password w original password
            console.log(
              "🚀 ~ UserController ~ updatePassword ~ formData.password:",
              formData.password
            );

            const formData1 = {
              firstName: foundUser.firstName,
              lastName: foundUser.lastName,
              email: foundUser.email,
              password: formData.password,
            };
            User.updateOne({ _id: req.tokenInfo.userId }, formData1).then(() =>
              res.redirect("/user/info")
            );
          }
        } else {
          res.render("user/changePassword", {
            checkNewPasswordMatch: {
              isCheckNewPasswordMatch: true,
            },
          });
        }
      } else {
        res.render("user/changePassword", {
          checkPassword: {
            isCheckPassword: true,
          },
        });
      }
    } catch {
      res.send("wrong details");
    }
  }
}

module.exports = new UserController();
