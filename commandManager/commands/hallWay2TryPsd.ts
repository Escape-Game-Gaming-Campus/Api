import { Request, Response } from "express";
import CommandType from "../../constants/commandType";
import { Command } from "../command";
import pusherManager from "../../pusherManager/pusherManager";
import { VarType } from "../../utils/doc";
import { psdKill } from "../../utils/enigms/hallWay2/passwordKill";
import { getInventory } from "../../utils/inventory";
import { objs } from "../../constants/object";

class HallWay2TryPsd extends Command {
  constructor() { super(); }

  public name: string = "Try PasswordPC HallWay2";
  public description: string = "Enigme scene de crime pour avoir une ampoule rouge";
  public path: string = "/hallWay2/tryPsd";
  public type: CommandType = CommandType.post;
  public data: { psd: VarType } = { psd: { type: "string", description: "Mot de passe a essayer", optional: false } };
  public out: { message: VarType } = { message: { type: "string", description: "message d'erreur/de succès", optional: false } };

  run(req: Request, res: Response) {
    if (req.body.psd === undefined) {
      res.status(400).json({ message: "Missing parameter: psd" });
      return;
    }
    if (typeof req.body.psd !== "string") {
      res.status(400).json({ message: "psd is not a string" });
      return;
    }
    if (req.body.psd.length != 4) {
      res.status(400).json({ message: "wrong size of psd" });
      return;
    }
    var psdValid = false;
    if (req.body.psd === psdKill.psd) {
      psdValid = true;
      getInventory.insert(objs[1]); //add ampoule rouge
      pusherManager.executePusher("updateInventory");
    }
    pusherManager.executePusher("hallWay2TryPsd", { psdValid: psdValid });

    res.status(202).json({ message: "Test in progress" });
  }
}

export = new HallWay2TryPsd();