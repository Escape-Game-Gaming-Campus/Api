import { Request, Response } from "express";
import CommandType from "../../constants/commandType";
import { Command } from "../command";
import pusherManager from "../../pusherManager/pusherManager";
import { getNotes } from "../../utils/notes";
import { VarType } from "../../utils/doc";

class NotesChanges extends Command {
  constructor() { super(); }

  public name: string = "Notes changes";
  public description: string = "Change les notes de l'équipe";
  public path: string = "/notesChanges";
  public type: CommandType = CommandType.post;
  public data: { notes: VarType } = { notes: { type: "string", description: "La nouvelle note de l'équipe", optional: false } };
  public out: { message: VarType } = { message: { type: "string", description: "message d'erreur/de succès", optional: false } };

  run(req: Request, res: Response) {
    if (req.body.notes == undefined)
    {
      res.status(400).json({ message: "Missing parameter: notes" });
      return
    }
    if(typeof req.body.notes != "string")
    {
      res.status(400).json({ message: "Notes is not a string" });
      return
    }

    getNotes.notes = req.body.notes;
    pusherManager.executePusher("notesChange");

    res.status(200).json({ message: "Notes Changed" });
  }
}

export = new NotesChanges();