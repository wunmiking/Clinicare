import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import cors from "cors";
import dotenv  from "dotenv";


// error handlers
import {
  catchNotFound,
  globalErrorHandler,
} from "./src/middlewares/errorHandler.js";

// api routes
import userRoutes from "./src/routes/userRoutes.js";
import patientRoutes from "./src/routes/patientRoutes.js";

dotenv.config()
const {MONGODB_URI, MONGODB_DB_NAME, NODE_ENV} = process.env 

// initialize our express app
const app = express();
app.disable("x-powered-by"); //disable the tech stack used when sending response to the client

// middlewares are the actions you want to execute before the main event - these functions have access to the request and response objects and can perform any task specified. - execute a piece of code, make changes to the req or res obj, call the next handler function. It basically helps to add and reuse functions across the approutes and endpoints. The flow -
// 1. req received by server
// 2. req is passed through each middleware specified
// 3. route handler processes the request
// 4. res is sent back through the middleware
// 5. res is finally sent to the client

app.use(
  cors({
    origin: ["http://localhost:4800"], //allow request from client address
    credentials: true, //allows cookie to be sent
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"], //permitted http methods
    optionsSuccessStatus: 200, //default status
  })
);

if (NODE_ENV === "development") {
  app.use(morgan("dev")); //log http requests to terminal in dev mode
}

// Body and cookie parsing
app.use(cookieParser()); //this middleware initializes the cookie in our app
app.use(express.json({ limit: "25mb" })); //parses request gotten from client side and sends back the response no greater than 25mb.
app.use(express.urlencoded({ extended: true, limit: "25mb" })); //useful for getting the large form submission in encoded formats such as base64 url strings where we set the content type pf the request body

// get request timestamp
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// test our API route
app.get("/", (req, res) => {
  res.status(200).json({
    status: "Success",
    message: "Server is running",
    environment: NODE_ENV,
    timestamp: req.requestTime,
  });
});

// assemble our api routes and endpoints. We will include other endpoints as we progress
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/patients", patientRoutes);

// handle route errors
app.use(catchNotFound);
// global error handler
app.use(globalErrorHandler);

// database connection
const connectDb = async () => {
  const connectionOptions = {
    // env files in node when reading must begin with process.env
    dbName: MONGODB_DB_NAME, //read env file
    serverSelectionTimeoutMs: 45000, //max time to wait for a server to be selected (45secs in ours), if no server selection a timeout error is thrown
    socketTimeoutMs: 5000, //time before socket timesout if there's no activity, useful for avoiding hanging connections
    retryWrites: true, //enables automatic retries of some write operations, like insert or update a document
    retryReads: true, //enables automatic retries of some read operations
    maxPoolSize: 50, //maximum number of connectionsin the mongodb connection pool, helps manage concurrent requests
    minPoolSize: 1, //minimum number of connections maintained by mongodb pool
  };
  try {
    const conn = await mongoose.connect(
      MONGODB_URI,
      connectionOptions
    );
    console.log(`✅ Mongodb Connected: ${conn.connection.host}`);
    //connection event handlers
    mongoose.connection.on("error", (err) =>
      console.error("❌ Mongoose connection error", err)
    );
    mongoose.connection.on("disconnected", () =>
      console.log("ℹ️ Mongodb disconnected")
    );
    // handle graceful server shutdown
    const gracefulShutdown = async () => {
      await mongoose.connection.close();
      console.log("ℹ️ Mongodb connection closed throuh app termination");
      process.exit(0);
    };
    process.on("SIGINT", gracefulShutdown); // this is our usual ctrl + c on terminal embedded in our code
    process.on("SIGTERM", gracefulShutdown); //a signal to terinate our process
    return conn;
  } catch (error) {
    console.error("❌ Mongodb connection failed", error.message);
    process.exit(1); //this exits the process, 1 usually indicates error/failure
  }
};

// server configuration
const PORT = process.env.PORT || 5400;

// code to handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION! ⛔ Shutting down...");
  console.error(err.name, err.message);
  process.exit(1);
});

const startServer = async () => {
  try {
    //INVOKE OUR DB CONNECTION
    await connectDb();
    // our server needs to run on the port number we created earlier
    const server = app.listen(PORT, () => {
      console.log(
        `✅ Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
      );
      console.log(`🌍 http://localhost:${PORT}`);
    });
    // handle the unhandled promise rejections
    process.on("unhandledRejection", (err) => {
      console.error("❌ UNHANDLED REJECTION! Shutting down...");
      console.error(err.name, err.message);

      // close server gracefully
      server.close(() => {
        console.log("🧨 Process terminated due to unhandled rejection");
        process.exit(1);
      });
    });
    // handle graceful shutdown
    const shutdown = async () => {
      console.log("⛔ Received shutdown signal. Closing server...");
      server.close(() => {
        console.log("✅ Server closed");
        process.exit(0);
      });

      // force close if server doesn't close in time
      setTimeout(() => {
        console.error("⚠️ Forcing server shutdown");
        process.exit(0);
      }, 10000);
    };

    // handletermination signals
    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);
  } catch (error) {
    console.error(`❌ Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

// start server
startServer();
