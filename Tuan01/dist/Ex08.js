"use strict";
class Product {
    constructor(name, price) {
        this.name = name;
        this.price = price;
    }
}
const products = [
    new Product("Laptop", 1200),
    new Product("Mouse", 50),
    new Product("Keyboard", 150),
    new Product("Monitor", 300)
];
const expensiveProducts = products.filter(product => product.price > 100);
console.log(expensiveProducts);
