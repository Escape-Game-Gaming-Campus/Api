import { Request, Response } from "express";
import CommandType from "../../constants/commandType";
import { Command } from "../command";
import pusherManager from "../../pusherManager/pusherManager";
import { getPlayers } from "../../utils/players";
import { VarType } from "../../utils/doc";

class PlayersRemove extends Command {
  constructor() { super(); }

  public name: string = "Delete players";
  public description: string = "Supprime des joueurs (par leur nom ou leur id)";
  public path: string = "/players/delete";
  public type: CommandType = CommandType.post;
  public data: { players: [ {ID : VarType, name : VarType} ] } = { players: [{ ID: {type: "number", description: "L'id du player à détruire (facultatif si utilise le name)", optional: false}, name: {type: "string", description: "Le nom du player à détruire (facultatif si utilise l'id)", optional: false} }] };
  public out: { message: VarType } = { message: { type: "string", description: "message d'erreur/de succès", optional: false } };

  run(req: Request, res: Response) {
    var updated = false;
    if (!req.body.players) {
      res.status(400).json({ message: "Missing parameter: players" })
      return;
    }
    if (req.body.players.length === 0) {
      res.status(400).json({ message: "Parameter players is empty" })
      return;
    }
    req.body.players.forEach((element : {ID : number, name : string}) => {
        getPlayers.array.forEach((e) => {
          if (element.name === e.name || element.ID === e.ID)
          {
            getPlayers.delete(e);
            updated = true;
          }
        })
    });

    if (updated) {
      pusherManager.executePusher("updatePlayers");
      res.status(200).json({ message: "Player removed" });
    } else {
      res.status(404).json({  message: "Player not found" });
    }
  }
}

export = new PlayersRemove();