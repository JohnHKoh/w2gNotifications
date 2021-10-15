class Constants {

    static get MESSAGE_TYPE() {
        return {
            MeMessage: "meMessageSound",
            TheyMessage: "theyMessageSound",
            UserJoinMessage: "userJoinMessageSound",
            UserLeaveMessage: "userLeaveMessageSound"
        }
    }
    
    static get DEFAULT_SOUNDS() {
        const MessageType = Constants.MESSAGE_TYPE;
        return {
            [MessageType.MeMessage]: "none",
            [MessageType.TheyMessage]: "pop",
            [MessageType.UserJoinMessage]: "discordjoin",
            [MessageType.UserLeaveMessage]: "discordleave"
        }
    }

    static get SOUNDS_LIST() {
        return Object.values(Constants.MESSAGE_TYPE);
    }

    static get W2G_ROOM_PATTERN() {
        return "https://w2g.tv/rooms/*";
    }

    static get W2G_TAB_QUERY() {
        return {
            url: Constants.W2G_ROOM_PATTERN
        };
    }
}