import pusherClass from "../pusher";
import pusherChannels from "../../utils/pusherChannels";

class InventoryAddPusher extends pusherClass {
    constructor() {super();}
    
    public channel: pusherChannels = pusherChannels.INVENTORY;
    public eventName: string = "Add to inventory";
    public description: string = "Adds an item to the inventory and sends the updated inventory to the client";
    
    run(data: any): object {
        return { message: "Hello World!!!" };
    }
}

export = new InventoryAddPusher();