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
  public description: string = "Adds an item to the inventory";
  public path: string = "/inv/add";
  public type: CommandType = CommandType.post;
  public data: { objs: { name: VarType, uuid: VarType }[] } = { objs: [{ name: { type: "string", description: "The name of the object to add", optional: true }, uuid: { type: "number", description: "The uuid of the object to add", optional: true } }] };
  public out: { success: VarType, message?: VarType } = { success: { type: "boolean", description: "If the item was added", optional: false }, message: { type: "string", description: "The message to display", optional: true } };

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
      res.status(200).json({ success: true });
    } else {
      res.status(404).json({ success: false, message: "Item not found" });
    }
  }
}

export = new InventoryAdd();