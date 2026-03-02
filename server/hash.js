const bcrypt = require('bcrypt');
const password = 'tata123'; // 👈 Put the password you want to use here

bcrypt.hash(password, 10, (err, hash) => {
    if (err) console.error(err);
    console.log("COPY THIS HASH:");
    console.log(hash); 
});