import { inventory } from "..";
import { BG_COLOR_TEXT, COLOR_TEXT, FORMAT_TEXT } from "../constants/colors";
import Object, { objs } from "../constants/object";
import { getInventory } from "./inventory";
import lights, { GroupLight, Light } from "./lights";

const emptyObject: Object = { UUID: -1, name: "empty", texture: "" };

export type lightsBulbsBaseIndex = 0 | 1 | 2;

class Lightbulbs {
    private validArray: [Object, Object, Object, Object] = [objs[1], objs[3], objs[2], objs[0]];
    private array: [Object, Object, Object, Object] = [emptyObject, emptyObject, emptyObject, objs[0]];
    private valid: [boolean, boolean, boolean, boolean] = [false, false, false, true];
    private lights ?: Light;
    private groupLights ?: GroupLight;

    public setUp() {
        this.lights = lights.getLight({label: "GC light"});
        this.groupLights = this.lights?.Group;
        this.groupLights?.setState({power: "off"});
    }

    get Valid() { return this.valid; }

    public insert(object: Object, base: lightsBulbsBaseIndex = 0) {
        this.delete(base);
        this.array[base] = object;
        getInventory.delete(object);
        this.checkValid();
    }

    public delete(object: Object | lightsBulbsBaseIndex) {
        if (typeof object === "number") {
            if (this.array[object].UUID !== emptyObject.UUID) getInventory.insert(this.array[object]);
            this.array[object] = emptyObject;
        } else {
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
            if (this.lights?.Power === "off") this.groupLights?.setState({power: "on"});
        } else {
            if (this.lights?.Power === "on") this.groupLights?.setState({power: "off"});
        }
    }
}

export var getLightbulbs = new Lightbulbs();