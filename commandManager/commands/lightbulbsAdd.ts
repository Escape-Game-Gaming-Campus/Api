import { Request, Response } from "express";
import CommandType from "../../constants/commandType";
import { Command } from "../command";
import pusherManager from "../../pusherManager/pusherManager";
import { objs } from "../../constants/object";
import { VarType } from "../../utils/doc";
import { lightsBulbsBaseIndex, getLightbulbs } from "../../utils/lightbulbs";

class LightbulbsAdd extends Command {
  constructor() { super(); }

  public name: string = "Add Bulb to list";
  public description: string = "Ajoute une ampoule à la liste";
  public path: string = "/lightbulbs/add";
  public type: CommandType = CommandType.post;
  public data: { objs: { name: VarType, uuid: VarType, base:VarType}[] } = { objs: [{ name: { type: "string", description: "Nom de l'ampoule à poser (facultatif si utilise le UUID)", optional: false }, uuid: { type: "number", description: "UUID de l'ampoule à poser (facultatif si utilise le nom)", optional: false }, base: {type: "number",description: "numéro du socle sur lequel est l'ampoule (0 | 1 | 2)", optional: false} }] };
  public out: { message: VarType } = { message: { type: "string", description: "message d'erreur/de succès", optional: false } };

  run(req: Request, res: Response) {
    var endForeach = false;
    var updated = false;
    var baseSet = true;
    if (!req.body.objs) {
      res.status(400).json({ message: "Missing parameter: objs" })
      return;
    }
    if (req.body.objs.length === 0) {
      res.status(400).json({ message: "Parameter objs is empty" })
      return;
    }
    req.body.objs.forEach((e: { name: string, uuid?: number, base?: lightsBulbsBaseIndex } | { name?: string, uuid: number, base?: lightsBulbsBaseIndex }, i: number) => {
      if (e.base === undefined) {
        baseSet = false;
      }
    })
    if (!baseSet) {
      res.status(400).json({ message: "Parameter base is empty on minimum of 1 bulb" })
      return;
    }
    req.body.objs.forEach((e: { name: string, uuid?: number, base: lightsBulbsBaseIndex } | { name?: string, uuid: number, base: lightsBulbsBaseIndex }, i: number) => {
      objs.forEach(obj => {
        if (endForeach) return;
        if (obj.UUID === e.uuid) {
          getLightbulbs.insert(obj, e.base);
          endForeach = true;
          updated = true;
        } else if (obj.name === e.name) {
          getLightbulbs.insert(obj, e.base);
          endForeach = true;
          updated = true;
        }
      });
      endForeach = false;
    });
    if (updated) {
      pusherManager.executePusher("updateLightbulbs");
      pusherManager.executePusher("updateInventory");
      res.status(200).json({ message: "Bulbs added with success" });
    } else {
      res.status(404).json({ message: "Bulb not found" });
    }
  }
}

export = new LightbulbsAdd();