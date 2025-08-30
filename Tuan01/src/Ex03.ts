export class Car{
    brand: String;
    model: String;
    year: Number;
    constructor(brand: String, model: String, year: Number){
        this.brand = brand;
        this.model = model;
        this.year = year;
    }
    displayInfo(): void{
        console.log('Brand: '+ this.brand + ', Model: '+ this.model + ', Year: '+ this.year);
    }
}
const Car1 = new Car('Toyota', 'Camry', 2020);
Car1.displayInfo();