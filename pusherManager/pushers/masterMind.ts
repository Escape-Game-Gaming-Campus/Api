import pusherClass from "../pusher";
import pusherChannels from "../../constants/pusherChannels";
import { getLightbulbs } from "../../utils/lightbulbs";
import { VarType } from "../../utils/doc";

class LightbulbsUpdatePusher extends pusherClass {
    constructor() {super();}
    
    public channel: pusherChannels = pusherChannels.LIGHTBULBS;
    public eventName: string = "updateMasterMind";
    public description: string = "Envoie la liste des ampoules à jour sur les bases";
    public data: undefined = undefined;
    public out: [{place: VarType, lightColor: VarType, valid: VarType}] = [{place: {type: "boolean", description: "Si l'ampoule est placer", optional: false}, lightColor: {type: "number[]", description: "Couleur de la lumière (en vect3)", optional: false}, valid: {type: "boolean", description: "Si l'ampoule est valide", optional: false}}];
    
    run(data: any, force: boolean): [{place: boolean, lightColor: [number, number, number], valid: boolean}, {place: boolean, lightColor: [number, number, number], valid: boolean}, {place: boolean, lightColor: [number, number, number], valid: boolean}, {place: boolean, lightColor: [number, number, number], valid: boolean}] {
        return [
            {place: getLightbulbs.notEmpty(0), lightColor: getLightbulbs.getLightColor(0), valid: getLightbulbs.Valid[0]},
            {place: getLightbulbs.notEmpty(1), lightColor: getLightbulbs.getLightColor(1), valid: getLightbulbs.Valid[1]},
            {place: getLightbulbs.notEmpty(2), lightColor: getLightbulbs.getLightColor(2), valid: getLightbulbs.Valid[2]},
            {place: getLightbulbs.notEmpty(3), lightColor: getLightbulbs.getLightColor(3), valid: getLightbulbs.Valid[3]}
        ];
    }
}

export = new LightbulbsUpdatePusher();