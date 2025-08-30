function randomTaskEx13(): Promise<string> {
  return new Promise((resolve, reject) => {
    const success = Math.random() < 0.7; 
    setTimeout(() => {
      if (success) {
        resolve("Task succeeded");
      } else {
        reject(new Error("Task failed"));
      }
    }, 1000);
  });
}


async function runRandomTask() {
  try {
    const result = await randomTaskEx13(); 
    console.log("Result:", result);
  } catch (error: any) { 
    console.error("Error:", error.message);
  }
}


runRandomTask();
