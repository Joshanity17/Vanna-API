import { VideoController } from "./Video.controller";

export const VideoRoute = [
    {
        method: "get",
        path: "getAllVideo",
        controller: VideoController,
        action: "getAllVideo"
    }
];