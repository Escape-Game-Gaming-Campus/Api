import Object from "../constants/object";

class Lightbulbs
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
            console.warn(`la liste n'a pas assez d'espace pour stocker un "${object.name}" supplémentaire ${this.array.length}/${this.size}`)
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
        for (let index = 0; index < this.array.length; index++) {
            if ((object as Object).UUID ? this.array[index].UUID === (object as Object).UUID : this.array[index].UUID === object)
            {
                this.array.splice(index, 1) // number of element wich are delete at index
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

export var getLightbulbs = new Lightbulbs(10);