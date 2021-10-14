const targetNode = $('.w2g-chat-messages')[0];
const MessageType = {
    TheyMessage: "theyMessageSound",
    MeMessage: "meMessageSound"
}

class SoundPlayer {

    static getAudio(chatSound) {
        if (chatSound === "none") return;
        return new Audio(chrome.runtime.getURL(`assets/${chatSound}.mp3`));
    }

    constructor(soundOptions) {
        this.audioPlayer = Object.values(MessageType).reduce((accum, msgType) => {
            const chatSound = soundOptions[msgType] ?? Constants.DEFAULT_SOUNDS[msgType];
            accum[msgType] = SoundPlayer.getAudio(chatSound);
            return accum;
        }, {});
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
                    this.handleAddedNode(addedNode);
                }
            }
        };
        const observer = new MutationObserver(callback);
        observer.observe(targetNode, config);
    }

    handleAddedNode(addedNode) {
        const messageType = this.getMessageType(addedNode);
        if (messageType) {
            this.playSound(messageType);
        }
        
    }

    getMessageType(messageNode) {
        if (messageNode.classList.contains('mucmsg') && messageNode.classList.contains('w2g-they')) {
            return MessageType.TheyMessage;
        }
        if (messageNode.classList.contains('mucmsg') && messageNode.classList.contains('w2g-me')) {
            return MessageType.MeMessage;
        }
    }

    listenForOptionChange() {
        chrome.runtime.onMessage.addListener(
            (message, sender, sendResponse) => {
                switch (message.type) {
                    case "changeSound":
                        this.setSound(message.optionType, message.optionValue);
                        sendResponse({[message.optionType]: message.optionValue});
                        break;
                }
            }
        );
    }

    playSound(messageType) {
        if (this.audioPlayer[messageType]) {
            this.audioPlayer[messageType].play();
        }
    }

    setSound(type, value) {
        this.audioPlayer[type] = SoundPlayer.getAudio(value);
    }
}