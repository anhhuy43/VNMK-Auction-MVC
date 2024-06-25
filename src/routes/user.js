const express = require('express')
const router = express.Router()
const authMiddleware = require("../middlewares/authMiddleware");
const userController = require('../app/controllers/UserController')

router.get('/login', userController.login)
router.get('/create', userController.create)
router.get('/info', [authMiddleware.isAuthenticated], userController.info)
router.get("/edit", [authMiddleware.isAuthenticated], userController.edit);
router.put("/update", [authMiddleware.isAuthenticated], userController.update);
router.get("/changePassword", [authMiddleware.isAuthenticated], userController.changePassword);
router.put("/updatePassword", [authMiddleware.isAuthenticated], userController.updatePassword);
router.post('/createUser', userController.createUser)
router.post('/loginUser', userController.loginUser)
router.get('/logout', userController.logout)


module.exports = router