abstract class Shape {
    abstract area(): number;
  }
  
  class Square extends Shape {
    constructor(private side: number) {
      super();
    }
    area(): number {
      return this.side * this.side;
    }
  }
  
  class Circle extends Shape {
    constructor(private radius: number) {
      super();
    }
    area(): number {
      return Math.PI * this.radius * this.radius;
    }
  }