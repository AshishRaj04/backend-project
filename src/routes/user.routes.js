// Import necessary dependencies
import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changePassword,
  currentUser,
  updateAvatar,
  updateCoverImage,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import verifyJWT from "../middlewares/auth.middleware.js";

// Initialize the router
const router = Router();

/**
 * Route to register a new user.
 *
 * This route uses multer middleware to handle file uploads. It uploads the avatar and coverImage files from the request.
 * The upload middleware limits the number of files for each field to 1.
 *
 * The request is then passed to the registerUser function from the user.controller.js file.
 */
router.route("/register").post(
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  registerUser
);

/**
 * Route to log in a user.
 *
 * The request is passed to the loginUser function from the user.controller.js file.
 */
router.route("/login").post(loginUser);

/**
 * Route to log out a user.
 *
 * This route uses the verifyJWT middleware to verify if the JWT token in the request is valid.
 * If the token is valid, the request is passed to the logoutUser function from the user.controller.js file.
 */
router.route("/logout").post(verifyJWT, logoutUser);

router.route("/refreshToken").get(refreshAccessToken);

router.route("/changePassword").post(verifyJWT, changePassword);
router.route("/getCurrentUser").post(verifyJWT, currentUser);
router
  .route("/updateUserAvatar")
  .post(
    verifyJWT,
    upload.single("avatar"),
    updateAvatar
  );
router
  .route("/updateUserCoverImage")
  .post(
    verifyJWT,
    upload.single("coverImage"),
    updateCoverImage
  );

// Export the router
export default router;
