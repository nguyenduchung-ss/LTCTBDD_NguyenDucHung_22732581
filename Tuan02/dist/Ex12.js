"use strict";
function simulateTaskEx12(time) {
    return new Promise((resolve) => {
        setTimeout(() => resolve(`Task done in ${time}ms`), time);
    });
}
async function runSimulatedTask() {
    try {
        const result = await simulateTaskEx12(2000);
        console.log(result);
    }
    catch (error) {
        console.error(error);
    }
}
runSimulatedTask();
