import { VarType } from "../utils/doc";
import * as AppConfig from "./appConfig.json";

type Object = 
{
    name : string,
    UUID : number,
    texture : string,
}

export var ObjectVarType: {
    name : VarType,
    UUID : VarType,
    texture : VarType,
} = {
    name : { type: "string", description: "The name of the object", optional: false },
    UUID : { type: "number", description: "The UUID of the object", optional: false },
    texture : { type: "string", description: "The texture of the object", optional: false },
}

export default Object;

export var objs : Object[] = [
    {
        name : "Ampoule jaune",
        UUID : 0,
        texture : `${AppConfig.HOST}:${AppConfig.PORT}/img/ampouleY.png`
    },{
        name : "Ampoule rouge",
        UUID : 1,
        texture : `${AppConfig.HOST}:${AppConfig.PORT}/img/ampouleR.png`
    },{
        name : "Ampoule verte",
        UUID : 2,
        texture : `${AppConfig.HOST}:${AppConfig.PORT}/img/ampouleG.png`
    },{
        name : "Ampoule bleue",
        UUID : 3,
        texture : `${AppConfig.HOST}:${AppConfig.PORT}/img/ampouleB.png`
    }
];