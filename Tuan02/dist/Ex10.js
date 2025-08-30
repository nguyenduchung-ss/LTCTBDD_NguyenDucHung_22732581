"use strict";
function randomTask() {
    return new Promise((resolve, reject) => {
        const success = Math.random() < 0.7;
        setTimeout(() => {
            if (success) {
                resolve("Task succeeded");
            }
            else {
                reject(new Error("Task failed"));
            }
        }, 1000);
    });
}
randomTask()
    .then((result) => {
    console.log("Result:", result);
})
    .catch((error) => {
    console.error("Error:", error.message);
})
    .finally(() => {
    console.log("Done");
});
