"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Ex01_1 = require("./Ex01");
class Student extends Ex01_1.Person {
    constructor(name, age, grade) {
        super(name, age);
        this.grade = grade;
    }
    displayAllInfo() {
        super.displayInfo();
        console.log('Grade: ' + this.grade);
    }
}
const Student1 = new Student('Thái', 20, 10);
Student1.displayAllInfo();
