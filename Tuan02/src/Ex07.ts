
function simulateTaskEx07(time: number, name: string): Promise<string> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`${name} done in ${time}ms`);
    }, time);
  });
}


Promise.race([
  simulateTaskEx07(1000, "Task 1"),
  simulateTaskEx07(2000, "Task 2"),
  simulateTaskEx07(1500, "Task 3"),
])
  .then((firstResult) => {
    console.log("First task finished:", firstResult);
    
  })
  .catch((error) => {
    console.error(error);
  });
