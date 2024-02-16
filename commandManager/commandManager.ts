import { readdirSync } from "fs";
import { Command } from "./command";
import { BG_COLOR_TEXT, COLOR_TEXT, FORMAT_TEXT } from "../constants/colors";
import { APPPort, app } from "..";
import CommandType from "../constants/commandType";
import AppConfig from "../constants/AppConfig.json";

export default function CommandManager() {
    console.log(BG_COLOR_TEXT.RED + "Loading commands..." + FORMAT_TEXT.RESET)
    if (AppConfig.DetailLogs)
    {
        console.log("\n")
    }
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

            if (AppConfig.DetailLogs)
            {
                console.log("\n" + COLOR_TEXT.GRAY + "[" + formatDate.split(" ").join("-") + "] " + COLOR_TEXT.GREEN + "Command" + FORMAT_TEXT.RESET + " | " + COLOR_TEXT.GRAY + "Started" + FORMAT_TEXT.RESET + " | " + COLOR_TEXT.CYAN + req.method + FORMAT_TEXT.RESET + " " + COLOR_TEXT.YELLOW + req.path + FORMAT_TEXT.RESET + " from " + COLOR_TEXT.GREEN + req.ip + FORMAT_TEXT.RESET)
            }
            cmd.run(req, res)
            if (AppConfig.DetailLogs)
            {
                console.log(COLOR_TEXT.GRAY + "[" + formatDate.split(" ").join("-") + "] " + COLOR_TEXT.GREEN + "Command" + FORMAT_TEXT.RESET + " | " + COLOR_TEXT.GRAY + " Ended " + FORMAT_TEXT.RESET + " | " + COLOR_TEXT.CYAN + req.method + FORMAT_TEXT.RESET + " " + COLOR_TEXT.YELLOW + req.path + " " + COLOR_TEXT.MAGENTA + res.statusCode + FORMAT_TEXT.RESET + " from " + COLOR_TEXT.GREEN + req.ip + COLOR_TEXT.GRAY + (JSON.stringify(res.headersSent).length > 50 ? "\n" + " ".repeat(28) + JSON.stringify(res.headersSent, null, 2).split("\n").join("\n" + " ".repeat(28)) : " " + JSON.stringify(res.headersSent)) + FORMAT_TEXT.RESET)
            } else {
                console.log(COLOR_TEXT.GRAY + "[" + formatDate.split(" ").join("-") + "] " + COLOR_TEXT.GREEN + "Command" + FORMAT_TEXT.RESET + " | " + COLOR_TEXT.CYAN + req.method + FORMAT_TEXT.RESET + " " + COLOR_TEXT.YELLOW + req.path + " " + COLOR_TEXT.MAGENTA + res.statusCode + FORMAT_TEXT.RESET + " from " + COLOR_TEXT.GREEN + req.ip + FORMAT_TEXT.RESET)
            }
            return;
        })
        if (AppConfig.DetailLogs)
        {
            console.log("  Added command '" + COLOR_TEXT.CYAN + cmd.name + FORMAT_TEXT.RESET + "'\n" + FORMAT_TEXT.UNDERSCORE + "type" + FORMAT_TEXT.RESET + ": " + COLOR_TEXT.MAGENTA + CommandType[cmd.type] + FORMAT_TEXT.RESET + "\n" + FORMAT_TEXT.UNDERSCORE + "desc" + FORMAT_TEXT.RESET + ": " + cmd.description + "\n" + FORMAT_TEXT.UNDERSCORE + "path" + FORMAT_TEXT.RESET + ": " + AppConfig.API.HOST + ":" + APPPort + cmd.path + "\n")
        } else {
            console.log("Added command '" + COLOR_TEXT.CYAN + cmd.name + "'" + FORMAT_TEXT.RESET)
        }
    })
}