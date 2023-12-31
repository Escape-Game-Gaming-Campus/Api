import { Request, Response } from "express";
import CommandType from "../../constants/commandType";
import { Command } from "../command";
import pusherManager from "../../pusherManager/pusherManager";
import { getPlayers } from "../../utils/players";
import { VarType } from "../../utils/doc";

class PlayersAdd extends Command {
  constructor() { super(); }

  public name: string = "New players";
  public description: string = "Ajoute des joueurs (par leur nom ou leur id)";
  public path: string = "/players/add";
  public type: CommandType = CommandType.post;
  public data: { players: [ {ID : VarType, name : VarType, position: VarType} ] } = { players: [{ ID: {type: "number", description: "L'id du player à détruire (facultatif si utilise le name)", optional: false}, name: {type: "string", description: "Le nom du player à détruire (facultatif si utilise l'id)", optional: false}, position: {type: "number[]", description: "3 nombres tels un vect3 qui définissent la position du joueur", optional: false} }] };
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

    var goodsVariables = true;
    req.body.players.forEach((element: { ID: number, name: string, position: Array<number> }) => {

      var goodVariables = true;
      element.position.forEach((pos: any) => {
        if (typeof pos != "number") {
          goodVariables = false;
        }
      })
      if (goodVariables) {
        getPlayers.insert(element);
        updated = true;
      }
      else
      {
        if (!goodsVariables) return;
        goodsVariables = false;
        res.status(400).json({ message: `Position is not an Array<number> for ${element.name}`});
        return;
      }
    });

    if(!goodsVariables) return;

    if (updated) {
      pusherManager.executePusher("updatePlayers");
      res.status(200).json({ message: "Player added" });
    } else {
      res.status(404).json({ message: "Player not found" });
    }
  }
}

export = new PlayersAdd();