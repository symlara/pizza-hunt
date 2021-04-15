// create a variable to hold db connection
let db;
const request = indexedDB.open('pizza_hunt', 1);

request.onupgradeneeded = function(event) {
  const db = event.target.result;
  db.createObjectStore('new_pizza', { autoIncrement: true });
};

request.onsuccess = function(event) {
    // when db is successfully created with its object store (from onupgradedneeded event above), save reference to db in global variable
    db = event.target.result;
  
    // check if app is online, if yes run checkDatabase() function to send all local db data to api
    if (navigator.onLine) {
      uploadPizza();
    }
  };
request.onerror = function(event) {
  // log error here
  console.log(event.target.errorCode);
};

function saveRecord(record) {
  const transaction = db.transaction(['new_pizza'], 'readwrite');

  const pizzaObjectStore = transaction.objectStore('new_pizza');

  // add record to your store with add method.
  pizzaObjectStore.add(record);
}

function uploadPizza() {
    //open a transaction on your db
    const transaction = db.transaction(['new_pizza'], 'readwrite');

    //access your object store
    const pizzaObjectStore = transaction.objectStore('new_pizza');

 // get all records from store and set to a variable
 const getAll = pizzaObjectStore.getAll();

 // upon a successful .getAll() execution, run this function
 getAll.onsuccess = function() {
      // if there was data in indexedDb's store, let's send it to the api server
      if (getAll.result.length > 0) {
          fetch('/api/pizzas', {
              method: 'POST',
              body: JSON.stringify(getAll.result),
              headers: {
                Accept: 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
              }
          })
          .then(response => response.json())
          .then(serverResponse => {
              if (serverResponse.message) {
                  throw new Erro(serverResponse);
              }
              // open one more transaction
              const transaction = db.transaction(['new_pizza'], 'readwrite');
              //access the new_pizza object store
              const pizzaObjectStore = transaction.objectStore('new_pizza');
              // clear all items in store
              pizzaObjectStore.clear();

              alert('All saved pizza has been submitted!');
          })
          .catch(err => {
              console.log(err);
          });
      }
 }
};

//listen for app comming back online
window.addEventListener('online', uploadPizza);