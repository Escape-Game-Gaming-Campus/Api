import { Request, Response } from "express";
import CommandType from "../../constants/commandType";
import { Command } from "../command";
import pusherManager from "../../pusherManager/pusherManager";
import notes, { changeNotes } from "../../utils/notes";

class NotesChanges extends Command {
  constructor() { super(); }

  public name: string = "Notes changes";
  public description: string = "Change notes informations from players";
  public path: string = "/notesChanges";
  public type: CommandType = CommandType.post;

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

    changeNotes(req.body.notes);
    pusherManager.executePusher("notesChange");

    res.status(200).json({ message: "Notes Changed" });
  }
}

export = new NotesChanges();