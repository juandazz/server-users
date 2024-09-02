const dbConnection = require('./db-connection');

const controller = {
    registrarUsuario: (user) => {

        let valido = true

        const { name, surname, nickname, email, password, securityQuestion1, securityQuestion2, securityQuestion3 } = user

        if (!validatePassword(password)) {
            valido = false
        }

        console.log("Aqui");
        if (valido) {
            console.log("Aqui2");

            return dbConnection.registrateUser(name, surname, nickname, email, password, securityQuestion1, securityQuestion2, securityQuestion3)
        } else {
            return null
        }
    }
}

 const validatePassword = (password) => {
    if (password.length >= 8) {
        const regular = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@#$%^&+=!])[A-Za-z\d@#$%^&+=!]{8,}$/;
        return regular.test(password);

    }
    return false
}

module.exports = controller


