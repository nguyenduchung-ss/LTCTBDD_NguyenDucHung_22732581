import * as process from 'process';
import * as readline from 'readline';

export class BackAccount{
    balance: number;
    constructor(balance: number){
        this.balance = balance;
    }
    deposit(amount: number): number{
        this.balance += amount;
        return this.balance;
    }
    withdraw(amount: number): number{
        if(this.balance >= amount){
            this.balance -= amount;
        } else {
            console.log('Insufficient balance');
        }
        return this.balance;
    }
}
const account = new BackAccount(0);
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
function showMenu(){
    console.log('1. Deposit');
    console.log('2. Withdraw');
    console.log('3. Exit');
    console.log('Current balance: ' + account.balance);
    rl.question('Enter your choice: ', (choice: String) => {
        switch (choice) {
            case '1':
                rl.question('Enter amount to deposit: ', (amountInput: string) => {
                    const depositAmount = Number(amountInput);
                    if (isNaN(depositAmount)) {
                        console.log('Invalid amount. Please enter a number.');
                        showMenu();
                        return;
                    }
                    account.deposit(depositAmount);
                    console.log(`New balance: ${account.balance}`);
                    showMenu();
                
                });
                break;
            case '2':
                rl.question('Enter amount to withdraw: ', (amountInput: string) => {
                    const withdrawAmount = Number(amountInput);
                    if (isNaN(withdrawAmount)) {
                        console.log('Invalid amount. Please enter a number.');
                        showMenu();
                        return;
                    }
                    account.withdraw(withdrawAmount);
                    console.log(`New balance: ${account.balance}`);
                    showMenu();
              
                });
                break;
            case '3':
                console.log('Exiting...');
                rl.close();
                break;
            default:
                console.log('Invalid choice');
                showMenu();
                break;
        }
})
}
showMenu();