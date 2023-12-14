import Player from "../constants/players";

class Players {
    size: number;
    array: Player[] = [];

    constructor(size: number) {
        this.size = size;
    }

    public setSize(size: number) {
        this.size = size;
    }

    public insert(object: Player) {
        var alreadyNumber = 0;
        if (this.size > 0) {
            this.array.forEach((e) => {
                alreadyNumber = e.ID
            });
        }
        this.array.push({ "ID": alreadyNumber + 1, "name" : object.name, "transform": object.transform});
        this.size += 1;
    }

    public insertList(objects: Player[]) {
        for (let index = 0; index < objects.length; index++) {
            this.insert(objects[index]);
        }
    }

    public delete(object: Player | number, onlyFirst: boolean = true) {
        for (let index = 0; index < this.array.length; index++) {
            if ((object as Player).ID ? this.array[index].ID === (object as Player).ID : this.array[index].ID === object) {
                this.array.splice(index, 1) // number of element wich are delete at index
                if (onlyFirst) return;
            }
        }
    }

    public deleteList(objects: (Player | number)[], onlyFirst: boolean = true) {
        for (let index = 0; index < objects.length; index++) {
            this.delete(objects[index], onlyFirst)
        }
    }

    public sortByPLayeriD() {
        this.array.sort((a, b) => {
            return a.ID - b.ID;
        });
    }
}

export var getPlayers = new Players(0);