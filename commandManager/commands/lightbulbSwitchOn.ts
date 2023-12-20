import lights from '../../utils/lights';
import { Request, Response } from "express";
import CommandType from "../../constants/commandType";
import { Command } from "../command";
import { VarType } from "../../utils/doc";

class LightbulbSwitchOn extends Command {
    constructor() { super(); }
  
    public name: string = "Switch on a lightbulb";
    public description: string = "Allumer une ampoule";
    public path: string = "/lightbulb/switchon";
    public type: CommandType = CommandType.post;
    public out: { message: VarType } = { message: { type: "string", description: "message d'erreur/de succès", optional: false } };
  
    run(req: Request, res: Response) {
        const GCLight = lights.getLight({label:"GC light"});
        GCLight?.setState({power:"on",brightness:1.0},()=>{
            // console.log(GCLight?.power);
        })
    }
  }
  
  export = new LightbulbSwitchOn();