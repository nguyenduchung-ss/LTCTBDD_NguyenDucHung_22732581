"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Car = void 0;
class Car {
    constructor(brand, model, year) {
        this.brand = brand;
        this.model = model;
        this.year = year;
    }
    displayInfo() {
        console.log('Brand: ' + this.brand + ', Model: ' + this.model + ', Year: ' + this.year);
    }
}
exports.Car = Car;
const Car1 = new Car('Toyota', 'Camry', 2020);
Car1.displayInfo();
