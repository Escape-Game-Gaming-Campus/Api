import axios from "axios";
import { writeFile } from "fs";
import { BG_COLOR_TEXT, COLOR_TEXT, FORMAT_TEXT } from "../constants/colors";
import * as AppConfig from '../constants/appConfig.json';

type lightResponseType = {
    "id": string,
    "uuid": string,
    "label": string,
    "connected": boolean,
    "power": "on" | "off",
    "color": {
        "hue": number,
        "saturation": number,
        "kelvin": number
    },
    "brightness": number,
    "group": {
        "id": string,
        "name": string
    },
    "location": {
        "id": string,
        "name": string
    },
    "product": {
        "name": string,
        "identifier": string,
        "company": string,
        "vendor_id": number,
        "product_id": number,
        "capabilities": {
            "has_color": false,
            "has_variable_color_temp": boolean,
            "has_ir": boolean,
            "has_hev": boolean,
            "has_chain": boolean,
            "has_matrix": boolean,
            "has_multizone": boolean,
            "min_kelvin": number,
            "max_kelvin": number
        }
    },
    "last_seen": string,
    "seconds_since_seen": number
}

type groupOrLocationResponseType = { id: string, name: string }

class Lights {
    private _lights: Light[] = [];
    private _groups: GroupLight[] = [];
    private _locations: LocationLight[] = [];

    public getLights(callback: Function, light?: Light) {
        var _lights = this._lights;
        var _groups = this._groups;
        var _locations = this._locations;
        const thiss = this;

        axios.request({
            method: 'GET',
            url: `https://api.lifx.com/v1/lights/${light ? light.ID : 'all'}`,
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${AppConfig.LIFX.TOKEN_ACCESS}`
            }

        }).then(function (response: { data: lightResponseType[] }) {
            writeFile("../lifx.json", JSON.stringify(response.data, null, 2), function (err) {
                if (AppConfig.DetailLogs) {
                    console.log(BG_COLOR_TEXT.YELLOW + COLOR_TEXT.BLACK + "Lights list received" + FORMAT_TEXT.RESET);
                }
                callback();
            });
            response.data.forEach((e: lightResponseType) => {
                const lgt = new Light(e, thiss)

                var grp = _groups.find((ee: GroupLight) => { return ee.ID === e.group.id });
                grp ? grp.addLight(lgt) : grp = new GroupLight(e.group, lgt, thiss);

                var loc = _locations.find((ee: LocationLight) => { return ee.ID === e.location.id });
                loc ? loc.addLight(lgt) : loc = new LocationLight(e.location, lgt, thiss);

                lgt.Group = grp;
                lgt.Location = loc;

                _lights.push(lgt);
                _groups.push(grp);
                _locations.push(loc);
            });

        }).catch(function (error) {
            writeFile("../lifx.json", JSON.stringify(error, null, 2), function (err) {
                console.error(BG_COLOR_TEXT.RED + "Lights list not received" + FORMAT_TEXT.RESET);
                callback();
            });
        });
    }

    public getLight(search: { id: string } | { uuid: string } | { label: string }): Light | undefined {
        return this._lights.find((e: Light) => {
            if ((search as { id: string }).id) {
                return e.ID === (search as { id: string }).id;
            }
            else if ((search as { uuid: string }).uuid) {
                return e.UUID === (search as { uuid: string }).uuid;
            }
            else if ((search as { label: string }).label) {
                return e.Label === (search as { label: string }).label;
            }
        });
    }

    public getGroup(search: { id: string } | { name: string }): GroupLight | undefined {
        return this._groups.find((e: GroupLight) => {
            if ((search as { id: string }).id) {
                return e.ID === (search as { id: string }).id;
            }
            else if ((search as { name: string }).name) {
                return e.Name === (search as { name: string }).name;
            }
        });
    }

    public getLocation(search: { id: string } | { name: string }): LocationLight | undefined {
        return this._locations.find((e: LocationLight) => {
            if ((search as { id: string }).id) {
                return e.ID === (search as { id: string }).id;
            }
            else if ((search as { name: string }).name) {
                return e.Name === (search as { name: string }).name;
            }
        });
    }

    public setStates(state: { power?: "on" | "off", brightness?: number, infrared?: number, duration?: number, fast?: boolean } = { power: "on" }, callback?: (res: null | { results: {id : string, status: "ok" | string, label: string}[] }) => void, random: boolean = false, light: Light | GroupLight | LocationLight | {ID: "all", LightClassType: "All"} = {ID: "all", LightClassType: "All"}) {
        var thiss: Light[] = [];
        var id: string = light.ID;
        switch (light.LightClassType) {
            case "Light":
                thiss.push(light as Light);
                break;
            default:
                if (random) {
                    id += ":random";
                }
                
            case "Group":
                (light as GroupLight).getLights().forEach((e: Light) => {
                    thiss.push(e);
                });
                id = "group_id:" + id;
                break;
            case "Location":
                (light as LocationLight).getLights().forEach((e: Light) => {
                    thiss.push(e);
                });
                id = "location_id:" + id;
                break;
            case "All":
                this._lights.forEach((e: Light) => {
                    thiss.push(e);
                });
                break;
        }

        if (
            (
                (
                    state.power === undefined
                ) && (
                    state.brightness === undefined
                ) && (
                    state.infrared === undefined
                ) && (
                    state.duration === undefined
                ) && (
                    state.fast === undefined
                )
            )
        ) {
            callback ? callback(null) : null;
            return;
        };

        axios.request({
            method: 'PUT',
            url: `https://api.lifx.com/v1/lights/${id}/state`,
            headers: {
                accept: 'text/plain',
                'content-type': 'application/json',
                Authorization: `Bearer ${AppConfig.LIFX.TOKEN_ACCESS}`
            },
            data: state

        }).then(function (response: { data: any }) {
            writeFile("../lifxLastState.json", JSON.stringify(response.data, null, 2), function (err) {
                if (AppConfig.DetailLogs) {
                    console.log(BG_COLOR_TEXT.YELLOW + COLOR_TEXT.BLACK + "Lights state is changed" + FORMAT_TEXT.RESET);
                }
            });
            thiss.forEach((e: Light) => {
                if (state.power) {
                    e.Power = state.power;
                }
                if (state.brightness) {
                    e.Brightness = state.brightness;
                }
            })
            callback ? callback(response.data) : null;

        }).catch(function (error) {
            writeFile("../lifx.json", JSON.stringify(error, null, 2), function (err) {
                console.error(BG_COLOR_TEXT.RED + "Lights state is not changed" + FORMAT_TEXT.RESET);
            });
            callback ? callback(null) : null;
        });
    }
}

