import { readdirSync } from "fs";
import { BG_COLOR_TEXT, COLOR_TEXT, FORMAT_TEXT } from "../constants/colors";
import pusherClass from "./pusher";
import pusherChannels from "../constants/pusherChannels";
import AppConfig from "../constants/AppConfig.json";
import { pusher } from "..";

class pusherManger {
    allPushers: pusherClass[] = [];

    public setUp() {
        console.log(BG_COLOR_TEXT.RED + "Loading pushers..." + FORMAT_TEXT.RESET)
        if (AppConfig.DetailLogs)
        {
            console.log("\n")
        }
        readdirSync("./pusherManager/pushers/").forEach(file => {
            if (!file.endsWith(".js")) return;
            let psh: pusherClass = require("./pushers/" + file)
            this.allPushers.push(psh);
            if (AppConfig.DetailLogs)
            {
                console.log(" Added pusher event '" + COLOR_TEXT.BLUE + psh.eventName + FORMAT_TEXT.RESET + "'\n" + FORMAT_TEXT.UNDERSCORE + "Channel" + FORMAT_TEXT.RESET + ": " + COLOR_TEXT.MAGENTA + Object.keys(pusherChannels)[Object.values(pusherChannels).findIndex((e, i) => psh.channel === e)] + FORMAT_TEXT.RESET + "\n" + FORMAT_TEXT.UNDERSCORE + "desc" + FORMAT_TEXT.RESET + ": " + psh.description + "\n")
            } else {
                console.log("Added pusher event '" + COLOR_TEXT.BLUE + psh.eventName + FORMAT_TEXT.RESET)
            }
        })
    }

    public executePusher(event: string, data: object = {}, force = false) {
        if (!AppConfig.PUSHER.IS_ACTIVE) return;
        this.allPushers.forEach(pusherFinded => {
            if (pusherFinded.eventName == event) {
                const res : object | void = pusherFinded.run(data, force);
                if (res === undefined) return;
                const dateActuelle = new Date();
                const options: Intl.DateTimeFormatOptions = {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                  timeZoneName: 'short'
                };
                const formatDate = new Intl.DateTimeFormat('fr-FR', options).format(dateActuelle);
                if (AppConfig.DetailLogs)
                {
                    console.log(COLOR_TEXT.GRAY + "[" + formatDate.split(" ").join("-") + "] " + COLOR_TEXT.RED + "Pusher" + FORMAT_TEXT.RESET + "  | " + COLOR_TEXT.CYAN + Object.keys(pusherChannels)[Object.values(pusherChannels).findIndex((e, i) => pusherFinded.channel === e)] + " " + COLOR_TEXT.YELLOW + event + COLOR_TEXT.GRAY + (JSON.stringify(res).length > 50 ? "\n" + " ".repeat(28) + JSON.stringify(res, null, 2).split("\n").join("\n" + " ".repeat(28)) : " " + JSON.stringify(res)) + FORMAT_TEXT.RESET)
                }
                pusher.trigger(pusherFinded.channel, event, res);
            }
        })
    }
}

export default new pusherManger();