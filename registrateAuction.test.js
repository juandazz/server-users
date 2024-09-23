const assert = require('assert');
const dbConnection = require('./db-connection');
const { registrateAuction } = require('./controller');

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
