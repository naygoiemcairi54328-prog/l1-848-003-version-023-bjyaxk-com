function setupVideoPlayer(source) {
    const video = document.querySelector('.player-video');
    const cover = document.querySelector('.player-cover');
    const button = document.querySelector('.player-start');
    const errorBox = document.querySelector('.player-error');
    let hls = null;

    if (!video || !source) {
        return;
    }

    function showError(message) {
        if (errorBox) {
            errorBox.textContent = message;
            errorBox.classList.add('show');
        }
    }

    function attachSource() {
        if (window.Hls && Hls.isSupported()) {
            hls = new Hls({
                enableWorker: true,
                lowLatencyMode: true
            });
            hls.loadSource(source);
            hls.attachMedia(video);
            hls.on(Hls.Events.ERROR, function (event, data) {
                if (data && data.fatal) {
                    showError('视频加载失败，请刷新后重试');
                }
            });
            return;
        }

        if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = source;
            return;
        }

        showError('当前浏览器无法播放该视频');
    }

    function startPlay() {
        if (cover) {
            cover.classList.add('is-hidden');
        }
        const playPromise = video.play();
        if (playPromise && typeof playPromise.catch === 'function') {
            playPromise.catch(function () {
                showError('点击播放器后再次尝试播放');
            });
        }
    }

    attachSource();

    if (button) {
        button.addEventListener('click', function (event) {
            event.stopPropagation();
            startPlay();
        });
    }

    if (cover) {
        cover.addEventListener('click', startPlay);
    }

    video.addEventListener('play', function () {
        if (cover) {
            cover.classList.add('is-hidden');
        }
    });

    video.addEventListener('error', function () {
        showError('视频加载失败，请刷新后重试');
    });

    window.addEventListener('beforeunload', function () {
        if (hls) {
            hls.destroy();
        }
    });
}
