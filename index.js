const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

const cookieParser = require('cookie-parser');
const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const multer = require('multer');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const User = require('./models/usuarioModel.js');
const RestrictedUser = require('./models/usuarioRestringidoModel.js');
const {
    PostUsuario,
    GetUsuario
} = require('./controller/usuarioController.js');

const {
    loginUser
} = require('./controller/loginController');

const {
    PostVideo,
    GetVideo,
    PatchVideo,
    PutVideo
} = require('./controller/videoController.js');

const {
    PostUsuarioRestringido,
    PatchUsuarioRestringido,
    GetPinUserPrincipal,
    PutUsuarioRestringido,
    GetListaUsuariosRestringidos,
    GetDatos
} = require('./controller/usuarioRestringidoController.js');

// Middlewares
dotenv.config();
app.use(cookieParser());
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

const PORT = 3000;

// Conección a la base de datos
mongoose.connect('mongodb://localhost:27017/tubekids')
    .then(() => {
        console.log('Conexión exitosa a la base de datos');
    })
    .catch((error) => {
        console.error('Error al conectar a la base de datos:', error);
        process.exit(1);
    });

// Middleware para verificar el token JWT
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    console.log('Token JWT recibido:', token);
    if (token == null) return res.status(401).json({ error: 'Unauthorized' });

    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
        if (err) {
            console.error('Error al verificar el token JWT:', err);
            return res.status(403).json({ error: 'Forbidden' });
        }

        // Extraer el userId y el pin del token decodificado
        const { userId, pin } = decodedToken;

        // Asignar el userId y el pin a req.user para su posterior uso en las rutas protegidas
        req.user = { _id: userId, pin: pin };
        console.log("por aca intntamos cargar el id principal...", userId);

        console.log("PIN del principal tambien..", pin, userId);
        // Continuar con el middleware siguiente
        next();
    });
}

// Rutas para la administración de usuarios restringidos
app.post('/usuariosrestringido', PostUsuarioRestringido);
app.get('/usuariosrestringido/cargar', authenticateToken, GetPinUserPrincipal);
app.get('/usuariosrestringido/mostrar', GetListaUsuariosRestringidos);
app.put('/usuariosrestringido/:id', PatchUsuarioRestringido);
app.delete('/usuariosrestringido/:id', PutUsuarioRestringido);
app.get('/getdatos', GetDatos);

// Rutas para el registro y inicio de sesión de usuarios principales
app.post('/register', PostUsuario);
app.get('/register', GetUsuario);
app.post('/login', loginUser);

// Rutas de videos
app.post('/videos', PostVideo);
app.get('/videos', GetVideo);
app.put('/videos/:id', PatchVideo);
app.delete('/videos/:id', PutVideo);


// Ruta para autenticar usuarios y generar token JWT
app.post("/api/session", async (req, res) => {
    const { email, password } = req.body;

    try {
        // Buscar al usuario en la base de datos
        const user = await User.findOne({ email, password });

        if (user) {
            // Verificar si existen usuarios restringidos asociados al usuario principal
            const restrictedUsers = await RestrictedUser.find({ userId: user._id });

            // Determinar si hay usuarios restringidos relacionados con el ID del usuario principal
            const hasRestrictedUsers = restrictedUsers && restrictedUsers.length > 0;

            // Generar token JWT con la información del usuario
            const token = jwt.sign({
                userId: user._id,
                email: user.email,
                pin: user.pin,
                hasRestrictedUsers: hasRestrictedUsers // Pasar true si hay usuarios restringidos, false si no los hay
            }, process.env.JWT_SECRET);

            console.log('Token JWT generado:', token);

            res.status(201).json({ token, hasRestrictedUsers });
        } else {
            res.status(401).json({ error: 'Invalid email or password' });
        }
    } catch (error) {
        console.error('Error al autenticar al usuario:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});