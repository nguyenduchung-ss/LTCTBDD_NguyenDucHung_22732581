class Account {
    public accountNumber: string;
    private balance: number;
    readonly owner: string;
  
    constructor(accountNumber: string, balance: number, owner: string) {
      this.accountNumber = accountNumber;
      this.balance = balance;
      this.owner = owner;
    }
  }