import { Request, Response } from "express";
import CommandType from "../../utils/commandType";
import { Command } from "../command";
import pusherManager from "../../pusherManager/pusherManager";

class InventoryAdd extends Command {
  constructor() { super(); }

  public name: string = "Add to inventory";
  public description: string = "Adds an item to the inventory";
  public path: string = "/inventory/add";
  public type: CommandType = CommandType.post;

  run(req: Request, res: Response) {
  }
}

export = new InventoryAdd();