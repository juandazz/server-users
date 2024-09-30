const morgan = require('morgan');
const controller = require('./controller');
const express = require('express');
const cors = require('cors');
const app = express();
const port = 4000;

app.use(express.json());
app.use(morgan('dev'));
app.use(cors());

app.get('/api/saludo', (req, res) => {
    res.json({ mensaje: '¡Hola desde el servidor Express!' });
});

app.post('/api/registro', (req, res) => {
    try {
        const datosRecibidos = req.body;
        res.json({ answer: controller.registrarUsuario(datosRecibidos) });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error en el servidor', error: error.message });
    }
});

app.get('/api/subastas', async (req, res) => {
    try {
        res.json(await controller.obtenerSubastas());
    } catch (error) {
        res.status(500).json({ mensaje: 'Error en el servidor', error: error.message });
    }
});

app.post('/api/new/auction', (req, res) => {
    try {
        const datosRecibidos = req.body;
        res.json({ answer: controller.registrateAuction(datosRecibidos) });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error en el servidor', error: error.message });
    }
});

app.post('/api/new/bid', (req, res) => {
    try {
        const datosRecibidos = req.body;
        res.json({ answer: controller.registrateAuction(datosRecibidos) });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error en el servidor', error: error.message });
    }
});


app.post('/api/auth', async (req, res) => {
    try {
        const { email, password } = req.body;

app.post('/api/setCredits/', (req, res)=>{
    const datos= req.body
    res.json({ answer: controller.setCreditsUser(datos.iduser, datos.credits) });


})

app.post('/api/getCredits/', async (req, res)=> {
    const {iduser}= req.body
    const usuario = await controller.getCreditsUser(iduser)
    res.json({ usuario: usuario});

})


// Ruta POST - Recibe datos y los devuelve como respuesta
app.post('/api/echo', (req, res) => {
    const datosRecibidos = req.body;
    res.json({ mensaje: 'Datos recibidos correctamente', datos: datosRecibidos });
});
// Ruta GET autentica usuario
app.post('/api/auth', async (req, res) => {
    try {
        const { email, password } = req.body;

        const usuarioAutenticado = await controller.autenticarUsuario(email, password);

        if (usuarioAutenticado) {
            res.status(200).json({ mensaje: 'Autenticación exitosa', usuario: usuarioAutenticado });
        } else {
            res.status(401).json({ mensaje: 'Autenticación fallida' });
        }

    } catch (error) {
        res.status(500).json({ mensaje: 'Error en el servidor', error: error.message });
    }
});

// Middleware para manejo de errores global
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ mensaje: 'Ocurrió un error en el servidor', error: err.message });
});

// Captura errores no manejados
process.on('uncaughtException', (error) => {
    console.error('Error no capturado:', error);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Promesa no manejada:', promise, 'Razón:', reason);
});

app.listen(port, 'localhost', () => {
    console.log(`Servidor Express escuchando en http://localhost:${port}`);
});
