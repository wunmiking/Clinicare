import jwt from "jsonwebtoken";
import tryCatchFunction from "../utils/tryCatchFunction.js";
import responseHandler from "../utils/responseHandler.js";
const { forbiddenResponse, unauthorizedResponse } = responseHandler;
import { promisify } from "util";
import User from "../models/user.js";

export const verifyAuth = tryCatchFunction(async (req, res, next) => {
  // check if token exists
  let token;
  // We're checking for our token in the request.headers object and ensuring it starts with the Bearer signature word ensuring its a jwt type token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1]; //extracts the token (at index 1) without the "Bearer" string
    
  }
  if (!token) {
    return next(
      unauthorizedResponse(
        "You are not logged in! Please log in to gain access."
      )
    );
  }
  //   verify the token
  const decoded = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET_KEY
  );
  // We will checkif a user exists with our decoded ID
  const currentUser = await User.findById(decoded.id);
  
  if (!currentUser) {
    return next(
      unauthorizedResponse("The user belonging to this token no longer exists.")
    );
  }
  //   assign user to our request object
  req.user = currentUser;
  next(); //pass to the next event
});

//role base auth
export const authorizedRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        forbiddenResponse("You do not have permission to perform this action")
      );
    }
    next();
  };
};