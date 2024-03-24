import { VarType } from "../utils/doc";
import AppConfig from "./AppConfig.json";

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
    name : { type: "string", description: "Nom de l'objet", optional: false },
    UUID : { type: "number", description: "UUID de l'objet", optional: false },
    texture : { type: "string", description: "Lien pour accéder à la texture de l'objet (utiliser de préférence AppConfig.json pour obtenir le lien quand il est set)", optional: false },
}

export default Object;

export var objs : Object[] = [
    {
        name : "Ampoule jaune",
        UUID : 0,
        texture : `${AppConfig.FRONT.HOST}img/ampouleY.png`
    },{
        name : "Ampoule rouge",
        UUID : 1,
        texture : `${AppConfig.FRONT.HOST}img/ampouleR.png`
    },{
        name : "Ampoule verte",
        UUID : 2,
        texture : `${AppConfig.FRONT.HOST}img/ampouleG.png`
    },{
        name : "Ampoule bleue",
        UUID : 3,
        texture : `${AppConfig.FRONT.HOST}img/ampouleB.png`
    }
];