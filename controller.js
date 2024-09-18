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

            return dbConnection.registrateUser(name, surname, nickname, email, password, securityQuestion1, securityQuestion2, securityQuestion3,0)
        } else {
            return null
        }
    },

    autenticarUsuario: async (email, password) => {
        try {
            const user = await dbConnection.authenticateUser(email, password);
            return user;
        } catch (error) {
            console.error('Error al autenticar el usuario:', error);
            throw new Error('Autenticación fallida');
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



    module.exports = controller, validatePassword

