import { readFileSync, readdirSync } from "fs";
import pusherClass from "../pusherManager/pusher";
import pusherChannels from "../constants/pusherChannels";
import { Command } from "../commandManager/command";
import CommandType from "../constants/commandType";
import * as AppConfig from '../constants/appConfig.json';

export type allType = "string" | "number" | "boolean" | "string | number" | "string | boolean" | "number | boolean" | "string | number | boolean" | "string[]" | "number[]" | "boolean[]" | "(string | number)[]" | "(string | boolean)[]" | "(number | boolean)[]" | "(string | number | boolean)[]"
export type VarType = {
    type: allType,
    description: string,
    optional: boolean
}

export class genDoc {
    private docCmd: string = "# Commands\n\n"
    private docPsh: string = "# Pusher\n\n"
    private incrementationSymbol: [string, string] = ["│".repeat(1), "↳"];

    constructor() {
        var cmds: Command[] = [];
        var pshsInCmds: {[cmdName: string]: string[]} = {};
        readdirSync("./commandManager/commands/").forEach(file => {
            if (!file.endsWith(".js")) return;
            function readFile(data: string, cmd: Command) {
                var dt = data.split("pusherManager_1.default.executePusher(\"");
                dt.shift();
                pshsInCmds[cmd.name] = []
                dt.forEach(e => {
                    var pshName = e.split("\"")[0];
                    pshsInCmds[cmd.name].push(pshName);
                })
            }
            const fil = readFileSync("./commandManager/commands/" + file, "utf8")
            let cmd: Command = require("../commandManager/commands/" + file)
            readFile(fil, cmd);
            cmds.push(cmd);
        })
        Object.keys(CommandType).forEach(type => {
            var oneFinded = false;
            cmds.forEach(cmdFinded => {
                if (Object.keys(CommandType)[Object.values(CommandType).findIndex((e, i) => cmdFinded.type === e)] == type) {
                    if (!oneFinded) {
                        this.docCmd += "## " + type.toUpperCase() + "\n\n"
                        oneFinded = true;
                    }

                    this.docCmd += "\n\n### **" + cmdFinded.name + "**\n\n"
                    this.docCmd += cmdFinded.description + "\n\n"
                    this.docCmd += "- __Path__: [" + cmdFinded.path + "](" + AppConfig.API.HOST + ":" + AppConfig.API.PORT + cmdFinded.path + ")\n"
                    this.docCmd += "- __Input__: "
                    var temp = this.getType(cmdFinded.data)
                    if (temp !== "undefined") this.docCmd += "\n\n" + temp
                    else this.docCmd += "Aucun\n"
                    this.docCmd += "- __Output__: "
                    temp = this.getType(cmdFinded.out)
                    if (temp !== "undefined") this.docCmd += "\n\n" + temp
                    else this.docCmd += "Aucun\n"
                    this.docCmd += "- __Utilisation de Pusher__: "
                    pshsInCmds[cmdFinded.name] = pshsInCmds[cmdFinded.name].map(e => {
                        return "[" + e + "](Pusher.md#" + e.toLowerCase() + ")"
                    })
                    if (pshsInCmds[cmdFinded.name].length > 0) {
                        this.docCmd += pshsInCmds[cmdFinded.name].join(" ") + "\n"
                    }
                    else this.docCmd += "Non\n"
                }
            })
        })


        var pshs: pusherClass[] = [];
        readdirSync("./pusherManager/pushers/").forEach(file => {
            if (!file.endsWith(".js")) return;
            let psh: pusherClass = require("../pusherManager/pushers/" + file)
            pshs.push(psh);
        })
        Object.keys(pusherChannels).forEach(channel => {
            var oneFinded = false;
            pshs.forEach(pusherFinded => {
                if (Object.keys(pusherChannels)[Object.values(pusherChannels).findIndex((e, i) => pusherFinded.channel === e)] == channel) {
                    if (!oneFinded) {
                        this.docPsh += "## " + channel + "\n\n"
                        oneFinded = true;
                    }

                    this.docPsh += "\n\n### **" + pusherFinded.eventName + "**\n\n"
                    this.docPsh += pusherFinded.description + "\n\n"
                    this.docPsh += "- __Input__: "
                    var temp = this.getType(pusherFinded.data)
                    if (temp !== "undefined") this.docPsh += "\n\n" + temp
                    else this.docPsh += "Aucun\n"
                    this.docPsh += "- __Output__: "
                    temp = this.getType(pusherFinded.out)
                    if (temp !== "undefined") this.docPsh += "\n\n" + temp
                    else this.docPsh += "Aucun\n"
                }
            })
        })
    }

