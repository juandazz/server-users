const controller = require('./controller');
// Importa Express
const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

// Middleware para parsear JSON en el cuerpo de las solicitudes
app.use(express.json());
app.use(cors());

// Ruta GET - Devuelve un mensaje de saludo
app.get('/api/saludo', (req, res) => {
    res.json({ mensaje: '¡Hola desde el servidor Express!' });
});


// Ruta POST - Recibe datos y los devuelve como respuesta
app.post('/api/registro', (req, res) => {

    const datosRecibidos = req.body;
    res.json({ answer: controller.registrarUsuario(datosRecibidos) });
});

app.get('/api/subastas', (req, res) => {
    res.json(controller.obtenerSubastas());
});

app.post('/api/new/auction', (req, res) => {
    const datosRecibidos = req.body;
    res.json({ answer: controller.registrateAuction(datosRecibidos) });
});

app.post('/api/new/bid', (req, res) => {
    const datosRecibidos = req.body;
    res.json({ answer: controller.registrateAuction(datosRecibidos) });
});


// Ruta POST - Recibe datos y los devuelve como respuesta
app.post('/api/echo', (req, res) => {
    const datosRecibidos = req.body;
    res.json({ mensaje: 'Datos recibidos correctamente', datos: datosRecibidos });
});
// Ruta GET autentica usuario
app.post('/api/auth', async (req, res) => {
    try {
        const { email, password } = req.body;

        console.log('Email:', email, 'Password:', password); // Verificar en el servidor

        const usuarioAutenticado = await controller.autenticarUsuario(email, password);

        if (usuarioAutenticado) {
            res.status(200).json({ mensaje: 'Autenticación exitosa', usuario: usuarioAutenticado });
        } else {
            res.status(401).json({ mensaje: 'Autenticación fallida' });
        }

    } catch (error) {
        res.status(500).json({ mensaje: 'Error en el servidor', error: error.message });
    }
});



// Inicia el servidor
app.listen(port, () => {
    console.log(`Servidor Express escuchando en http://localhost:${port}`);
});
