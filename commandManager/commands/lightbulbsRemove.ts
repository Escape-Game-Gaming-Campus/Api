import { Request, Response } from "express";
import CommandType from "../../constants/commandType";
import { Command } from "../command";
import pusherManager from "../../pusherManager/pusherManager";
import { getInventory } from "../../utils/inventory";
import { VarType } from "../../utils/doc";

class LightbulbsRemove extends Command {
  constructor() { super(); }

  public name: string = "Remove from list";
  public description: string = "Retire un objet de la liste";
  public path: string = "/lightbulb/remove";
  public type: CommandType = CommandType.delete;
  public data: { objs: { name: VarType, uuid: VarType, base:VarType}[] } = { objs: [{ name: { type: "string", description: "Nom de l'objet à ajouter (facultatif si utilise le UUID)", optional: false }, uuid: { type: "number", description: "UUID de l'objet à ajouter (facultatif si utilise le nom)", optional: false },base: {type: "number",description: "numéro du socle sur lequel l'ampoule est",optional: true} }] };
  public out: { message: VarType } = { message: { type: "string", description: "message d'erreur/de succès", optional: false } };

  run(req: Request, res: Response) {
    var endForeach = false;
    var updated = false;
    if (!req.body.objs) {
      res.status(400).json({ success: false, message: "Missing parameter: objs" })
      return;
    }
    if (req.body.objs.length === 0) {
      res.status(400).json({ success: false, message: "Parameter objs is empty" })
      return;
    }
    req.body.objs.forEach((e: { name: string, uuid?: number } | { name?: string, uuid: number }, i: number) => {
      getInventory.array.forEach((obj, i) => {
        if (endForeach) return;
        if (obj.UUID === e.uuid) {
          getInventory.delete(obj);
          endForeach = true;
          updated = true;
        }
        if (obj.name === e.name) {
          getInventory.delete(obj);
          endForeach = true;
          updated = true;
        }
      });
      endForeach = false;
    });
    if (updated) {
      pusherManager.executePusher("updateLightbulbs");
      res.status(200).json({ success: true });
    } else {
      res.status(404).json({ success: false, message: "Item not found" });
    }
  }
}

export = new LightbulbsRemove();