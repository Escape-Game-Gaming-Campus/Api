import pusherClass from "../pusher";
import pusherChannels from "../../constants/pusherChannels";
import Player from "../../constants/players";
import { getPlayers } from "../../utils/players";
import { VarType } from "../../utils/doc";

class PlayersUpdatePusher extends pusherClass {
    constructor() {super();}
    
    public channel: pusherChannels = pusherChannels.PLAYERS;
    public eventName: string = "updatePlayers";
    public description: string = "Met à jour les players pour les clients";
    public data: undefined = undefined;
    public out: { players : [{ ID: VarType, name: VarType, position: VarType }], message: VarType } = { players: [{ ID: {type: "number", description: "L'id du player get", optional: false}, name: {type: "string", description: "le nom du player", optional: false}, position: {type: "number[]", description: "Liste de 3 valeurs tels un Vect3 correspondant au positions du joueur", optional: false} }], message: { type: "string", description: "message d'erreur/de succès", optional: false } };
    
    run(data: any): Player[] {
        getPlayers.sortByPLayeriD();
        return getPlayers.array;
    }
}

export = new PlayersUpdatePusher();