    public getDoc(): [string, string] {
        return [this.docCmd, this.docPsh];
    }

    public getType(obj: any | VarType): string {
        if (obj === undefined) return "undefined";

        var nobj = JSON.parse(JSON.stringify(obj));
        const table = this.getTableType(nobj);
        var mobj = JSON.parse(JSON.stringify(obj));
        const json = this.getJsonType(mobj);

        if (table === "undefined" && json === "undefined") return "undefined";

        var res: string = "<tabs group=\"JsonOrTable\">\n  <tab group-key=\"Table\" title=\"Tableau\">\n\n";
        res += table === "undefined" ? "Aucun" : table;
        res += "\n  </tab><tab group-key=\"Json\" title=\"JSON\">\n\n";
        res += json === "undefined" ? "Aucun" : json;
        return res + "\n  </tab>\n</tabs>\n\n"
    }

    public getJsonType(obj: any | VarType): string {
        if (obj === undefined) return "undefined";
        if (typeof obj === "object") {
            var isVarType: boolean = false;
            try {
                isVarType = typeof obj.type === "string" && typeof obj.description === "string" && typeof obj.optional === "boolean"
            } catch (err) {}

            if (isVarType) {
                return obj.type;
            } else {
                var res: string = "{\n";
                Object.keys(obj).forEach(key => {
                    var temp = this.getJsonType(obj[key]).replace("```json\n", "").replace("\n```", "");
                    try {
                        obj[key] = JSON.parse(temp);
                    } catch (err) {
                        obj[key] = temp;
                    }
                })
            }

        }
        var res: string | "" = JSON.stringify(obj, null, 2);
        return "```json\n" + res + "\n```"
    }

    public getTableType(obj: any | VarType): string {
        var res: string | "" = this.getRowTableType("{ }", obj);
        if (res === "") return "undefined";
        var isVarType: boolean = false;
        try {
            isVarType = typeof obj.type === "string" && typeof obj.description === "string" && typeof obj.optional === "boolean"
        } catch (err) {}
        if (isVarType)
        {
            res = "| Type | Description | optional |\n| --- | --- | --- |\n" + res.replace("|  |  |", "|");
        }
        else
        {
            res = "| | Nom | Type | Description | optional |\n| --- | --- | --- | --- | --- |\n" + res;
        }
        return res
    }

    // récupère le type d'un objet, et le retourne sous forme de tableau md avec le nom, le type de résultat, la description et s'il est requis ou non
    private getRowTableType(name: string, obj: any | VarType, childNum: number = 0): string {
        var res: string = "";
        var isVarType: boolean = false;
        try {
            isVarType = typeof obj.type === "string" && typeof obj.description === "string" && typeof obj.optional === "boolean"
        } catch (err) {}
        if (typeof obj === "object" && !isVarType) {
            res += "| " + this.incrementationSymbol[0].repeat(Math.max(0, childNum -1)) + (childNum ? this.incrementationSymbol[1] : "") + " | "
            if (obj[0] === undefined) {
                res += name + " | object { }"
            } else {
                res += name.replace("{ }", "[ ]") + " | list [ ]"
            }
            res += " |  |  |\n"
            Object.keys(obj).forEach(key => {
                if (obj[0] === undefined) {
                    res += this.getRowTableType(key, obj[key], childNum + 1)
                } else {
                    res += this.getRowTableType("[ ]", obj[key], childNum + 1)
                }
            })
        }
        else if (isVarType) {
            res += "| " + this.incrementationSymbol[0].repeat(Math.max(0, childNum -1)) + (childNum ? this.incrementationSymbol[1] : "") + " | " + name + " | " + obj.type.replaceAll("|", "OR").replaceAll("[]", "[ ]") + " | " + obj.description + " | " + obj.optional + " |\n"
        }
        else {
            return "";
        }
        return res;
    }
}