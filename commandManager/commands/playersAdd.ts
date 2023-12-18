import { Request, Response } from "express";
import CommandType from "../../constants/commandType";
import { Command } from "../command";
import pusherManager from "../../pusherManager/pusherManager";
import { getPlayers } from "../../utils/players";

class PlayersAdd extends Command {
  constructor() { super(); }

  public name: string = "New players";
  public description: string = "Add knew players";
  public path: string = "/players/add";
  public type: CommandType = CommandType.post;

  private goodVariables: boolean = true;

  run(req: Request, res: Response) {
    this.goodVariables = true;
    var updated = false;
    if (!req.body.players) {
      res.status(400).json({ success: false, message: "Missing parameter: players" })
      return;
    }
    if (req.body.players.length === 0) {
      res.status(400).json({ success: false, message: "Parameter players is empty" })
      return;
    }


    req.body.players.forEach((element: { "ID": number, "name": string, "position": Array<number> }) => {
      element.position.forEach((pos: any) => {
        if (typeof pos != "number") {
          this.goodVariables = false
        }
      })
      if (this.goodVariables) {
        getPlayers.insert(element);
        updated = true;
      }
      else
      {
        res.status(400).json({ success: false, message: "Position is not an Array<number>" });
        return;
      }
    });

    if(!this.goodVariables)return;

    if (updated) {
      pusherManager.executePusher("updatePlayers");
      res.status(200).json({ success: true, message: "Player added" });
    } else {
      res.status(404).json({ success: false, message: "Player not found" });
    }
  }
}

export = new PlayersAdd();