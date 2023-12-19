import pusherClass from "../pusher";
import pusherChannels from "../../constants/pusherChannels";
import { VarType } from "../../utils/doc";

class helloWorldPusher extends pusherClass {
    constructor() {super();}
    
    public channel: pusherChannels = pusherChannels.DEV;
    public eventName: string = "helloWorld";
    public description: string = "Envoie un message Hello World aux clients";

    // Format d'entrée de la commande
    public data: undefined = undefined;

    // Format de sortie de la commande
    public out: { message: VarType } = { message: {type: "string", description: "The hello world message", optional: false} };

    /*
    NOTE: Pour set un format, vous devez mettre votre syntaxe, et à la place du type de votre/vos variable(s),
          vous devez mettre VarType, et compléter les infos qui lui sont relatives, et ceux de la même manière que le out ci-dessus.
    */
    
    run(data: any, force: boolean): object {
        return { message: "Hello World!!!" };
    }
}

export = new helloWorldPusher();