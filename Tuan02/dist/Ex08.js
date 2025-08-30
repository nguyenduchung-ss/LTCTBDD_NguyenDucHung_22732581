"use strict";
function square(num) {
    return Promise.resolve(num * num);
}
function double(num) {
    return Promise.resolve(num * 2);
}
function addFive(num) {
    return Promise.resolve(num + 5);
}
square(2)
    .then((result) => double(result))
    .then((result) => addFive(result))
    .then((finalResult) => {
    console.log("Final result:", finalResult);
})
    .catch((error) => {
    console.error(error);
});
