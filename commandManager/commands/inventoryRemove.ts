import { Request, Response } from "express";
import CommandType from "../../constants/commandType";
import { Command } from "../command";
import pusherManager from "../../pusherManager/pusherManager";
import { getInventory } from "../../utils/inventory";

class InventoryRemove extends Command {
  constructor() { super(); }

  public name: string = "Remove to inventory";
  public description: string = "Removes an item to the inventory";
  public path: string = "/inv/remove";
  public type: CommandType = CommandType.delete;

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
      pusherManager.executePusher("updateInventory");
      res.status(200).json({ success: true });
    } else {
      res.status(404).json({ success: false, message: "Item not found" });
    }
  }
}

export = new InventoryRemove();