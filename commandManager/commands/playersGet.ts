import { Request, Response } from "express";
import CommandType from "../../constants/commandType";
import { Command } from "../command";
import { getPlayers } from "../../utils/players";
import Player from "../../constants/players";
import pusherManager from "../../pusherManager/pusherManager";
import { VarType } from "../../utils/doc";

class PlayersGet extends Command {
  constructor() { super(); }

  public name: string = "Get players";
  public description: string = "Get tout les players ou un player en particulier";
  public path: string = "/players/get";
  public type: CommandType = CommandType.get;
  public data: { ID: VarType, name: VarType } = { ID: {type: "number", description: "L'id du player à get", optional: true}, name: {type: "string", description: "Le nom du player à get", optional: true} };
  public out: { players : [{ ID: VarType, name: VarType, position: VarType }], message: VarType } = { players: [{ ID: {type: "number", description: "L'id du player get", optional: false}, name: {type: "string", description: "le nom du player", optional: false}, position: {type: "number[]", description: "Liste de 3 valeurs tels un Vect3 correspondant au positions du joueur", optional: false} }], message: { type: "string", description: "message d'erreur/de succès", optional: false } };

  run(req: Request, res: Response) {
    pusherManager.executePusher("updatePlayers");
    if (!req.body.ID || !req.body.name)
    {
      res.status(200).json({players : getPlayers.sortByPLayeriD(), message: "Players get"});
      return;
    }
    else 
    {
      getPlayers.sortByPLayeriD().forEach((el : Player) => {
        if ((el.ID == req.body.ID && el.name == req.body.name) || (el.ID == req.body.ID && req.body.name === undefined) || (el.name == req.body.name && req.body.ID === undefined))
        {
          res.status(200).json({players : [el], message: "Player get"});
          return;
        }
      })
    }
    res.status(404).json({ message: "Player not found" });
  }
}

export = new PlayersGet();