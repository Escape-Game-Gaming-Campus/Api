import pusherClass from "../pusher";
import pusherChannels from "../../constants/pusherChannels";
import Player from "../../constants/players";
import { getPlayers } from "../../utils/players";

class PlayersUpdatePusher extends pusherClass {
    constructor() {super();}
    
    public channel: pusherChannels = pusherChannels.DEV;
    public eventName: string = "updatePlayers";
    public description: string = "Sends the updated players informations to the client";
    
    run(data: any): Player[] {
        getPlayers.sortByPLayeriD();
        return getPlayers.array;
    }
}

export = new PlayersUpdatePusher();