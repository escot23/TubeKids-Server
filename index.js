const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const multer = require('multer');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');



const {
    crearUsuario,
    obtenerUsuario
} = require('./controller/usuarioController.js');

const {
    loginUser
} = require('./controller/loginController.js');

const {
    crearVideo,
    obtenerVideos,
    editarVideo,
    eliminarVideo
} = require('./controller/videoController.js');

const {
    crearUsuarioRestringido,
    obtenerUsuariosRestringidos,
    editarUsuarioRestringido,
    cargarDatosUsuariosRestringidos,
    eliminarUsuarioRestringido
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


// Rutas para la administración de usuarios restringidos
app.post('/usuariosrestringido', crearUsuarioRestringido);
app.get('/usuariosrestringido', obtenerUsuariosRestringidos);
app.get('/usuariosrestringido/cargar', cargarDatosUsuariosRestringidos);
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


// Configuración de Multer para manejar la carga de archivos en el html
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/imgavatares/'); // Directorio donde se guardarán las imágenes
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Nombre único para el archivo
    }
});
const upload = multer({ storage: storage });

// Ruta para manejar la carga de imágenes desde Dropzone.js
app.post('/upload-avatar', upload.single('file'), (req, res) => {
    if (req.file) {
        // Aquí guarda la ruta de la imagen en base de datos o en mi carpeta
        const imageUrl = req.file.path;
        console.log(imageUrl);
        res.status(200).json({ imageUrl: imageUrl });
    } else {
        res.status(400).json({ error: 'No se ha enviado ninguna imagen' });
    }
});

// Ruta GET para manejar las solicitudes de imágenes de avatares
app.get('/imgavatares/:nombreArchivo', (req, res) => {
    // Obtiene el nombre del archivo de la solicitud
    const nombreArchivo = req.params.nombreArchivo;

    // Construye la ruta completa del archivo de avatar
    const rutaAvatar = path.join(__dirname, 'public', 'imgavatares', nombreArchivo);

    // Verifica si el archivo existe antes de enviarlo
    fs.access(rutaAvatar, fs.constants.F_OK, (err) => {
        if (err) {
            console.error('El archivo no existe:', rutaAvatar);
            return res.status(404).send('Archivo no encontrado');
        }

        // Envia el archivo de imagen como respuesta
        res.sendFile(rutaAvatar);
    });
});


app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
