import { NextFunction, Request, Response } from "express";
import { Database } from "../../utils/Database";
import { createReadStream, statSync, Stats } from "fs";
import { Video } from "../../model/Video.model";

export class VideoController {
    async getAllVideo(request: Request, response: Response, next: NextFunction) {
        const result = Database.videoSource.map((video) => {
            return {
                id: video.id,
                name: video.name
            }
        });
        response.send(result);
    }

    async streamVideo(request: Request, response: Response, next: NextFunction) {
        const parameter = request.query;
        const video: Video = Database.videoSource.find((video) => video.id.toString() === parameter.id);
        const stat: Stats = statSync(video.path);
        const fileSize: number = stat.size;
        const range: string = request.headers.range;
        if (range) {
            const parts = range.replace(/bytes=/, "").split("-");
            const start = parseInt(parts[0], 10);
            const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
            const chunksize = (end - start) + 1;
            const fileChunk = createReadStream(video.path, { start, end });
            const head = {
                'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                'Accept-Ranges': 'bytes',
                'Content-Length': chunksize,
                'Content-Type': 'video/mp4',
            }
            response.writeHead(206, head);
            fileChunk.pipe(response);
        } else {
            const head = {
                'Content-Length': fileSize,
                'Content-Type': 'video/mp4',
            }
            response.writeHead(200, head);
            createReadStream(video.path).pipe(response);
        }
    }

    async viewVideo(request: Request, response: Response, next: NextFunction) {
        try {
            const parameter = request.body;
            const video: Video = Database.videoSource.find((video) => video.id.toString() === parameter.id.toString());
            video.viewCount++;
            response.statusCode = 200;
            response.send();
        } catch (e) {
            response.statusCode = 500;
            response.send();
        }
    }

    async getVideoViewCount(request: Request, response: Response, next: NextFunction) {
        const parameter = request.query;
        const video: Video = Database.videoSource.find((video) => video.id.toString() === parameter.id);
        response.send({ viewCount: video.viewCount })
    }

    async logViewStatistic(request: Request, response: Response, next: NextFunction) {
        try {
            const parameter = request.body;
            const video: Video = Database.videoSource.find((video) => video.id.toString() === parameter.id.toString());
            video.viewHistory.push({
                leftAt: parameter.time,
                complete: parameter.complete
            });
            response.statusCode = 200;
            response.send();
        } catch (e) {
            response.statusCode = 500;
            response.send();
        }
    }

    async getMostViewedVideo(request: Request, response: Response, next: NextFunction) {
        const video: Video = Database.videoSource.reduce((prev, curr) => {
            return (prev.viewCount > curr.viewCount) ? prev : curr;
        });
        const mostViewedVideo = Math.max.apply(Math, Database.videoSource.map((video) => video.viewCount));
        response.send(video)
    }

}