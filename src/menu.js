'use strict';

function restoreOptions() {
    return chrome.storage.sync.get([...Constants.SOUNDS_LIST, 'volume'], function(result) {
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
        $("#volumeSlider").val(result.volume ?? 1);
    });
}

function saveOptions(options) {
    chrome.storage.sync.set(options, function () {
        //window.close();
    });
}

function handleChange(e) {
    const message = {
        type: "changeSound",
        optionType: $(this).data('sound'),
        optionValue: $(this).val()
    };
    sendMessageToTab(Constants.W2G_TAB_QUERY, message);
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

function handleVolumeChange(e) {
    const message = {
        type: "changeVolume",
        optionValue: $(this).val()
    };
    sendMessageToTab({}, message);
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
    $("#volumeSlider").val(1).change();
}

$(async function () {
    await restoreOptions();
    $("select").change(handleChange);
    $("#volumeSlider").change(handleVolumeChange);
    $("#muteAllBtn").click(handleMuteAllBtn);
    $("#restoreDefaultsBtn").click(handleRestoreDefaultsBtn);
});