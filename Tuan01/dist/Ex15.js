"use strict";
class Book {
    constructor(title, author) {
        this.title = title;
        this.author = author;
    }
}
class User {
    constructor(name) {
        this.name = name;
    }
}
class Library {
    constructor() {
        this.books = [];
        this.users = [];
    }
    addBook(title, author) {
        this.books.push(new Book(title, author));
    }
    addUser(name) {
        this.users.push(new User(name));
    }
}
