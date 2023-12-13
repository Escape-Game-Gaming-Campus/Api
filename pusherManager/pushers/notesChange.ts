import pusherClass from "../pusher";
import pusherChannels from "../../constants/pusherChannels";
import { getNotes } from "../../utils/notes";

class NotesChangePusher extends pusherClass {
    constructor() {super();}
    
    public channel: pusherChannels = pusherChannels.DEV;
    public eventName: string = "notesChange";
    public description: string = "Change notes informations from players";
    
    run(data: any): object {
        return { notes: getNotes.notes };
    }
}

export = new NotesChangePusher();