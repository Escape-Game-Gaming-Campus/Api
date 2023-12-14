import { Request, Response } from "express";
import CommandType from "../../constants/commandType";
import { Command } from "../command";
import pusherManager from "../../pusherManager/pusherManager";
import { getInventory } from "../../utils/inventory";
import { objs } from "../../constants/object";
import { VarType } from "../../utils/doc";

class InventoryAdd extends Command {
  constructor() { super(); }

  public name: string = "Add to inventory";
  public description: string = "Ajoute un objet à l'inventaire";
  public path: string = "/inv/add";
  public type: CommandType = CommandType.post;
  public data: { objs: { name: VarType, uuid: VarType }[] } = { objs: [{ name: { type: "string", description: "Nom de l'objet à ajouter (facultatif si utilise le UUID)", optional: false }, uuid: { type: "number", description: "UUID de l'objet à ajouter (facultatif si utilise le nom)", optional: false } }] };
  public out: { message: VarType } = { message: { type: "string", description: "message d'erreur/de succès", optional: false } };

  run(req: Request, res: Response) {
    var endForeach = false;
    var updated = false;
    if (!req.body.objs) {
      res.status(400).json({ message: "Missing parameter: objs" })
      return;
    }
    if (req.body.objs.length === 0) {
      res.status(400).json({ message: "Parameter objs is empty" })
      return;
    }
    req.body.objs.forEach((e: { name: string, uuid?: number } | { name?: string, uuid: number }, i: number) => {
      objs.forEach(obj => {
        if (endForeach) return;
        if (obj.UUID === e.uuid) {
          getInventory.insert(obj);
          endForeach = true;
          updated = true;
        }
        if (obj.name === e.name) {
          getInventory.insert(obj);
          endForeach = true;
          updated = true;
        }
      });
      endForeach = false;
    });
    if (updated) {
      pusherManager.executePusher("updateInventory");
      res.status(200).json({ message: "Item added with sucess" });
    } else {
      res.status(404).json({ message: "Item not found" });
    }
  }
}

export = new InventoryAdd();