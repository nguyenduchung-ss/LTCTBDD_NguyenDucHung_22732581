"use strict";
class Person {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }
    displayInfo() {
        console.log('Name: ' + this.name + ', Age: ' + this.age);
    }
}
