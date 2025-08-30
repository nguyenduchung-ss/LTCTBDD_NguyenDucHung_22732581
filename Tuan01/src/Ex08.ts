class Product {
  constructor(
    public name: string,
    public price: number
  ) {}
}

const products: Product[] = [
  new Product("Laptop", 1200),
  new Product("Mouse", 50),
  new Product("Keyboard", 150),
  new Product("Monitor", 300)
];

const expensiveProducts = products.filter(product => product.price > 100);
console.log(expensiveProducts);