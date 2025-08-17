import responseHandler from "../utils/responseHandler.js";
const { errorResponse } = responseHandler;

// error handler for dev environment
const sendErrorDev = (err, res) => {
  const errResponse = {
    status: err.status || "error",
    message: err.message,
    stack: err.stack,
    error: {
      name: err.name,
      statusCode: err.statusCode,
      isOperational: err.isOperational,
    },
  };
  console.error("ERROR", err);
  res.status(err.statusCode || 500).json(errResponse);
};

// send error for prod environment
const sendErrorProd = (err, res) => {
  // If Operational is set to true, then we send a message to client
  if (err.isOperational) {
    const errResponse = {
      status: err.status || "error",
      message: err.message,
    };
    return res.status(err.statusCode || 500).json(errResponse);
  }
  //   for prog or unknown errors - don't leak to client
  console.error("ERROR", err);
  return res.status(err.statusCode).json({
    status: "error",
    message: "Unidentified error",
  });
};

// handle json web token (JWT) errors
const handleJWTError = () => {
  return errorResponse("Invalid Token. Please login again", 401);
};

const handleJWTExpiredError = () => {
  return errorResponse("Your token has expired! Please login again", 401);
};

// main error handler for the middleware (index.js)
export const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "Error";
  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err, message: err.message, name: err.name };
    if (error.name === "JsonWebTokenError") error = handleJWTError();
    if (error.name === "TokenExpiredError") error = handleJWTExpiredError();
    sendErrorProd(error, res);
  }
};

// catch 404 error routes - usually seen in dev mode, can detect errors in sent APIs
export const catchNotFound = (req, res) => {
  errorResponse(`Can't find ${req.originalUrl} on this server`, 404);
};
