import { NextFunction, Request, Response } from "express";
import { Database } from "../../utils/Database";

export class VideoController {
    async getAllVideo(request: Request, response: Response, next: NextFunction) {
        const result = Database.videoSource.map((video) => video.id);
        response.send(result);
    }
}