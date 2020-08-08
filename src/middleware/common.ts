import { Router } from "express";
import cors, { CorsOptions } from "cors";
import parser from "body-parser";
import compression from "compression";

export const handleCors = (router: Router) => {
    var whitelist = ['http://localhost:8000', 'http://localhost:9000'];
    var corsOptions: CorsOptions = {
        origin: (origin: any, callback: any) => {
            if (whitelist.indexOf(origin) !== -1) {
                callback(null, true);
            } else {
                callback(null, false);
            }
        },
        methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
        optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
        credentials: true, //Credentials are cookies, authorization headers or TLS client certificates.
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'device-remember-token', 'Access-Control-Allow-Origin', 'Origin', 'Accept']
    };

    router.use(cors(corsOptions));
}

export const handleBodyRequestParsing = (router: Router) => {
    router.use(parser.urlencoded({ extended: true }));
    router.use(parser.json());
};

export const handleCompression = (router: Router) => {
    router.use(compression());
};