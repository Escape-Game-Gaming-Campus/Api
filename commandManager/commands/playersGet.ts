import { Request, Response } from "express";
import CommandType from "../../constants/commandType";
import { Command } from "../command";
import { getPlayers } from "../../utils/players";
import Player from "../../constants/players";

class PlayersGet extends Command {
  constructor() { super(); }

  public name: string = "Get players";
  public description: string = "Get players";
  public path: string = "/players/get";
  public type: CommandType = CommandType.get;

  run(req: Request, res: Response) {
    if (!req.body.ID)
    {
      res.status(200).json({players : getPlayers.sortByPLayeriD(), message: "Players get"});
    }
    else 
    {
      getPlayers.sortByPLayeriD().forEach((el : Player) => {
        if (el.ID ==req.body.ID)
        {
          res.status(200).json({players : el, message: "Player get"});
          return;
        }
      })
    }
  }
}

export = new PlayersGet();