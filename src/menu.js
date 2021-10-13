'use strict';

$(function () {
    chrome.storage.sync.get(['sound'], function (result) {
        if (result.sound) {
            $("#sound-select").val(result.sound);
        }
        else {
            $("#sound-select").val("pop");
        }
    });
    $("#sound-select").change(function() {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            const message = {
                type: "changeSound",
                sound: $(this).val()
            }
            chrome.tabs.query({ url: "https://w2g.tv/rooms/*" }, tabs => {
                tabs.forEach(tab => {
                    chrome.tabs.sendMessage(tab.id, message, function(response) {
                        chrome.storage.sync.set({ sound: message.sound }, function () {
                            window.close();
                        });
                    });
                });
            });
        });
    });
});