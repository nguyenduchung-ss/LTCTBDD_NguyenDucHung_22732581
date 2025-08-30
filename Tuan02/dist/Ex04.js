"use strict";
function getRandomNumber() {
    return new Promise((resolve, reject) => {
        const random = Math.random();
        if (random < 0.9) {
            resolve(random);
        }
        else {
            reject(new Error("Random number too high!"));
        }
    });
}
getRandomNumber()
    .then((value) => {
    console.log("Random number:", value);
})
    .catch((error) => {
    console.error("Error:", error.message);
});
