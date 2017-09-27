'use strict';

//process.env.NODE_ENV = "developpement";
process.env.NODE_ENV = "production";

global.CONFIG = require('./config');
global.DB = require("./controllers/Connection");
DB.configure(CONFIG.DB_CONFIG);

var fs = require('fs'),
        path = require('path'),
        http = require('http');

var app = require('connect')();
var swaggerTools = require('swagger-tools');
var jsyaml = require('js-yaml');
var serverPort = CONFIG.SERVER_PORT;

// swaggerRouter configuration
var options = {
    swaggerUi: path.join(__dirname, '/swagger.json'),
    controllers: path.join(__dirname, './controllers'),
    useStubs: process.env.NODE_ENV === 'development' // Conditionally turn on stubs (mock mode)
};

// The Swagger document (require it, build it programmatically, fetch it from a URL, ...)
var spec = fs.readFileSync(path.join(__dirname, 'api/swagger.yaml'), 'utf8');
var swaggerDoc = jsyaml.safeLoad(spec);

// Initialize the Swagger middleware
swaggerTools.initializeMiddleware(swaggerDoc, function (middleware) {
    // Interpret Swagger resources and attach metadata to request - must be first in swagger-tools middleware chain
    app.use(middleware.swaggerMetadata());

    // Setup security handlers
    app.use(middleware.swaggerSecurity({
        ApiKeyAuth: function (req, def, api_key, callback) {
            //console.log(Object.keys(req));
            //console.log(req.originalUrl);
            if (api_key === CONFIG.API_KEY) {
                console.log("API_KEY OK");
                callback();
            } else {
                console.log("API_KEY INVALID at " + Date().toString() + "\n    " + getIP(req) + " try " + req.method + " on " + req.originalUrl);
                var error = new Error('API_KEY INVALID for ' + getIP(req) + " at " + Date().toString());
                error.stack = "";
                //callback(error);
                callback();
            }
        }
    }));

    // Validate Swagger requests
    app.use(middleware.swaggerValidator());

    // Route validated requests to appropriate controller
    app.use(middleware.swaggerRouter(options));

    // Serve the Swagger documents and Swagger UI
    app.use(middleware.swaggerUi());

    // Start the server
    http.createServer(app).listen(serverPort, function () {
        console.log(` /$$       /$$ /$$                             /$$              
| $$      |__/| $$                            | $$              
| $$       /$$| $$$$$$$   /$$$$$$   /$$$$$$  /$$$$$$   /$$   /$$
| $$      | $$| $$__  $$ /$$__  $$ /$$__  $$|_  $$_/  | $$  | $$
| $$      | $$| $$  \ $$| $$$$$$$$| $$  \__/  | $$    | $$  | $$
| $$      | $$| $$  | $$| $$_____/| $$        | $$ /$$| $$  | $$
| $$$$$$$$| $$| $$$$$$$/|  $$$$$$$| $$        |  $$$$/|  $$$$$$$
|________/|__/|_______/  \_______/|__/         \___/   \____  $$
                                                       /$$  | $$
                                                      |  $$$$$$/
                                                       \______/ 
 /$$$$$$$  /$$       /$$                                        
| $$__  $$|__/      | $$                                        
| $$  \ $$ /$$  /$$$$$$$  /$$$$$$   /$$$$$$                     
| $$$$$$$/| $$ /$$__  $$ /$$__  $$ /$$__  $$                    
| $$__  $$| $$| $$  | $$| $$$$$$$$| $$  \__/                    
| $$  \ $$| $$| $$  | $$| $$_____/| $$                          
| $$  | $$| $$|  $$$$$$$|  $$$$$$$| $$                          
|__/  |__/|__/ \_______/ \_______/|__/ \n`);
        console.log("           MODE: " + process.env.NODE_ENV);
        console.log('           PORT: ' + serverPort);
        console.log('           DOCS: /docs');
    });
});

function getIP(request) {
    var ip = request.headers['x-forwarded-for'] ||
            request.connection.remoteAddress ||
            request.socket.remoteAddress ||
            request.connection.socket.remoteAddress;
    ip = ip.split(',')[0];
    ip = ip.split(':').slice(-1); //in case the ip returned in a format: "::ffff:146.xxx.xxx.xxx"
    return ip;
}
