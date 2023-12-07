import { Request, Response } from "express";
import CommandType from "../../utils/commandType";
import { Command } from "../command";
import pusherManager from "../../pusherManager/pusherManager";

class HelloWorld extends Command {
  constructor() { super(); }

  public name: string = "Hello world";
  public description: string = "Sends a hello world message to the client";
  public path: string = "/helloWorld";
  public type: CommandType = CommandType.get;

  run(req: Request, res: Response) {
    pusherManager.executePusher("helloWorld");

    res.status(200).json({ message: "Hello world!" });
  }
}

export = new HelloWorld();