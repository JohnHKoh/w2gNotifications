const targetNode = $('.w2g-chat-messages')[0];
const MessageType = Constants.MESSAGE_TYPE;

class SoundPlayer {

    static getAudio(chatSound) {
        if (chatSound === "none") return;
        return new Audio(chrome.runtime.getURL(`assets/${chatSound}.mp3`));
    }

    constructor(soundOptions) {
        this.volume = soundOptions.volume ?? 1;
        this.audioPlayer = Constants.SOUNDS_LIST.reduce((accum, msgType) => {
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
        const classes = messageNode.classList;
        if (classes.contains('mucmsg') && classes.contains('w2g-they')) {
            return MessageType.TheyMessage;
        }
        if (classes.contains('mucmsg') && classes.contains('w2g-me')) {
            return MessageType.MeMessage;
        }
        if (classes.contains('usermsg') && classes.contains('w2g-they')) {
            if ($(messageNode).find('.w2g-chat-message-text').text() === "User joined room") {
                return MessageType.UserJoinMessage;
            }
            if ($(messageNode).find('.w2g-chat-message-text').text() === "User left room") {
                return MessageType.UserLeaveMessage;
            }
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
                    case "changeVolume":
                        this.setVolume(message.optionValue);
                        sendResponse({volume: message.optionValue});
                }
            }
        );
    }

    playSound(messageType) {
        const audio = this.audioPlayer[messageType];
        if (audio) {
            audio.pause();
            audio.currentTime = 0;
            audio.volume = this.volume;
            audio.play();
        }
    }

    setSound(type, value) {
        this.audioPlayer[type] = SoundPlayer.getAudio(value);
    }

    setVolume(volume) {
        this.volume = volume;
    }
}