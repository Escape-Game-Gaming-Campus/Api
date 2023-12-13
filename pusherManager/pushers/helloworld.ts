import pusherClass from "../pusher";
import pusherChannels from "../../constants/pusherChannels";
import { VarType } from "../../utils/doc";

class helloWorldPusher extends pusherClass {
    constructor() {super();}
    
    public channel: pusherChannels = pusherChannels.DEV;
    public eventName: string = "helloWorld";
    public description: string = "Sends a hello world message to the client";
    public data: undefined = undefined;
    public out: { message: VarType } = { message: {type: "string", description: "The hello world message", optional: false} };
    
    run(data: any): object {
        return { message: "Hello World!!!" };
    }
}

export = new helloWorldPusher();