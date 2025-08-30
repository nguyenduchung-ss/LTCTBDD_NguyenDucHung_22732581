"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Person = void 0;
class Person {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }
    displayInfo() {
        console.log('Name: ' + this.name + ', Age: ' + this.age);
    }
}
exports.Person = Person;
const Person1 = new Person('Thái', 20);
Person1.displayInfo();
