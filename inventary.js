// Usando fetch
async function transferObject(fromUser, toUser, objetoId) {
    try {
        const response = await fetch('http://localhost:5000/transfer-object', {
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
async function deactivateObject(user, objetoId) {
    try {
        const response = await fetch(`http://localhost:5000/deactivateObject/${user}/${objetoId}`, {
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
async function activateObject(user, objetoId) {
    try {
        const response = await fetch(`http://localhost:5000/activateObject/${user}/${objetoId}`, {
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
