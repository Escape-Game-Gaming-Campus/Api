import { Request, Response } from "express";
import CommandType from "../../constants/commandType";
import { Command } from "../command";
import { getPlayers } from "../../utils/players";
import Player from "../../constants/players";
import pusherManager from "../../pusherManager/pusherManager";
import { VarType } from "../../utils/doc";

class MasterMind extends Command {
  constructor() { super(); }

  public name: string = "Get Data";
  public description: string = "Get data des bases";
  public path: string = "/mastermind/get";
  public type: CommandType = CommandType.get;
  public data: any = {};
  public out: any = {};

  run(req: Request, res: Response) {
    pusherManager.executePusher("updateMasterMind");
    // if (!req.body.ID || !req.body.name)
    // {
    //   res.status(200).json({players : getPlayers.sortByPLayeriD(), message: "Players get"});
    //   return;
    // }
    // else 
    // {
    //   getPlayers.sortByPLayeriD().forEach((el : Player) => {
    //     if ((el.ID == req.body.ID && el.name == req.body.name) || (el.ID == req.body.ID && req.body.name === undefined) || (el.name == req.body.name && req.body.ID === undefined))
    //     {
    //       res.status(200).json({players : [el], message: "Player get"});
    //       return;
    //     }
    //   })
    // }
    // res.status(404).json({ message: "Player not found" });
  }
}

export = new MasterMind();