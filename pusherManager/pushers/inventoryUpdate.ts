import pusherClass from "../pusher";
import pusherChannels from "../../constants/pusherChannels";
import { getInventory } from "../../utils/inventory";
import Object, { ObjectVarType } from "../../constants/object";

class InventoryUpdatePusher extends pusherClass {
    constructor() {super();}
    
    public channel: pusherChannels = pusherChannels.INVENTORY;
    public eventName: string = "updateInventory";
    public description: string = "Envoye la liste des objets de l'inventaire à jour";
    public data: undefined = undefined;
    public out: (typeof ObjectVarType)[] = [ObjectVarType];
    
    run(data: any, force: boolean): Object[] {
        getInventory.sortByUUID();
        return getInventory.array;
    }
}

export = new InventoryUpdatePusher();