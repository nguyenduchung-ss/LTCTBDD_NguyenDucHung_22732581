"use strict";
function filterEvenNumbers(arr) {
    return new Promise((resolve) => {
        setTimeout(() => {
            const evenNumbers = arr.filter((num) => num % 2 === 0);
            resolve(evenNumbers);
        }, 1000);
    });
}
const numbers = [1, 2, 3, 4, 5, 6];
filterEvenNumbers(numbers)
    .then((result) => {
    console.log("Even numbers:", result);
})
    .catch((error) => {
    console.error(error);
});
