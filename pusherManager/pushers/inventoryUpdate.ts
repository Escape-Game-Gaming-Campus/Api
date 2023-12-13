import pusherClass from "../pusher";
import pusherChannels from "../../constants/pusherChannels";
import { getInventory } from "../../utils/inventory";
import Object, { ObjectVarType } from "../../constants/object";

class InventoryUpdatePusher extends pusherClass {
    constructor() {super();}
    
    public channel: pusherChannels = pusherChannels.INVENTORY;
    public eventName: string = "updateInventory";
    public description: string = "Sends the updated inventory to the client";
    public data: undefined = undefined;
    public out: (typeof ObjectVarType)[] = [ObjectVarType];
    
    run(data: any): Object[] {
        getInventory.sortByUUID();
        return getInventory.array;
    }
}

export = new InventoryUpdatePusher();