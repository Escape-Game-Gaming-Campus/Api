import pusherClass from "../pusher";
import pusherChannels from "../../constants/pusherChannels";
import { getLightbulbs } from "../../utils/lightbulbs";
import Object, { ObjectVarType } from "../../constants/object";
import { VarType } from "../../utils/doc";

class LightbulbsUpdatePusher extends pusherClass {
    constructor() {super();}
    
    public channel: pusherChannels = pusherChannels.LIGHTBULBS;
    public eventName: string = "updateLightbulbs";
    public description: string = "Envoie la liste des ampoules à jour";
    public data: undefined = undefined;
    public out: VarType = {type: "boolean[]", description: "tableau de 4 booléen indiquant si chaques ampoules sont valides ou non", optional: false};
    
    run(data: any, force: boolean): [boolean, boolean, boolean, boolean] {
        return getLightbulbs.Valid;
    }
}

export = new LightbulbsUpdatePusher();