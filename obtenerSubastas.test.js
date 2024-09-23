const assert = require('assert');
const dbConnection = require('./db-connection');
const { obtenerSubastas } = require('./controller');  

// Mock de dbConnection
dbConnection.auction = {
    getUserAuctions: () => []
};

describe('obtenerSubastas', function () {
    it('debería devolver una lista vacía si no hay subastas', function () {
        dbConnection.auction.getUserAuctions = () => [];
        const result = obtenerSubastas();
        assert.deepStrictEqual(result, []);
    });

    it('debería mapear correctamente las propiedades del producto de la base de datos', function () {
        const mockAuctionDB = [
            {
                idproduct: 1,
                name: 'Producto 1',
                description: 'Descripción del Producto 1',
                image: 'url1',
                current_bid: 100,
                buy_now_price: 150,
                end_time: '2024-12-31T23:59:59'
            }
        ];

        dbConnection.auction.getUserAuctions = () => mockAuctionDB;

        const result = obtenerSubastas();

        assert.deepStrictEqual(result, [
            {
                id: 1,
                name: 'Producto 1',
                description: 'Descripción del Producto 1',
                imageUrl: 'url1',
                currentBid: 100,
                buyNowPrice: 150,
                auctionEndTime: '2024-12-31T23:59:59'
            }
        ]);
    });

    it('debería manejar correctamente múltiples productos en la subasta', function () {
        const mockAuctionDB = [
            {
                idproduct: 1,
                name: 'Producto 1',
                description: 'Descripción del Producto 1',
                image: 'url1',
                current_bid: 100,
                buy_now_price: 150,
                end_time: '2024-12-31T23:59:59'
            },
            {
                idproduct: 2,
                name: 'Producto 2',
                description: 'Descripción del Producto 2',
                image: 'url2',
                current_bid: 200,
                buy_now_price: 250,
                end_time: '2024-11-30T23:59:59'
            }
        ];

        dbConnection.auction.getUserAuctions = () => mockAuctionDB;

        const result = obtenerSubastas();

        assert.deepStrictEqual(result, [
            {
                id: 1,
                name: 'Producto 1',
                description: 'Descripción del Producto 1',
                imageUrl: 'url1',
                currentBid: 100,
                buyNowPrice: 150,
                auctionEndTime: '2024-12-31T23:59:59'
            },
            {
                id: 2,
                name: 'Producto 2',
                description: 'Descripción del Producto 2',
                imageUrl: 'url2',
                currentBid: 200,
                buyNowPrice: 250,
                auctionEndTime: '2024-11-30T23:59:59'
            }
        ]);
    });
});
