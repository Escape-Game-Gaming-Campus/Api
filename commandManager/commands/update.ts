import { Request, Response } from "express";
import CommandType from "../../constants/commandType";
import { Command } from "../command";
import pusherManager from "../../pusherManager/pusherManager";
import { psdPC } from "../../utils/enigms/ddust2/passwordpc";

class Update extends Command {
  constructor() { super(); }

  public name: string = "Update";
  public description: string = "Updates the client";
  public path: string = "/update";
  public type: CommandType = CommandType.get;

  run(req: Request, res: Response) {
    pusherManager.executePusher("helloWorld");
    pusherManager.executePusher("notesChange");
    pusherManager.executePusher("updateInventory");
    pusherManager.executePusher("ddust2TryPsd", { psdValid: psdPC.psdValid }, true);

    if (res === null) return console.log("Clients updated succesfully");
    res.status(200).json({ message: "Clients updated succesfully" });
  }
}

export = new Update();