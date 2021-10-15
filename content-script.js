function initializePlayer(startFn) {
    chrome.storage.sync.get([...Constants.SOUNDS_LIST, 'volume'], function(result) {
        startFn(result);
    });
}

function startPlayer(soundOptions) {
    const player = new SoundPlayer(soundOptions);
    player.start();
}

initializePlayer(startPlayer);