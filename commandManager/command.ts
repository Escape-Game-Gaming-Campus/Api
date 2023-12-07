import CommandType from "../utils/commandType";
import { Request, Response } from "express";

export class Command {
    constructor() {};

    public name: string = "error 500";
    public description: string = "An error occured, that value is not set";
    public path: string = "/500";
    public type: CommandType = CommandType.get;

    public run(req: Request, res: Response): void {
        res.status(500).json({ message: "An error occured, that command is not set" });
    };
}