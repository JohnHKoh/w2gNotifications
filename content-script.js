const targetNode = $('.w2g-chat-messages')[0];

let chatSound;

chrome.storage.sync.get(['sound'], function (result) {
    if (result.sound) {
        chatSound = new Audio(chrome.runtime.getURL(`assets/${result.sound}.mp3`));
    }
    else {
        chatSound = new Audio(chrome.runtime.getURL("assets/pop.mp3"));
    }
    startChatObserver();
});

function startChatObserver() {
    const config = { childList: true };

    const callback = function (mutationsList, observer) {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                const addedNode = mutation.addedNodes[0];
                if (addedNode.classList.contains('mucmsg') && addedNode.classList.contains('w2g-they')) {
                    chatSound.play();
                }
            }
        }
    };
    const observer = new MutationObserver(callback);
    observer.observe(targetNode, config);
}

chrome.runtime.onMessage.addListener(
    function (message, sender, sendResponse) {
        switch (message.type) {
            case "changeSound":
                chatSound = new Audio(chrome.runtime.getURL(`assets/${message.sound}.mp3`));
                break;
        }
    }
);