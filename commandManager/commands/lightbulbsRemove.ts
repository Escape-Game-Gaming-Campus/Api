import { Request, Response } from "express";
import CommandType from "../../constants/commandType";
import { Command } from "../command";
import pusherManager from "../../pusherManager/pusherManager";
import { objs } from "../../constants/object";
import { VarType } from "../../utils/doc";
import { lightsBulbsBaseIndex, getLightbulbs } from "../../utils/lightbulbs";

class LightbulbsAdd extends Command {
  constructor() { super(); }

  public name: string = "Remove Bulb to list";
  public description: string = "Retire une ampoule à la liste";
  public path: string = "/lightbulbs/remove";
  public type: CommandType = CommandType.delete;
  public data: { bases: VarType } = { bases: { type: "number[]", description: "Numéro de la/les base(s) à vider", optional: false } };
  public out: { message: VarType } = { message: { type: "string", description: "message d'erreur/de succès", optional: false } };

  run(req: Request, res: Response) {
    var updated = false;
    if (!req.body.bases) {
      res.status(400).json({ message: "Missing parameter: bases" })
      return;
    }
    if (req.body.bases.length === 0) {
      res.status(400).json({ message: "Parameter bases is empty" })
      return;
    }
    req.body.bases.forEach((e: lightsBulbsBaseIndex) => {
      getLightbulbs.delete(e);
      updated = true;
    });
    if (updated) {
      pusherManager.executePusher("updateLightbulbs");
      res.status(200).json({ message: "Bulbs removed with success" });
    } else {
      res.status(404).json({ message: "Bulb not found" });
    }
  }
}

export = new LightbulbsAdd();