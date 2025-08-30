function rejectAfterOneSecond() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error("Something went wrong"));
    }, 1000);
  });
}

rejectAfterOneSecond()
  .then((value) => {
    console.log(value);
  })
  .catch((error) => {
    console.error(error.message); 
  });
