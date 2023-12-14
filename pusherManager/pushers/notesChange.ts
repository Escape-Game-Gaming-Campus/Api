import pusherClass from "../pusher";
import pusherChannels from "../../constants/pusherChannels";
import { getNotes } from "../../utils/notes";

class NotesChangePusher extends pusherClass {
    constructor() {super();}
    
    public channel: pusherChannels = pusherChannels.DEV;
    public eventName: string = "notesChange";
    public description: string = "Envoie les notes de l'équipe à jour";
    public data: undefined = undefined;
    public out: { notes: any } = { notes: {type: "string", description: "Envoie aux clients la dernière note à jour", optional: false} };
    
    run(data: any, force: boolean): object {
        return { notes: getNotes.notes };
    }
}

export = new NotesChangePusher();