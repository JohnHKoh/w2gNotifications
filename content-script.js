// Select the node that will be observed for mutations
const targetNode = $('.w2g-chat-messages')[0];

let chatSound = new Audio(chrome.runtime.getURL("assets/pop.mp3"));

// Options for the observer (which mutations to observe)
const config = { attributes: true, childList: true, subtree: false };

// Callback function to execute when mutations are observed
const callback = function (mutationsList, observer) {
    // Use traditional 'for loops' for IE 11
    for (const mutation of mutationsList) {
        if (mutation.type === 'childList') {
            const addedNode = mutation.addedNodes[0];
            //if (addedNode.classList.contains('mucmsg') && addedNode.classList.contains('w2g-they')) {
            if (addedNode.classList.contains('mucmsg')) {
                chatSound.play();
            }
        }
    }
};

// Create an observer instance linked to the callback function
const observer = new MutationObserver(callback);

// Start observing the target node for configured mutations
observer.observe(targetNode, config);

chrome.runtime.onMessage.addListener(
    function (message, sender, sendResponse) {
        switch (message.type) {
            case "changeSound":
                chatSound = new Audio(chrome.runtime.getURL(`assets/${message.sound}.mp3`));
                break;
        }
    }
);