export class Light {
    private id: string;
    private uuid: string;
    private label: string;
    private connected: boolean;
    private power: "on" | "off";
    private color: {
        hue: number,
        saturation: number,
        kelvin: number
    };
    private brightness: number;
    private group?: GroupLight;
    private location?: LocationLight;
    private product: {
        name: string,
        identifier: string,
        company: string,
        vendor_id: number,
        product_id: number,
    };
    private capabilities: {
        has_color: false,
        has_variable_color_temp: boolean,
        has_ir: boolean,
        has_hev: boolean,
        has_chain: boolean,
        has_matrix: boolean,
        has_multizone: boolean,
        min_kelvin: number,
        max_kelvin: number
    };
    private last_seen: string;
    private seconds_since_seen: number;
    private lightsList: Lights;

    constructor(response: lightResponseType, lights: Lights) {
        this.id = response.id;
        this.uuid = response.uuid;
        this.label = response.label;
        this.connected = response.connected;
        this.power = response.power;
        this.color = response.color;
        this.brightness = response.brightness;
        this.product = response.product;
        this.capabilities = response.product.capabilities;
        this.last_seen = response.last_seen;
        this.seconds_since_seen = response.seconds_since_seen;
        this.lightsList = lights;
    }

    get ID(): string { return this.id; }
    get UUID(): string { return this.uuid; }
    get Label(): string { return this.label; }
    get Connected(): boolean { return this.connected; }
    get Power(): typeof this.power { return this.power; }
    get Color(): typeof this.color { return this.color; }
    get Brightness(): number { return this.brightness; }
    get Group(): typeof this.group { return this.group; }
    get Location(): typeof this.location { return this.location; }
    get Product(): typeof this.product { return this.product; }
    get Capabilities(): typeof this.capabilities { return this.capabilities; }
    get LastSeen(): string { return this.last_seen; }
    get SecondsSinceSeen(): number { return this.seconds_since_seen; }
    get LightClassType(): "Location" | "Group" | "Light" | "All" { return "Light"; }

