class Animal {
    constructor(public name: string) {}
  }
  
  class Dog extends Animal {
    bark(): string {
      return `${this.name} says Woof!`;
    }
  }
  
  class Cat extends Animal {
    meow(): string {
      return `${this.name} says Meow!`;
    }
  }