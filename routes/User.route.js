const express = require('express');
const route = express.Router();
const userController = require('../controllers/user.controller');
const data = require('../middleware/user.middleware');

route.post('/user/signUp',data.validateUser,userController.postUser);

route.post('/user/verify',userController.generateUserQr);

route.post('/user/login',userController.verifyAndLogin);

module.exports = {UserRoutes : route}