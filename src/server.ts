import "reflect-metadata";
import express from "express";
import * as bodyParser from "body-parser";
import routes from "./service/routes";
import middleware from "./middleware";
import errorHandlers from "./middleware/errorHandlers";
import { applyMiddleware, applyRoutes } from "./utils";
import { readFileSync, existsSync } from 'fs';
import { createServer } from "https";
import { Database } from "./utils/Database";

process.on("uncaughtException", e => {
    console.log(e);
    process.exit(1);
});

process.on("unhandledRejection", e => {
    console.log(e);
    process.exit(1);
});

// create express app
const router = express();
router.use(bodyParser.json());

// register web app front end
const siteDirectory = __dirname + '/dist/';
if (existsSync(siteDirectory)) router.use('/', express.static(siteDirectory));

// register express routes from defined application routes
applyMiddleware(middleware, router);
applyRoutes(routes, router);
applyMiddleware(errorHandlers, router);

// setup express app here
require('dotenv').config();

// Initialise Database if available here
Database.initialise();

// start express server
if (eval(process.env.IS_LOCAL)) {
    router.listen(process.env.PORT);
    console.log('Express server has started on port ' + process.env.PORT +
        '.Open http://localhost:' + process.env.PORT + '/api-docs/ to see results');
} else {
    const certOptions = {
        key: readFileSync(__dirname + '/' + process.env.KEY, 'utf8'),
        cert: readFileSync(__dirname + '/' + process.env.CERTIFICATE, 'utf8'),
        requestCert: false,
        rejectUnauthorized: false
    };

    createServer(certOptions, router).listen(process.env.PORT, () => {
        console.log("Express server has started on port " + process.env.PORT);
    }).on('tlsClientError', (error: any) => {
        console.log(error);
    });
}