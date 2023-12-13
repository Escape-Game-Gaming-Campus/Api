import pusherClass from "../pusher";
import pusherChannels from "../../constants/pusherChannels";
import { psdPC } from "../../utils/enigms/ddust2/passwordpc";

class Ddust2TryPsdPusher extends pusherClass {
    constructor() {super();}
    
    public channel: pusherChannels = pusherChannels.ENIGMS;
    public eventName: string = "ddust2TryPsd";
    public description: string = "Try a password to unlock Totoro";
    
    run(data: any, force: boolean): object | void {
        if (data.psdValid === psdPC.psdValid && !force) {
            return;
        }
        psdPC.psdValid = data.psdValid;
        return { valid: data.psdValid };
    }
}

export = new Ddust2TryPsdPusher();