function initializePlayer(startFn) {
    chrome.storage.sync.get(['theyMessageSound', 'meMessageSound'], function(result) {
        startFn(result);
    });
}

function startPlayer(soundOptions) {
    const player = new SoundPlayer(soundOptions);
    player.start();
}

initializePlayer(startPlayer);