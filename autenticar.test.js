const assert = require('assert');
const dbConnection = require('./db-connection');
const { autenticarUsuario } = require('./controller'); // Importa la función a probar

// Mock de dbConnection para autenticación
dbConnection.authenticateUser = (email, password) => {
    if (email == 'karen.cosasrandom19@gmail.com' && password === 'Karen12345@') {
        return { id: 1, email: 'test@example.com', name: 'John Doe' }; // Usuario simulado
    } else {
        throw new Error('Credenciales inválidas');
    }
};

describe('autenticarUsuario', function () {

    it('debería autenticar correctamente a un usuario con credenciales válidas', async function () {
        const mockEmail = 'karen.cosasrandom19@gmail.com';
        const mockPassword = 'Karen12345@';

        const result = await autenticarUsuario(mockEmail, mockPassword);

        assert.strictEqual(result.email, mockEmail);
        assert.strictEqual(result.name, 'John Doe');
    });

    it('debería lanzar un error si las credenciales son inválidas', async function () {
        const mockEmail = 'wrong@example.com';
        const mockPassword = 'wrongpassword';

        assert.rejects(
            async () => await autenticarUsuario(mockEmail, mockPassword),
            /Credenciales inválidas/
        );
    });

    it('debería manejar errores inesperados durante la autenticación', async function () {
        // Mockear un error inesperado en la función authenticateUser
        dbConnection.authenticateUser = () => {
            throw new Error('Error de conexión a la base de datos');
        };

        assert.rejects(
            async () => await autenticarUsuario('test@example.com', 'password123'),
            /Error de conexión a la base de datos/
        );
    });
});
