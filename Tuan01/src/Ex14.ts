class Employee {
    constructor(public name: string, public salary: number) {}
  }
  
  class Manager extends Employee {
    manageTeam(): string {
      return `${this.name} is managing the team!`;
    }
  }
  
  class Developer extends Employee {
    code(): string {
      return `${this.name} is coding!`;
    }
  }