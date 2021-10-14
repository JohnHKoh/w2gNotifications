'use strict';

const selectId = "#sound-select";

function restoreOptions() {
    return chrome.storage.sync.get(['sound'], function(result) {
        if (result.sound) {
            $(selectId).val(result.sound);
        }
        else {
            $(selectId).val(Constants.DEFAULT_SOUND);
        }
    });
}

function saveOptions(options) {
    chrome.storage.sync.set(options, function () {
        window.close();
    });
}

function handleChange(e) {
    const message = {
        type: "changeSound",
        sound: $(this).val()
    };
    const queryObject = {
        url: Constants.W2G_ROOM_PATTERN
    };
    sendMessageToTab(queryObject, message);
}

function sendMessageToTab(queryObject, message) {
    chrome.tabs.query(queryObject, tabs => {
        tabs.forEach(tab => {
            chrome.tabs.sendMessage(tab.id, message, function(response) {
                const options = {
                    sound: message.sound
                };
                saveOptions(options);
            });
        });
    });
}

$(async function () {
    await restoreOptions();
    $(selectId).change(handleChange);
});