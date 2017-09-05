// Vector is a light version of the Vector class from the sylvester library (https://github.com/jcoglan/sylvester)
export default class Vector
{
    constructor (elements)
    {
        this.setElements(elements);
    }
    dup () {
        return new Vector(this.elements);
    }
    setElements (els)
    {
        this.elements = (els.elements || els).slice();
        return this;
    }
}

Vector.i = new Vector([1,0,0]);
Vector.j = new Vector([0,1,0]);
Vector.k = new Vector([0,0,1]);