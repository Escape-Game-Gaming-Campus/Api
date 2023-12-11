import pusherClass from "../pusher";
import pusherChannels from "../../constants/pusherChannels";
import { getInventory } from "../../utils/inventory";
import Object from "../../constants/object";

class InventoryUpdatePusher extends pusherClass {
    constructor() {super();}
    
    public channel: pusherChannels = pusherChannels.INVENTORY;
    public eventName: string = "updateInventory";
    public description: string = "Sends the updated inventory to the client";
    
    run(data: any): Object[] {
        getInventory.sortByUUID();
        return getInventory.array;
    }
}

export = new InventoryUpdatePusher();