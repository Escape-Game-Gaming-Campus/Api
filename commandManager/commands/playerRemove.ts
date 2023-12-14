import { Request, Response } from "express";
import CommandType from "../../constants/commandType";
import { Command } from "../command";
import pusherManager from "../../pusherManager/pusherManager";
import { getPlayers } from "../../utils/players";

class PlayersRemove extends Command {
  constructor() { super(); }

  public name: string = "Delete players";
  public description: string = "Delete players";
  public path: string = "/players/delete";
  public type: CommandType = CommandType.post;

  run(req: Request, res: Response) {
    var updated = false;
    if (!req.body.players) {
      res.status(400).json({ success: false, message: "Missing parameter: players" })
      return;
    }
    if (req.body.players.length === 0) {
      res.status(400).json({ success: false, message: "Parameter players is empty" })
      return;
    }
    req.body.players.forEach((element : {"ID" : number, "name" : string, "transform" : any}) => {
        getPlayers.array.forEach((e) => {
          if (element.name === e.name && element.transform === e.transform)
          {
            getPlayers.delete(e);
            updated = true;
          }
        })
    });

    if (updated) {
      pusherManager.executePusher("updatePlayers");
      res.status(200).json({ success: true, message: "Player removed" });
    } else {
      res.status(404).json({ success: false, message: "Player not found" });
    }
  }
}

export = new PlayersRemove();