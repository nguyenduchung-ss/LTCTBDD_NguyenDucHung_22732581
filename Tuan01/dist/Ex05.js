"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.BackAccount = void 0;
const process = __importStar(require("process"));
const readline = __importStar(require("readline"));
class BackAccount {
    constructor(balance) {
        this.balance = balance;
    }
    deposit(amount) {
        this.balance += amount;
        return this.balance;
    }
    withdraw(amount) {
        if (this.balance >= amount) {
            this.balance -= amount;
        }
        else {
            console.log('Insufficient balance');
        }
        return this.balance;
    }
}
exports.BackAccount = BackAccount;
const account = new BackAccount(0);
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
function showMenu() {
    console.log('1. Deposit');
    console.log('2. Withdraw');
    console.log('3. Exit');
    console.log('Current balance: ' + account.balance);
    rl.question('Enter your choice: ', (choice) => {
        switch (choice) {
            case '1':
                rl.question('Enter amount to deposit: ', (amountInput) => {
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
                rl.question('Enter amount to withdraw: ', (amountInput) => {
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
    });
}
showMenu();
