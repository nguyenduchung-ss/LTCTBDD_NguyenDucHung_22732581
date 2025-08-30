"use strict";
function simulateTaskEx06(time) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(`Task done in ${time}ms`);
        }, time);
    });
}
Promise.all([
    simulateTaskEx06(1000),
    simulateTaskEx06(2000),
    simulateTaskEx06(1500)
])
    .then((results) => {
    console.log("All tasks finished:", results);
})
    .catch((error) => {
    console.error("Error in one of the tasks:", error);
});
