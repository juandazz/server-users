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
    

    obtenerSubastas: async () => {
        try {
            const productosSubasta = [];
            const productosSubastaDB = await dbConnection.auction.getUserAuctions();
    
            for (const productoSubastaDB of productosSubastaDB) {
                const unProductoSubasta = {};
    
                // Llamar a eliminarSubastaExpirada y verificar si la subasta ha expirado
                const subastaEliminada = await controller.eliminarSubastaExpirada(productoSubastaDB.idauction);
                
                if (!subastaEliminada) {
                    // Si la subasta no ha sido eliminada, se agrega a la lista de productos
                    unProductoSubasta.id = productoSubastaDB.idauction;
                    unProductoSubasta.idproduct = productoSubastaDB.idproduct;
                    unProductoSubasta.name = productoSubastaDB.name;
                    unProductoSubasta.description = productoSubastaDB.description;
                    unProductoSubasta.imageUrl = productoSubastaDB.image;
                    unProductoSubasta.currentBid = productoSubastaDB.current_bid;
                    unProductoSubasta.buyNowPrice = productoSubastaDB.buy_now_price;
                    unProductoSubasta.auctionEndTime = productoSubastaDB.end_time;
    
                    productosSubasta.push(unProductoSubasta);
                } else {
                    console.log(`Subasta ${productoSubastaDB.idauction} eliminada por estar expirada`);
                }
            }
    
            console.log(productosSubasta);
            return productosSubasta;
        } catch (error) {
            console.error('Error al obtener las subastas:', error);
            throw new Error('No se pudo obtener las subastas en el controller');
        }
    },
    

    registrateAuction: async(auction) =>{
        
    // Ejemplo de uso con una duración de 2 días
    const fechaFin = obtenerFechaFinSubasta(auction.auctionEndTime);
    console.log(fechaFin);
  
        return await dbConnection.auction.createAuction(
            auction.currentBid, 
            auction.buyNowPrice, 
            fechaFin, 
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
        try {
            return await dbConnection.user.getCreditsUser(iduser)
        } catch (error) {
            console.error('Error al obtener creditos:', error);
            throw new Error('No se pudo obtener creditos');
        }
       
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
            console.log(idauction + 'en delete')
            const resultAuction = await dbConnection.auction.getAuctionsById(idauction);
    
            const currentTime = new Date();
            const auctionEndTime = new Date(resultAuction.end_time);
    
            if (auctionEndTime < currentTime) {
        
                const deleteResult = await dbConnection.auction.deleteSubasta(idauction);
                console.log(deleteResult + 'deleted')
                return deleteResult;
            } else {
               console.log('la subasta no ha experidado')
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
    },

    winnerAuction: async ( idauction) => {
        try {
            const result = await dbConnection.auction.getAuctionWinner( idauction);
            return result;
        } catch (error) {
            console.error("Error en el ganador de subasta", error.message);
            throw new Error('No se pudo obtener ganado - subasta.');
        }
    },

    buyInAuction: async ( idauction, iduser, amount) => {
        try {
            const result = await dbConnection.auction.admitirCompraInmediata(idauction, iduser, amount);
            return result;
        } catch (error) {
            console.error("Error en comprar subasta subasta", error.message);
            throw new Error('No se pudo comprar subasta.');
        }
    },
   
}
    

const validatePassword = (password) => { 
    if (password.length >= 8) {
        const regular = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@#$%^&+=!])[A-Za-z\d@#$%^&+=!]{8,}$/;
        return regular.test(password);
        

    }
    return false
}

const obtenerFechaFinSubasta = (duracionEnDias) => {
    const fechaActual = new Date();
  
    // Milisegundos correspondientes a un día
    const milisegundosPorDia = 24 * 60 * 60 * 1000;
    
    // Calculamos la nueva fecha sumando los días
    let nuevaFecha = new Date(fechaActual.getTime() + duracionEnDias * milisegundosPorDia);
    
    // Ajustar la hora manualmente a UTC-5 (Bogotá)
    nuevaFecha.setHours(nuevaFecha.getHours() - 5);
    
    // Convertir a formato ISO 8601
    const fechaISO = nuevaFecha.toISOString();
    
    console.log(fechaISO);
    return fechaISO;
  };
  


module.exports = controller


