class Rectangle {
    width: number;
    height: number;
    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
    }
    getArea(): number {
        return this.width * this.height;
    }
    getPerimeter(): number {
        return 2 * (this.width + this.height);
    }
}
const rect = new Rectangle(5, 10); 
console.log('Width: ' + rect.width);
console.log('Height: ' + rect.height);
console.log('Area: ' + rect.getArea());
console.log('Perimeter: ' + rect.getPerimeter());