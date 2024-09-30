const dbConnection = require('./db-connection');

const controller = {
    registrarUsuario: (user) => {

        let valido = true
       

        const { name, surname, nickname, email, password, securityQuestion1, securityQuestion2, securityQuestion3 } = user

        if (!validatePassword(password)) {
            valido = false;
        }
    
        const credits = 20; // El usuario nuevo inicia con esos credits
    
        if (valido) {
    
            return dbConnection.user.registrateUser(
                name, surname, nickname, email, password, securityQuestion1, securityQuestion2, securityQuestion3, credits
            );
        } else {
            
            return null;
        }
    },
    

    obtenerSubastas: async (  ) => {

        const productosSubasta =[]

        const productosSubastaDB = await dbConnection.auction.getUserAuctions()



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
    },

    actualizarCreditosUsuario: async  (iduser, credits, type) => {
    try {
     
        const resultCredits = await dbConnection.user.getCreditsUser(iduser);
    
        if (type === 'compra') {
            
            if (resultCredits >= credits) {
                resultCredits -= credits;
            } else {
                throw new Error("Créditos insuficientes para realizar la compra.");
            }
        } else if (type === 'venta') {
            // Sumar créditos por venta
            resultCredits += credits;
        } else {
            throw new Error("Operación no válida. Debe ser 'compra' o 'venta'.");
        }

        
        
        const updateResult = await dbConnection.user.setCreditsUser(iduser, resultCredits);

        return updateResult;
    } catch (error) {
        console.error("Error al actualizar los créditos:", error);
        throw error;
    }

    },

    getCreditsUser:async(iduser)=>{
        return await dbConnection.user.getCreditsUser(iduser)
    },

    setCreditsUser:async(iduser,credits)=>{
        return await dbConnection.user.setCreditsUser(iduser, credits);
    },

    validateUSer: async(iduser) =>{
        try {
            const user = await dbConnection.user.getUserById(iduser);
            if(user!==null) {
                return true;
            } else {
                return false;
            }
        } catch (error) {
            console.error('Error al obtener el usuario:', error);
            throw new Error('No se pudo obtener el usuario');
        }
    },


    eliminarSubastaExpirada: async (idauction) => {
        try {
            
            const resultAuction = await dbConnection.auction.getAuctionsById(idauction);
    l
            const currentTime = new Date();
            const auctionEndTime = new Date(resultAuction.end_time);
    
            if (auctionEndTime < currentTime) {
        
                const deleteResult = await dbConnection.auction.deleteSubasta(idauction);
    
                return deleteResult;
            } else {
                throw new Error("La subasta aún no ha expirado.");
            }
        } catch (error) {
            console.error("Error al eliminar la subasta:", error);
            throw error;
        }
    },

    registrarPuja: async (iduser, idauction, bid_amount) => {
        try {
            const result = await dbConnection.auction.registrarPuja(iduser, idauction, bid_amount);
            return result;
        } catch (error) {
            console.error("Error en la puja:", error.message);
            throw new Error('No se pudo registrar la puja.');
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


