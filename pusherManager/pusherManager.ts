import { readdirSync } from "fs";
import { BG_COLOR_TEXT, COLOR_TEXT, FORMAT_TEXT } from "../utils/colors";
import { APPPort, app, pusher } from "..";
import CommandType from "../utils/commandType";
import pusherClass from "./pusher";

class pusherManger {
    allPushers: pusherClass[] = [];

    constructor() {
        console.log(BG_COLOR_TEXT.RED + "Loading pushers..." + FORMAT_TEXT.RESET + "\n")
        readdirSync("./commandManager/commands/").forEach(file => {
            if (!file.endsWith(".js")) return;
            let psh: pusherClass = require("./pushers/" + file)
            this.allPushers.push(psh);
            console.log(" Added pusher event '" + COLOR_TEXT.BLUE + psh.eventName + FORMAT_TEXT.RESET + "'\nChannel: " + COLOR_TEXT.MAGENTA + psh.channel + FORMAT_TEXT.RESET + "\ndesc: " + psh.description + "\n")
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