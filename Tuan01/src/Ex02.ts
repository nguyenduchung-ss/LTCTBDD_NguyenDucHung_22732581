import { Person } from './Ex01'
class Student extends Person{
    grade : Number;
    constructor(name: String, age: Number, grade: Number ){
        super(name, age);
        this.grade = grade;
    }
    displayAllInfo(): void {
        super.displayInfo();
        console.log('Grade: '+ this.grade);
    }
}
const Student1 = new Student('Thái', 20, 10);
Student1.displayAllInfo();