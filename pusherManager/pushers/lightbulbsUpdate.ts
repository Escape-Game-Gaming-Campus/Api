import pusherClass from "../pusher";
import pusherChannels from "../../constants/pusherChannels";
import { getLightbulbs } from "../../utils/lightbulbs";
import Object, { ObjectVarType } from "../../constants/object";

class LightbulbsUpdatePusher extends pusherClass {
    constructor() {super();}
    
    public channel: pusherChannels = pusherChannels.INVENTORY;
    public eventName: string = "updateLightbulbs";
    public description: string = "Envoie la liste des ampoules à jour";
    public data: undefined = undefined;
    public out: (typeof ObjectVarType)[] = [ObjectVarType];
    
    run(data: any, force: boolean): Object[] {
        getLightbulbs.sortByUUID();
        return getLightbulbs.array;
    }
}

export = new LightbulbsUpdatePusher();