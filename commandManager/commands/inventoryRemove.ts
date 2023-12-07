import { Request, Response } from "express";
import CommandType from "../../utils/commandType";
import { Command } from "../command";
import pusherManager from "../../pusherManager/pusherManager";

class InventoryRemove extends Command {
  constructor() { super(); }

  public name: string = "Remove to inventory";
  public description: string = "Removes an item to the inventory";
  public path: string = "/inventory/remove";
  public type: CommandType = CommandType.delete;

  run(req: Request, res: Response) {
  }
}

export = new InventoryRemove();