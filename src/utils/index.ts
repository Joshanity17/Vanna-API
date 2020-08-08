
import { Router, Request, Response, NextFunction } from "express";

type Wrapper = ((router: Router) => void);

export const applyMiddleware = (middleware: Wrapper[], router: Router) => {
    for (const f of middleware) {
        f(router);
    }
};

type Handler = (req: Request, res: Response, next: NextFunction) => Promise<void> | void | any;

type Route = {
    path: string;
    method: string;
    controller: Object;
    action: string
};

export const applyRoutes = (routes: Route[], router: Router) => {
    routes.forEach(route => {
        (router as any)[route.method]('/api/' + route.path, (req: Request, res: Response, next: Function) => {
            const result = (new (route.controller as any))[route.action](req, res, next);
            if (result instanceof Promise) {
                result.then(result => result !== null && result !== undefined ? res.send(result) : undefined);

            } else if (result !== null && result !== undefined) {
                res.json(result);
            }
        });
    });
};