    set Power(power: typeof this.power) { this.power = power; }
    set Brightness(brightness: number) { this.brightness = brightness; }
    set Group(group: typeof this.group) { this.group = group; }
    set Location(location: typeof this.location) { this.location = location; }    

    public setState(state: { power?: "on" | "off", brightness?: number, infrared?: number, duration?: number, fast?: boolean } = { power: "on" }, callback?: (res: null | { results: {id : string, status: "ok" | "timed_out" | string, label: string}[] }) => void) {
        this.lightsList.setStates(state, callback, false, this);
    }
}

export class GroupLight {
    private id: string;
    private name: string;
    private lights: Light[] = [];
    private lightsList: Lights;

    constructor(response: groupOrLocationResponseType, lights: Light, lightsList: Lights) {
        this.id = response.id;
        this.name = response.name;
        this.lights.push(lights);
        this.lightsList = lightsList;
    }

    get ID(): string { return this.id; }
    get Name(): string { return this.name; }
    get LightClassType(): "Location" | "Group" | "Light" | "All" { return "Group"; }

    public addLight(light: Light) {
        this.lights.push(light);
    }

    public getLights(): Light[] {
        return this.lights;
    }

    public getLight(search: { id: string } | { uuid: string } | { label: string }): Light | undefined {
        return this.lights.find((e: Light) => {
            if ((search as { id: string }).id) {
                return e.ID === (search as { id: string }).id;
            }
            else if ((search as { uuid: string }).uuid) {
                return e.UUID === (search as { uuid: string }).uuid;
            }
            else if ((search as { label: string }).label) {
                return e.Label === (search as { label: string }).label;
            }
        });
    }

    public setState(state: { power?: "on" | "off", brightness?: number, infrared?: number, duration?: number, fast?: boolean } = { power: "on" }, callback?: (res: null | { results: {id : string, status: "ok" | string, label: string}[] }) => void, random: boolean = false) {
        this.lightsList.setStates(state, callback, random, this);
    }
}

export class LocationLight {
    private id: string;
    private name: string;
    private lights: Light[] = [];
    private lightsList: Lights;

    constructor(response: groupOrLocationResponseType, lights: Light, lightsList: Lights) {
        this.id = response.id;
        this.name = response.name;
        this.lights.push(lights);
        this.lightsList = lightsList;
    }

    get ID(): string { return this.id; }
    get Name(): string { return this.name; }
    get LightClassType(): "Location" | "Group" | "Light" | "All" { return "Location"; }

    public addLight(light: Light) {
        this.lights.push(light);
    }

    public getLights(): Light[] {
        return this.lights;
    }

    public getLight(search: { id: string } | { uuid: string } | { label: string }): Light | undefined {
        return this.lights.find((e: Light) => {
            if ((search as { id: string }).id) {
                return e.ID === (search as { id: string }).id;
            }
            else if ((search as { uuid: string }).uuid) {
                return e.UUID === (search as { uuid: string }).uuid;
            }
            else if ((search as { label: string }).label) {
                return e.Label === (search as { label: string }).label;
            }
        });
    }

    public setState(state: { power?: "on" | "off", brightness?: number, infrared?: number, duration?: number, fast?: boolean } = { power: "on" }, callback?: (res: null | { results: {id : string, status: "ok" | string, label: string}[] }) => void, random: boolean = false) {
        this.lightsList.setStates(state, callback, random, this);
    }
}

export default new Lights();