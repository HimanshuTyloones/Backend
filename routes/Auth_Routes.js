const authRouter = require('express').Router();

const Users = require('../modles/UserAuth_model')
const {login,signUp,verifyemail} = require('../controllers/Auth_controllers')



authRouter.route('/login').post(login);
authRouter.route('/signup').post(signUp);
authRouter.route('/verifyemail').post(verifyemail)


module.exports = authRouter;

// =>