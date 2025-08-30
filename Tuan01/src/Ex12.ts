interface Flyable {
    fly(): string;
  }
  
  interface Swimmable {
    swim(): string;
  }
  
  class Bird implements Flyable {
    constructor(public name: string) {}
    fly(): string {
      return `${this.name} is flying!`;
    }
  }
  
  class Fish implements Swimmable {
    constructor(public name: string) {}
    swim(): string {
      return `${this.name} is swimming!`;
    }
  }