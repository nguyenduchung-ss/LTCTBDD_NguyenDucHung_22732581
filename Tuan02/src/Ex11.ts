function resolveAfterOneSecondEx11(): Promise<number> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(10), 1000);
  });
}

async function runExercise1() {
  try {
    const value = await resolveAfterOneSecondEx11();
    console.log("Value:", value); 
  } catch (error) {
    console.error(error);
  }
}


runExercise1();
