'use strict';

function restoreOptions() {
    return chrome.storage.sync.get(['theyMessageSound', 'meMessageSound'], function(result) {
        $("select").each(function(i) {
            const soundType = $(this).data('sound');
            const sound = result[soundType];
            if (sound) {
                $(this).val(sound)
            }
            else {
                $(this).val(Constants.DEFAULT_SOUNDS[soundType]);
            }
        });
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
        optionType: $(this).data('sound'),
        optionValue: $(this).val()
    };
    const queryObject = {
        url: Constants.W2G_ROOM_PATTERN
    };
    sendMessageToTab(queryObject, message);
}

function sendMessageToTab(queryObject, message) {
    chrome.tabs.query(queryObject, tabs => {
        tabs.forEach(tab => {
            chrome.tabs.sendMessage(tab.id, message, function(optionsResponse) {
                saveOptions(optionsResponse);
            });
        });
    });
}

function handleMuteAllBtn(e) {
    $("select").each(function (i) {
        $(this).val("none").change();
    });
}

function handleRestoreDefaultsBtn(e) {
    $("select").each(function (i) {
        const soundType = $(this).data('sound');
        $(this).val(Constants.DEFAULT_SOUNDS[soundType]).change();
    });
}

$(async function () {
    await restoreOptions();
    $("select").change(handleChange);
    $("#muteAllBtn").click(handleMuteAllBtn);
    $("#restoreDefaultsBtn").click(handleRestoreDefaultsBtn);
});