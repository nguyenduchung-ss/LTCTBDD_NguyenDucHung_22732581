export class Person{
  name: String;
  age: Number;
  constructor(name: String, age: Number){
    this.name = name;
    this.age = age;
  }
  displayInfo(): void{
    console.log('Name: '+ this.name + ', Age: '+ this.age);
  }
}
const Person1 = new Person('Thái', 20);
Person1.displayInfo();