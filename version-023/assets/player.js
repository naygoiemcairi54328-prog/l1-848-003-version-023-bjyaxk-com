import { H as Hls } from "./hls-dru42stk.js";

export function startPlayer(videoId, sourceUrl) {
    var video = document.getElementById(videoId);
    var overlay = document.querySelector("[data-player-overlay]");
    var started = false;
    var hlsInstance = null;

    if (!video || !sourceUrl) {
        return;
    }

    var loadSource = function () {
        if (started) {
            return;
        }
        started = true;
        if (overlay) {
            overlay.classList.add("hidden");
        }
        if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = sourceUrl;
        } else if (Hls && Hls.isSupported()) {
            hlsInstance = new Hls({
                enableWorker: true,
                lowLatencyMode: true
            });
            hlsInstance.loadSource(sourceUrl);
            hlsInstance.attachMedia(video);
        } else {
            video.src = sourceUrl;
        }
        var promise = video.play();
        if (promise && typeof promise.catch === "function") {
            promise.catch(function () {});
        }
    };

    if (overlay) {
        overlay.addEventListener("click", loadSource);
    }
    video.addEventListener("click", function () {
        if (!started) {
            loadSource();
        }
    });
    window.addEventListener("beforeunload", function () {
        if (hlsInstance) {
            hlsInstance.destroy();
        }
    });
}
