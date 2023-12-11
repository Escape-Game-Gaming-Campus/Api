import { readdirSync } from "fs";
import { BG_COLOR_TEXT, COLOR_TEXT, FORMAT_TEXT } from "../constants/colors";
import { APPPort, app, pusher } from "..";
import CommandType from "../constants/commandType";
import pusherClass from "./pusher";
import pusherChannels from "../constants/pusherChannels";

class pusherManger {
    allPushers: pusherClass[] = [];

    constructor() {
        console.log(BG_COLOR_TEXT.RED + "Loading pushers..." + FORMAT_TEXT.RESET + "\n")
        readdirSync("./pusherManager/pushers/").forEach(file => {
            if (!file.endsWith(".js")) return;
            let psh: pusherClass = require("./pushers/" + file)
            this.allPushers.push(psh);
            console.log(" Added pusher event '" + COLOR_TEXT.BLUE + psh.eventName + FORMAT_TEXT.RESET + "'\n" + FORMAT_TEXT.UNDERSCORE + "Channel" + FORMAT_TEXT.RESET + ": " + COLOR_TEXT.MAGENTA + Object.keys(pusherChannels)[Object.values(pusherChannels).findIndex((e, i) => psh.channel === e)] + FORMAT_TEXT.RESET + "\n" + FORMAT_TEXT.UNDERSCORE + "desc" + FORMAT_TEXT.RESET + ": " + psh.description + "\n")
        })
    }

    public void() { };

    public executePusher(event: string, data: object = {}) {
        this.allPushers.forEach(pusherFinded => {
            if (pusherFinded.eventName == event) {
                pusher.trigger(pusherFinded.channel, event, pusherFinded.run(data));
            }
        })
    }
}

export default new pusherManger();