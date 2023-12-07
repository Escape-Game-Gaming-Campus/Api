import pusherClass from "../pusher";
import pusherChannels from "../../utils/pusherChannels";

class helloWorldPusher extends pusherClass {
    constructor() {super();}
    
    public channel: pusherChannels = pusherChannels.DEV;
    public eventName: string = "helloWorld";
    public description: string = "Sends a hello world message to the client";
    
    run(data: any): object {
        return { message: "Hello World!!!" };
    }
}

export = new helloWorldPusher();