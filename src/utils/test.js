 function devicePromise(x, y) {
     if (y === 0) {
         return Promise.reject(new Error('can not divice'));
     } else {
         return Promise.resolve(x / y);
     }
 }
 //  async function devideWithAwait() {
 //      try {
 //          return await devicePromise(6, 0);
 //      } catch (error) {
 //          console.error(error.message);
 //      }
 //  }
 function devideWithOutAwait() {
     console.log('tuandeptrai');
     return devicePromise(6, 0);

 }
 async function run() {
     //const result = await devideWithAwait()
     try {
         const result2 = await devideWithOutAwait();
         console.log(result2);
     } catch (error) {
         console.log(error.message);
     }
 }
 run();