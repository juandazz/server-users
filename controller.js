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

            return dbConnection.user.registrateUser(name, surname, nickname, email, password, securityQuestion1, securityQuestion2, securityQuestion3)
        } else {

            return null
        }
    },

    obtenerSubastas: async (  ) => {

        const productosSubasta =[]

        const productosSubastaDB = await dbConnection.auction.getUserAuctions()

        console.log(productosSubastaDB); // Verifica el tipo de valor devuelto


        for ( const productoSubastaDB of productosSubastaDB ) {
            const unProductoSubasta = {}

            unProductoSubasta.id = productoSubastaDB.idproduct
            unProductoSubasta.name = productoSubastaDB.name
            unProductoSubasta.description = productoSubastaDB.description
            unProductoSubasta.imageUrl = productoSubastaDB.image
            unProductoSubasta.currentBid = productoSubastaDB.current_bid
            unProductoSubasta.buyNowPrice = productoSubastaDB.buy_now_price
            unProductoSubasta.auctionEndTime = productoSubastaDB.end_time

            productosSubasta.push(unProductoSubasta)
        }

        return productosSubastaDB
    },

    registrateAuction: (auction) =>{
    
        return dbConnection.auction.createAuction(
            auction.currentBid, 
            auction.buyNowPrice, 
            auction.auctionEndTime, 
            auction.iduser, 
            auction.idproduct
        )
    },

    autenticarUsuario: async (email, password) => {
        try {
            const user = await dbConnection.user.authenticateUser(email, password);
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

const valorPuja = (valor_actual) => {

    if(valor_actual){
        
    }

    
}







module.exports = controller


