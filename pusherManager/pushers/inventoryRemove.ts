import pusherClass from "../pusher";
import pusherChannels from "../../utils/pusherChannels";

class InventoryRemovePusher extends pusherClass {
    constructor() {super();}
    
    public channel: pusherChannels = pusherChannels.INVENTORY;
    public eventName: string = "Remove to inventory";
    public description: string = "Removes an item to the inventory and sends the updated inventory to the client";
    
    run(data: any): object {
        return { message: "Hello World!!!" };
    }
}

export = new InventoryRemovePusher();