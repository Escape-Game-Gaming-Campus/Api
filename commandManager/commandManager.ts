import { readdirSync } from "fs";
import { Command } from "./command";
import { BG_COLOR_TEXT, COLOR_TEXT, FORMAT_TEXT } from "../utils/colors";
import { APPPort, app } from "..";
import CommandType from "../utils/commandType";

export default function CommandManager() {
    console.log(BG_COLOR_TEXT.RED + "Loading commands..." + FORMAT_TEXT.RESET + "\n")
    readdirSync("./commandManager/commands/").forEach(file => {
        if(!file.endsWith(".js")) return;
        let cmd : Command = require("./commands/" + file)
        app[CommandType[cmd.type] as "get"](cmd.path, async (req, res) => {
            cmd.run(req, res)
        })
        console.log("  Added command '" + COLOR_TEXT.CYAN + cmd.name + FORMAT_TEXT.RESET + "'\ndesc: " + cmd.description + "\npath: http://localhost:" + APPPort + cmd.path + "\n")
    })
}