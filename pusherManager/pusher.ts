import pusherChannels from "../constants/pusherChannels";

export default class pusherClass {
    public channel: pusherChannels = pusherChannels.DEV;
    public eventName: string = "error500";
    public description: string = "An error occured, that value is not set";
    public data: any = {};
    public out: any = {};
    public run(data: any, force: boolean): object | void {};

    constructor() {};
}