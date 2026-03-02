const bcrypt = require('bcrypt');
const password = 'tata123'; // 👈 Change this whenever you need a new hash

const generateHash = async () => {
    try {
        const saltRounds = 10;
        const hash = await bcrypt.hash(password, saltRounds);
        
        console.log("--------------------------");
        console.log("PASSOWRD:", password);
        console.log("COPY THIS HASH:");
        console.log(hash); 
        console.log("--------------------------");
    } catch (err) {
        console.error("Error generating hash:", err);
    }
};

generateHash();