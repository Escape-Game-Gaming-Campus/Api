import { Request, Response } from "express";
import CommandType from "../../constants/commandType";
import { Command } from "../command";
import { getPlayers } from "../../utils/players";

class PlayersAdd extends Command {
  constructor() { super(); }

  public name: string = "Get players";
  public description: string = "Get players";
  public path: string = "/players/get";
  public type: CommandType = CommandType.get;

  run(req: Request, res: Response) {
    res.status(200).json({players : getPlayers.sortByPLayeriD(), message: "Players get"});
  }
}

export = new PlayersAdd();