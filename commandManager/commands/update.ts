import { Request, Response } from "express";
import CommandType from "../../constants/commandType";
import { Command } from "../command";
import pusherManager from "../../pusherManager/pusherManager";
import { psdPC } from "../../utils/enigms/ddust2/passwordpc";
import { VarType } from "../../utils/doc";
import { psdKill } from "../../utils/enigms/hallWay2/passwordKill";

class Update extends Command {
  constructor() { super(); }

  public name: string = "Update";
  public description: string = "Met à jour les clients (lancer à chaque fois qu'un client se (re)connecte, et au lancement de l'API)";
  public path: string = "/update";
  public type: CommandType = CommandType.get;
  public data: undefined = undefined;
  public out: { message: VarType } = { message: { type: "string", description: "message d'erreur/de succès", optional: false } };

  run(req: Request, res: Response) {
    pusherManager.executePusher("helloWorld");
    pusherManager.executePusher("notesChange");
    pusherManager.executePusher("updatePlayers");
    pusherManager.executePusher("updateInventory");
    pusherManager.executePusher("hallWay2TryPsd", { psdValid: psdKill.psdValid }, true);
    pusherManager.executePusher("ddust2TryPsd", { psdValid: psdPC.psdValid }, true);
    pusherManager.executePusher("updateLightbulbs");

    if (res === null) return console.log("Clients updated succesfully");
    res.status(200).json({ message: "Clients updated succesfully" });
  }
}

export = new Update();