import pusherClass from "../pusher";
import pusherChannels from "../../constants/pusherChannels";
import notes from "../../utils/notes";

class NotesChangePusher extends pusherClass {
    constructor() {super();}
    
    public channel: pusherChannels = pusherChannels.DEV;
    public eventName: string = "notesChange";
    public description: string = "Change notes informations from players";
    
    run(data: any): object {
        return { notes: notes };
    }
}

export = new NotesChangePusher();