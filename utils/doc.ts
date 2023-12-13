import { readdirSync } from "fs";
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
        readdirSync("./commandManager/commands/").forEach(file => {
            if (!file.endsWith(".js")) return;
            let cmd: Command = require("../commandManager/commands/" + file)
            cmds.push(cmd);
        })
        Object.keys(CommandType).forEach(type => {
            var oneFinded = false;
            console.log(type)
            cmds.forEach(cmdFinded => {
                if (Object.keys(CommandType)[Object.values(CommandType).findIndex((e, i) => cmdFinded.type === e)] == type) {
                    if (!oneFinded) {
                        this.docCmd += "## " + type.toUpperCase() + "\n\n"
                        oneFinded = true;
                    }

                    this.docCmd += "\n\n### **" + cmdFinded.name + "**\n\n"
                    this.docCmd += cmdFinded.description + "\n\n"
                    this.docCmd += "- __Path__: [" + cmdFinded.path + "](" + AppConfig.API_HOST + ":" + AppConfig.API_PORT + cmdFinded.path + ")\n"
                    this.docCmd += "- __Input__: "
                    var temp = this.getGlobalType(cmdFinded.data)
                    if (temp !== "undefined") this.docCmd += "\n\n" + temp
                    else this.docCmd += "Aucune\n"
                    this.docCmd += "- __Output__: "
                    temp = this.getGlobalType(cmdFinded.out)
                    if (temp !== "undefined") this.docCmd += "\n\n" + temp
                    else this.docCmd += "Aucune\n"
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
                    var temp = this.getGlobalType(pusherFinded.data)
                    if (temp !== "undefined") this.docPsh += "\n\n" + temp
                    else this.docPsh += "Aucune\n"
                    this.docPsh += "- __Output__: "
                    temp = this.getGlobalType(pusherFinded.out)
                    if (temp !== "undefined") this.docPsh += "\n\n" + temp
                    else this.docPsh += "Aucune\n"
                }
            })
        })
    }

    public getDoc(): [string, string] {
        return [this.docCmd, this.docPsh];
    }

    public getGlobalType(obj: any | VarType): string {
        var res: string | "" = this.getType("{ }", obj);
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
    private getType(name: string, obj: any | VarType, childNum: number = 0): string {
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
                    res += this.getType(key, obj[key], childNum + 1)
                } else {
                    res += this.getType("[ ]", obj[key], childNum + 1)
                }
            })
        }
        else if (obj != undefined) {
            res += "| " + this.incrementationSymbol[0].repeat(Math.max(0, childNum -1)) + (childNum ? this.incrementationSymbol[1] : "") + " | " + name + " | " + obj.type.replaceAll("|", "OR").replaceAll("[]", "[ ]") + " | " + obj.description + " | " + obj.optional + " |\n"
        }
        else {
            return "";
        }
        return res;
    }
}