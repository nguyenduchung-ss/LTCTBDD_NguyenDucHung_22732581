class Book {
    constructor(public title: string, public author: string) {}
  }
  
class User {
    constructor(public name: string) {}
  }
  
class Library {
    private books: Book[] = [];
    private users: User[] = [];
  
    addBook(title: string, author: string): void {
      this.books.push(new Book(title, author));
    }
  
    addUser(name: string): void {
      this.users.push(new User(name));
    }
  }