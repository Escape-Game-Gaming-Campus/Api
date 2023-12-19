import { Request, Response } from "express";
import CommandType from "../../constants/commandType";
import { Command } from "../command";
import pusherManager from "../../pusherManager/pusherManager";
import { VarType } from "../../utils/doc";

class HelloWorld extends Command {
  constructor() { super(); }

  public name: string = "Hello world";
  public description: string = "Renvoie \"Hello world!\"";
  public path: string = "/helloWorld";
  public type: CommandType = CommandType.get;

  // Format d'entrée de la commande
  public data: undefined = undefined;

  // Format de sortie de la commande
  public out: { message: VarType } = { message: {type: "string", description: "Retourne \"Hello world!\"", optional: false} };

    /*
    NOTE: Pour set un format, vous devez mettre votre syntaxe, et à la place du type de votre/vos variable(s),
          vous devez mettre VarType, et compléter les infos qui lui sont relatives, et ceux de la même manière que le out ci-dessus.
    */

  run(req: Request, res: Response) {
    pusherManager.executePusher("helloWorld");

    res.status(200).json({ message: "Hello world!" });
  }
}

export = new HelloWorld();