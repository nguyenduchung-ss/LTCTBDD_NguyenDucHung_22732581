"use strict";
class User {
    constructor(ten) {
        this.name = ten;
    }
    set ten(value) {
        this.name = value;
    }
    get ten() {
        return this.name;
    }
}
