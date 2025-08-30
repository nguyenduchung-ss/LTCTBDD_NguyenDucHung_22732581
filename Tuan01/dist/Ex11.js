"use strict";
class Animal {
    constructor(name) {
        this.name = name;
    }
}
class Dog extends Animal {
    bark() {
        return `${this.name} says Woof!`;
    }
}
class Cat extends Animal {
    meow() {
        return `${this.name} says Meow!`;
    }
}
