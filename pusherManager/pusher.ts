import pusherChannels from "../utils/pusherChannels";

export default class pusherClass {
    public channel: pusherChannels = pusherChannels.DEV;
    public eventName: string = "error500";
    public description: string = "An error occured, that value is not set";
    public run(data: any): object {return {}};

    constructor() {};
}