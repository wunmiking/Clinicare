// classes are like templates for creating javascript objects, they can inherit existing prototypes of objects. They usually get initialized with a constructor.
// a constructor is a method for creating and initializing an object instance of a class, while the super keyword is used to call and invoke the parent class which gives it access to its properties and methods
class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message); // this invokes the message that will be passed
    this.statusCode = statusCode; // this references our statusCodereceived from the Error constructor
    this.status = `${statusCode}.startsWith('4') ? 'failed' : 'error'`; // we want to determine the error type, if it starts with 4, then we assign a status of fail, otherwise we assign a status of error
    this.success = false; //we default to false in this case because we are handling errors
    this.isOperational = true; // to distinguish btw operation errors, such as server shutdown or connection, validation errors, authentication errors while programmer errors - bugs, syntax or type errors, should not be sent to the client. 
  }
}

class ApiResponse {
  constructor(statusCode, data, message = "Success") {
    this.statusCode = statusCode; // status code to be sent
    this.data = data; // Api data to be sent to the client
    this.message = message; //custom msg to be passed, defaults to success if none is passed
    this.success = statusCode < 400; //auto sets success to true for statusCodes less than 400
  }
}

const sendResponse = (res, statusCode, data = null, message = null) => {
  const response = new ApiResponse(statusCode, data, message);
  return res.status(statusCode).json({
    success: response.success,
    message: response.message,
    data: response.data,
  });
};

const successResponse = (
  res,
  data,
  message = "Request Successful",
  statusCode = 200
) => {
  return sendResponse(res, statusCode, data, message);
};

const errorResponse = (
  message = "An error occured",
  statusCode = 500,
  data = null
) => {
  return new AppError(message, statusCode, data);
};

const notFoundResponse = (
    message = "Resource not found") => {
        return errorResponse(message, 404);
    };

    const unauthorizedResponse = (message = "Unauthorized Access") => {
        return errorResponse(message, 401);
    };

    const forbiddenREsponse = (message = "Forbidden Access") => {
        return errorResponse(message, 403);
    };

    export default {
        ApiResponse,
        sendResponse,
        successResponse,
        errorResponse,
        notFoundResponse,
        unauthorizedResponse,
        forbiddenREsponse,
    };