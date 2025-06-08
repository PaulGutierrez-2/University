//Para generar un hash de una contraseña
//Instalar bcrypt con: npm install bcrypt
const bcrypt = require('bcrypt');
bcrypt.hash('admin123', 10).then(console.log);
// ejecutar con: node tools/hash.js