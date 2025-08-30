class User{
    private name: string;
    constructor(ten: string){
        this.name = ten;
    }
    set ten(value: string){
        this.name = value;
    }
    get ten(): string{
        return this.name;
}
}