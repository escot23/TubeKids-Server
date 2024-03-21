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
    crearUsuario,
    obtenerUsuario
} = require('./controller/usuarioController.js');

const {
    loginUser
} = require('./controller/loginController');

const {
    crearVideo,
    obtenerVideos,
    editarVideo,
    eliminarVideo
} = require('./controller/videoController.js');

const {
    crearUsuarioRestringido,
    editarUsuarioRestringido,
    cargarDatosUsuariosRestringidos,
    eliminarUsuarioRestringido,
    getUsuarioRestringidos,
    cargarUsuariosRestringidos,validarPin
} = require('./controller/usuarioRestringidoController.js');

//middlewares
dotenv.config();
app.use(cookieParser());
app.use(cors());
app.use(bodyParser.json());
const PORT = 3000;


//coneccion a la base de datos
mongoose
    .connect('mongodb://localhost:27017/tubekids')
    .then(() => {
        console.log('Conexión exitosa a la base de datos');
    })
    .catch((error) => {
        console.error('Error al conectar a la base de datos:', error);
        process.exit(1);
    });


app.use(express.static(path.join(__dirname, 'public')));

// Define el middleware authenticateToken
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    console.log(token);

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
        if (err) {
            console.error('Error al verificar el token JWT:', err);
            return res.status(403).json({ error: 'Forbidden' });
        }

        // Asigna el userId decodificado a req.user para su posterior uso en las rutas protegidas
        req.user = { _id: decodedToken.userId };
        next();
    });
};



// Rutas para la administración de usuarios restringidos
app.post('/usuariosrestringido', crearUsuarioRestringido);
app.get('/usuarioRestringido', authenticateToken, getUsuarioRestringidos);
app.get('/usuariosrestringido/cargar', cargarDatosUsuariosRestringidos);
app.get('/usuariosrestringido/mostrar', cargarUsuariosRestringidos);

app.put('/usuariosrestringido/:id', editarUsuarioRestringido);
app.delete('/usuariosrestringido/:id', eliminarUsuarioRestringido);

// Rutas para el registro y inicio de sesión de usuarios principales
app.post('/register', crearUsuario);
app.get('/register', obtenerUsuario);
app.post('/login', loginUser);



// Rutas de videos
app.post('/videos', crearVideo);
app.get('/videos', obtenerVideos);
app.put('/videos/:id', editarVideo);
app.delete('/videos/:id', eliminarVideo);

// Ruta para validar el PIN
app.post('/validarPin', authenticateToken, validarPin);


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
                hasRestrictedUsers: hasRestrictedUsers // Pasar true si hay usuarios restringidos, false si no los hay
            }, process.env.JWT_SECRET);
            
            console.log('Token JWT recibido:', token);

            res.status(201).json({ token, hasRestrictedUsers });
        } else {
            res.status(401).json({ error: 'Invalid email or password' });
        }
    } catch (error) {
        console.error('Error while authenticating user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});




app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
