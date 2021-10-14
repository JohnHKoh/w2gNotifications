const targetNode = $('.w2g-chat-messages')[0];

class SoundPlayer {

    constructor(chatSound) {
        this.sound = new Audio(chrome.runtime.getURL(`assets/${chatSound}.mp3`));;
    }

    start() {
        this.listenForMessages();
        this.listenForOptionChange();
    }

    listenForMessages() {
        const config = { childList: true };
        const callback = (mutationsList, observer) => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    const addedNode = mutation.addedNodes[0];
                    // if (addedNode.classList.contains('mucmsg') && addedNode.classList.contains('w2g-they')) {
                    if (addedNode.classList.contains('mucmsg')) {
                        this.sound.play();
                    }
                }
            }
        };
        const observer = new MutationObserver(callback);
        observer.observe(targetNode, config);
    }

    listenForOptionChange() {
        chrome.runtime.onMessage.addListener(
            (message, sender, sendResponse) => {
                switch (message.type) {
                    case "changeSound":
                        this.setSound(message.sound);
                        break;
                }
            }
        );
    }

    setSound(chatSound) {
        this.sound = new Audio(chrome.runtime.getURL(`assets/${chatSound}.mp3`));
    }
}