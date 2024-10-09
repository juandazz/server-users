// Usando fetch
 class Inventory {

    async registerUserInventary(iduser) {    
            console.log('registerInventary ' + iduser)
        try {
            const response = await fetch('http://35.237.168.79:5000/usuarios', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ user: Object(iduser) })
            });
            const data = await response.json();
            console.log('Respuesta:', data);
        } catch (error) {
            console.error('Error al agregar id en inventario:', error);
        }

    }

    async transferObject(fromUser, toUser, objetoId) { 
        try {
            console.log(fromUser  + 'skksks', toUser, objetoId)
            const response = await fetch('http://35.237.168.79:5000/transfer-object', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ fromUser, toUser, objetoId })
            });
            const data = await response.json();
            console.log('Respuesta:', data);
        } catch (error) {
            console.error('Error al transferir el objeto:', error);
        }
    }
    
    // Usando fetch
    async deactivateObject (user, objetoId) {
        try {
            const response = await fetch(`http://35.237.168.79:5000/deactivateObject/${user}/${objetoId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            console.log('Respuesta:', data);
        } catch (error) {
            console.error('Error al desactivar el objeto:', error);
        }
    }
    
    
    // Usando fetch
    async activateObject(user, objetoId) {
        try {
            const response = await fetch(`http://35.237.168.79:5000/activateObject/${user}/${objetoId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            console.log('Respuesta:', data);
        } catch (error) {
            console.error('Error al activar el objeto:', error);
        }
    }
    

}

module.exports = { inventory: new Inventory() }