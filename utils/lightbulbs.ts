import Object, { objs } from "../constants/object";
import { getInventory } from "./inventory";
import lights, { GroupLight, Light } from "./lights";
import AppConfig from "../constants/appConfig.json";

const emptyObject: Object = { UUID: -1, name: "empty", texture: "" };

export type lightsBulbsBaseIndex = 0 | 1 | 2 | 3;

class Lightbulbs {
    private validArray: [Object, Object, Object, Object] = [objs[1], objs[3], objs[2], objs[0]];
    private array: [Object, Object, Object, Object] = [emptyObject, emptyObject, emptyObject, emptyObject];
    private valid: [boolean, boolean, boolean, boolean] = [false, false, false, false];
    private lights?: Light;
    private groupLights?: GroupLight;

    constructor() {
        for (let index = 0; index < 10000; index++) {
            this.validArray.sort(() => Math.random() - 0.5);
        }
        this.validArray.forEach((e, i) => {
            if (e.UUID === 0) this.array[i] = e;
        })
        this.checkValid();
    }

    public setUp() {
        this.lights = lights.getLight({ label: AppConfig.LIFX.LIGHT_NAME });
        this.groupLights = this.lights?.Group;
        this.groupLights?.setState({ power: "off" });
    }

    get Valid() { return this.valid; }

    public insert(object: Object, base: lightsBulbsBaseIndex = 0) {
        if (base > 3 || base < 0) return;
        console.log(`insert ${object.name} in ${base}`)
        this.delete(base);
        this.array[base] = object;
        console.log(this.array)
        getInventory.delete(object.UUID);
        this.checkValid();
    }

    public delete(object: Object | lightsBulbsBaseIndex) {
        if (typeof object === "number") {
            if (object > 3 || object < 0) return;
            if (this.array[object].UUID !== emptyObject.UUID) getInventory.insert(this.array[object]);
            this.array[object] = emptyObject;
        } else {
            if (object.UUID > 3 || object.UUID < 0) return;
            if (object.UUID !== emptyObject.UUID) getInventory.insert(object);
            this.array.forEach((e, i) => {
                if (e.UUID === object.UUID) this.array[i] = emptyObject;
            });
        }
        this.checkValid();
    }

    private checkValid() {
        this.valid = [false, false, false, false];
        this.array.forEach((e, i) => {
            if (e.UUID === this.validArray[i].UUID) this.valid[i] = true;
        });

        if (this.valid[0] && this.valid[1] && this.valid[2] && this.valid[3]) {
            if (this.lights?.Power === "off") this.groupLights?.setState({ power: "on" });
        } else {
            if (this.lights?.Power === "on") this.groupLights?.setState({ power: "off" });
        }
    }

    public getLightColor(base: lightsBulbsBaseIndex): [number, number, number] {
        if (base > 3 || base < 0) return [0, 0, 0];
        if (this.validArray[base].UUID === 0) return [255, 255, 0];
        if (this.validArray[base].UUID === 1) return [255, 0, 0];
        if (this.validArray[base].UUID === 2) return [0, 255, 0];
        if (this.validArray[base].UUID === 3) return [0, 0, 255];
        return [0, 0, 0];
    }

    public notEmpty(base: lightsBulbsBaseIndex): boolean {
        if (base > 3 || base < 0) return false;
        if (this.array[base].UUID === emptyObject.UUID) return false;
        return true;
    }
}

export var getLightbulbs = new Lightbulbs();