playAudio(); // Autoplay rain
$('#rngVolume').val(0.4).change(); // Set volume to 40%

// If we're in video mode, do some fancy stuff!
if (window.location.search) {
    var player; // Player object for the video
    var starting = true; // Indicate if a video just started
    var lastState; // Track the last state of the video (e.g. buffering)

    clearContainer();
    loadScript();
    reskin();

    function reskin() {
        // Remove video-specific text
        $('h2').remove();

        // Fast forward button
        $('head')
            .append($('<link rel="stylesheet" type="text/css"/>')
                .attr('href', 'https://use.fontawesome.com/releases/v5.6.3/css/all.css'));

        $('#audioplayerskin').append($('<i class="fas fa-forward" onclick="playRandomVideo()"/>').css('font-size',
            '48px').css('margin-top', '16px'));
    }

    // Clear container of its video and set it up for the iframe API
    function clearContainer() {
        $('.youtube-embed-container > *').empty();
        $('.youtube-embed-container').append($('<div id="player"/></div>'));
    }

    // Load the YouTube iframe API
    function loadScript() {
        var tag = document.createElement('script');

        tag.src = "https://www.youtube.com/iframe_api";
        var firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }

    // Called by the iframe API after it loads
    function onYouTubeIframeAPIReady() {
        player = new YT.Player('player', {
            videoId: /[?&]v=([^&]+)(?:&|$)/.exec(window.location.search)[1],
            events: {
                onReady: onPlayerReady,
                onStateChange: onPlayerStateChange
            }
        });
    }

    function onPlayerReady(event) {
        event.target.playVideo(); // Autoplay video
    }

    function onPlayerStateChange(event) {
        // Video not available, so play another
        if (event.data === YT.PlayerState.UNSTARTED && lastState === 3)
            playRandomVideo();

        // Starting the video, so update the title/history
        if (event.data === YT.PlayerState.PLAYING && starting) {
            document.title = player.getVideoData().title;
            window.history.replaceState(null, player.getVideoData().title,
                `watch?v=${player.getVideoData().video_id}`);

            starting = false;
        }

        // Play random video after the current video finishes
        if (event.data === YT.PlayerState.ENDED)
            playRandomVideo();

        lastState = event.data;
    }

    // Play a random video that is linked on the page
    function playRandomVideo() {
        var $urls = $('[href^="/watch"]');
        var i = Math.floor(Math.random() * $urls.length);

        var href = $urls[Math.floor(Math.random() * $urls.length)].href;
        var id = /[?&]v=([^&]+)(?:&|$)/.exec(href)[1];

        starting = true;

        player.loadVideoById(id);
    }
}