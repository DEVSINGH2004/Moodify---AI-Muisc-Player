const {Router} = require("express")
const authController = require("../controllers/auth.controller")
const authMiddleware = require("../middlewares/auth.middlewares")
const authRouter = Router();

authRouter.post("/register",authController.registerController)
authRouter.post("/login",authController.loginController)
authRouter.get("/get-me",authMiddleware.authUser,authController.getMeController)
authRouter.get("/logout",authController.logoutController)

module.exports = authRouter;