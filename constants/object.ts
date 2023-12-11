import AppConfig from "./AppConfig";

type Object = 
{
    name : string,
    UUID : number,
    texture : string,
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