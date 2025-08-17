import { ZodError } from "zod";

export const validateFormData = (schema) => (req, res, next) => {
  try {
    // this is to receive and transform data gotten from the client through the req.body
    const parsedData = schema.parse(req.body);
    req.body = parsedData; //transformed data with no error
    next(); // this calls the next action to be executed, i.e, invoke the API function
  } catch (error) {
    if (error instanceof ZodError) {
      const errorMessages = error.issues.map((issue) => ({
        message: `${issue.path.join(".")} is ${issue.message}`,
      }));
      return res.status(400).json({
        error: "Validation failed",
        details: errorMessages,
      });
    }
    next(error); //pass error to next handler
  }
};

// note that forms should only be gotten from the req.body, reason we changed our earlier code from req.validatedData to req.body