import { readdirSync } from "fs";
import { Command } from "./command";
import { BG_COLOR_TEXT, COLOR_TEXT, FORMAT_TEXT } from "../constants/colors";
import { APPPort, app } from "..";
import CommandType from "../constants/commandType";

export default function CommandManager() {
    console.log(BG_COLOR_TEXT.RED + "Loading commands..." + FORMAT_TEXT.RESET + "\n")
    readdirSync("./commandManager/commands/").forEach(file => {
        if(!file.endsWith(".js")) return;
        let cmd : Command = require("./commands/" + file)
        app[CommandType[cmd.type] as "get"](cmd.path, async (req, res) => {
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
            
            cmd.run(req, res)
            console.log(COLOR_TEXT.GRAY + "[" + formatDate.split(" ").join("-") + "] " + COLOR_TEXT.MAGENTA + res.statusCode + " " + COLOR_TEXT.CYAN + req.method + FORMAT_TEXT.RESET + " " + COLOR_TEXT.YELLOW + req.path + FORMAT_TEXT.RESET + " from " + COLOR_TEXT.GREEN + req.ip + FORMAT_TEXT.RESET)
        })
        console.log("  Added command '" + COLOR_TEXT.CYAN + cmd.name + FORMAT_TEXT.RESET + "'\n" + FORMAT_TEXT.UNDERSCORE + "type" + FORMAT_TEXT.RESET + ": " + COLOR_TEXT.MAGENTA + CommandType[cmd.type] + FORMAT_TEXT.RESET + "\n" + FORMAT_TEXT.UNDERSCORE + "desc" + FORMAT_TEXT.RESET + ": " + cmd.description + "\n" + FORMAT_TEXT.UNDERSCORE + "path" + FORMAT_TEXT.RESET + ": http://localhost:" + APPPort + cmd.path + "\n")
    })
}