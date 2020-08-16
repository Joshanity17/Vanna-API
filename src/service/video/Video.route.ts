import { VideoController } from "./Video.controller";

export const VideoRoute = [
    {
        method: "get",
        path: "getAllVideo",
        controller: VideoController,
        action: "getAllVideo"
    },
    {
        method: "get",
        path: "streamVideo",
        controller: VideoController,
        action: "streamVideo"
    },
    {
        method: "put",
        path: "viewVideo",
        controller: VideoController,
        action: "viewVideo"
    },
    {
        method: "get",
        path: "getVideoViewCount",
        controller: VideoController,
        action: "getVideoViewCount"
    },
    {
        method: "put",
        path: "logViewStatistic",
        controller: VideoController,
        action: "logViewStatistic"
    },
    {
        method: "get",
        path: "getMostViewedVideo",
        controller: VideoController,
        action: "getMostViewedVideo"
    }
];