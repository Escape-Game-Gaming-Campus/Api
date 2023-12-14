import pusherClass from "../pusher";
import pusherChannels from "../../constants/pusherChannels";
import { psdPC } from "../../utils/enigms/ddust2/passwordpc";
import { VarType } from "../../utils/doc";

class Ddust2TryPsdPusher extends pusherClass {
    constructor() {super();}
    
    public channel: pusherChannels = pusherChannels.ENIGMS;
    public eventName: string = "ddust2TryPsd";
    public description: string = "Envoie aux clients si le password a été entrée correctement, mais uniquement si l'état de découverte du password a changé (possibiliter de forcer l'envoie avec le paramètre force)";
    public data: { psdValid: VarType } = { psdValid: {type: "boolean", description: "Si le password a été entrée avec succès par un client, envoyer true ici", optional: false} };
    public out: { valid: VarType } = { valid: {type: "boolean", description: "Renvoie aux clients si le password a été entrée correctement", optional: false} };
    
    run(data: any, force: boolean): object | void {
        if (data.psdValid === psdPC.psdValid && !force) {
            return;
        }
        
        psdPC.psdValid = data.psdValid;
        return { valid: data.psdValid };
    }
}

export = new Ddust2TryPsdPusher();