function initializePlayer(startFn) {
    let chatSound = Constants.DEFAULT_SOUND;
    chrome.storage.sync.get(['sound'], function(result) {
        if (result.sound) {
            chatSound = result.sound;
        }
        startFn(chatSound);
    });
}

function startPlayer(chatSound) {
    const player = new SoundPlayer(chatSound);
    player.start();
}

initializePlayer(startPlayer);