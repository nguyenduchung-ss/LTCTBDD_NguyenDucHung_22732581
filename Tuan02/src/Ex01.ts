const Async = new Promise ((resolve) => {
    setTimeout(() => {
        resolve("Hello Async");
    },2000);
});
Async.then((message) => console.log(message));