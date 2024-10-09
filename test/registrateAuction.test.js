const assert = require('assert');
const dbConnection = require('../db-connection');
const { registrateAuction } = require('../controller');

// Mock de dbConnection
dbConnection.auction = {
    createAuction: () => true
};

describe('registrateAuction', function () {
    it('debería crear una nueva subasta en la base de datos con los datos correctos', function () {
        const mockAuction = {
            currentBid: 100,
            buyNowPrice: 150,
            auctionEndTime: '2024-12-31T23:59:59',
            iduser: 1,
            idproduct: 2
        };

        dbConnection.auction.createAuction = () => true;

        const result = registrateAuction(mockAuction);

        assert.strictEqual(result, true);
    });

    it('debería manejar errores si la creación de la subasta falla', function () {
        const mockAuction = {
            currentBid: 100,
            buyNowPrice: 150,
            auctionEndTime: '2024-12-31T23:59:59',
            iduser: 1,
            idproduct: 2
        };

        dbConnection.auction.createAuction = () => {
            throw new Error('Error al crear la subasta');
        };

        assert.throws(() => registrateAuction(mockAuction), /Error al crear la subasta/);
    });
});

describe('autenticarUsuario', () => {

    it('debería lanzar un error si ocurre un error inesperado durante la autenticación', async () => {
      // Mockear un error inesperado
      dbConnection.authenticateUser.mockRejectedValue(new Error('Error de conexión a la base de datos'));
  
      // Intentar autenticar y verificar que se lanza el error apropiado
      await expect(servicioUsuario.autenticarUsuario('test@example.com', 'password123'))
        .rejects
        .toThrow('Autenticación fallida');
  
      // Verificar que la función de autenticación fue llamada
      expect(dbConnection.authenticateUser).toHaveBeenCalledWith('test@example.com', 'password123');
    });
  
  });
  
