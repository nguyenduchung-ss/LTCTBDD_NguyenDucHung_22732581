"use strict";
class Employee {
    constructor(name, salary) {
        this.name = name;
        this.salary = salary;
    }
}
class Manager extends Employee {
    manageTeam() {
        return `${this.name} is managing the team!`;
    }
}
class Developer extends Employee {
    code() {
        return `${this.name} is coding!`;
    }
}
