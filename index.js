const dotenv = require('dotenv');
const cookieParser = require("cookie-parser");
const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const multer = require('multer');
const bodyParser = require("body-parser");
const fs = require('fs');
const path = require('path');
const { createUser, getUser } = require("./controllers/usercontroller");
const { loginUser } = require("./controllers/logincontroller");
const { createVideo,getVideos, updateVideo, deleteVideo } = require("./controllers/videocontroller");
const { crearUsuarioRestringido, obtenerUsuariosRestringidos,editarUsuarioRestringido ,cargarDatosUsuariosRestringidos, eliminarUsuarioRestringido } = require('./controllers/usuariorestringidocontroller');
const { requiereAutenticar } = require("./middleware/sesion");

dotenv.config();
app.use(cookieParser());
app.use(cors());
app.use(bodyParser.json());
const PORT = 3000;

mongoose.connect("mongodb://localhost:27017/myapp").then(() => {
    console.log("Conexión exitosa a la base de datos");
}).catch((error) => {
    console.error("Error al conectar a la base de datos:", error);
    process.exit(1);
});

app.use(express.static(path.join(__dirname, 'public')));
// Configurar multer para manejar la carga de archivos
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'imgavatares/'); // Directorio donde se guardan las imágenes
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); 
    }
});
const upload = multer({ storage: storage });

// Ruta para manejar la carga de imágenes desde Dropzone.js
app.post('/upload-avatar', upload.single('file'), (req, res) => {
    if (req.file) {
        // Aquí guarda la ruta de la imagen en base de datos
        const imageUrl = req.file.path;
        res.status(200).json({ imageUrl: imageUrl });
    } else {
        res.status(400).json({ error: 'No se ha enviado ninguna imagen' });
    }
});

// Ruta GET para manejar las solicitudes de imágenes de avatares
app.get('/imgavatares/:nombreArchivo', (req, res) => {
    // Obtiene el nombre del archivo de la solicitud
    const nombreArchivo = req.params.nombreArchivo;
    
    // Construye la ruta completa del archivo de avatar incluyendo la extensión del archivo
    const rutaAvatar = path.join(__dirname, 'public', 'imgavatares', `${nombreArchivo}.jpg`);

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

app.post("/register", createUser);
app.get("/register", getUser);
app.post("/login", loginUser);
app.post("/videos", createVideo);
app.get("/videos", requiereAutenticar, getVideos);
//app.get("/videos",getVideos);
//app.put("/videos/:id", updateVideo);
//app.delete("/videos/:id", deleteVideo);
app.post("/usuariosrestringido", crearUsuarioRestringido);
app.get("/usuariosrestringido", obtenerUsuariosRestringidos);
app.get("/usuariosrestringido/cargar", cargarDatosUsuariosRestringidos);
app.put("/usuariosrestringido/:id", editarUsuarioRestringido); // Ruta para editar usuario restringido
app.delete("/usuariosrestringido/:id", eliminarUsuarioRestringido); // Ruta para eliminar usuario restringido

//app.get('/videos/lista', getVideos);


app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
