import Object from "../constants/object";

class Inventory
{
    size : number;
    array : Object[] = [];

    constructor(size : number) 
    {
        this.size = size;
    }

    public insert(object : Object)
    {
        if (this.size > this.array.length)
        {
            var exist = false;
            this.array.forEach((e) => {
                if (e.UUID === object.UUID) exist = true;
            });
            if (exist) return;
            this.array.push(object);
        } else {
            console.warn(`l'inventaire n'a pas assez d'espace pour stocker un "${object.name}" supplémentaire ${this.array.length}/${this.size}`)
        }
    }

    public insertList(objects : Object[])
    {
        for (let index = 0; index < objects.length; index++) {
            this.insert(objects[index]);
        }
    }

    public delete(object : Object | number, onlyFirst : boolean = true) 
    {
        this.sortByUUID();
        for (let i = 0; i < this.array.length; i++) {
            if ((object as Object).UUID ? this.array[i].UUID === (object as Object).UUID : this.array[i].UUID === (object as number))
            {
                this.array.splice(i, 1) // number of element wich are delete at index
                if (onlyFirst) return;
            }
        }
    }

    public deleteList(objects : (Object | number)[], onlyFirst : boolean = true) 
    {
        for (let index = 0; index < objects.length; index++) {
            this.delete(objects[index], onlyFirst)
        }
    }

    public sortByUUID()
    {
        this.array.sort((a, b) => {
            return a.UUID - b.UUID;
        });
    }
}

export var getInventory = new Inventory(10);