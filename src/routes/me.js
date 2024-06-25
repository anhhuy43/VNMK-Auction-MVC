const express = require('express')
const router = express.Router()
const authMiddleware = require("../middlewares/authMiddleware");
const meController = require('../app/controllers/MeController')

router.get('/stored/posts', [authMiddleware.isAuthenticated], meController.storedPosts)

module.exports = router