function resolveAfterOneSecond() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(10);
      }, 1000); 
    });
  }
  
  resolveAfterOneSecond().then((value) => {
    console.log(value);
  });