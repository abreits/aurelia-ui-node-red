import * as express from "express";
import * as http from "http";
import * as socketIo from "socket.io";
import * as path from "path";

// no definition file available for node-red (yet)
const RED = require("node-red");

// Create an Express app
const app = express();

// Add a simple route for static content served from 'frontend'
app.use("/", express.static(path.join(__dirname, "..", "frontend")));

// Create a server
const server = http.createServer(app);
const io = socketIo(server);

io.on("connection", (socket) => {
  console.log("a user connected");
});

// Create the settings object - see default settings.js file for other options
const settings = {
    functionGlobalContext: {},    // enables global context
    httpAdminRoot: "/nodered/admin",
    httpNodeRoot: "/nodered",
    // Configure the logging output
    logging: {
        // Only console logging is currently supported
        console: {
            // Whether or not to include audit events in the log output
            audit: false,
            // Level of logging to be recorded. Options are:
            // fatal - only those errors which make the application unusable should be recorded
            // error - record errors which are deemed fatal for a particular request + fatal errors
            // warn - record problems which are non fatal + errors + fatal errors
            // info - record information about the general running of the application + warn + error + fatal errors
            // debug - record information which is more verbose than info + info + warn + error + fatal errors
            // trace - record very detailed logging + debug + info + warn + error + fatal errors
            level: "debug",

            // Whether or not to include metric events in the log output
            metrics: false
        }
    },
    userDir: ".nodered/",
    verbose: true
};

// Initialise the runtime with a server and settings
RED.init(server, settings);

// Serve the editor UI from /red
app.use(settings.httpAdminRoot, RED.httpAdmin);

// Serve the http nodes UI from /api
app.use(settings.httpNodeRoot, RED.httpNode);

server.listen(1880);

// Start the runtime
RED.start();
