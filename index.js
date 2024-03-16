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
const { createVideo, updateVideo, deleteVideo } = require("./controllers/videocontroller");
const { crearUsuarioRestringido, obtenerUsuariosRestringidos,editarUsuarioRestringido ,cargarDatosUsuariosRestringidos, eliminarUsuarioRestringido } = require('./controllers/usuariorestringidocontroller');
const { requiereautenticar } = require("./middleware/sesion");

app.use(cors());
app.use(bodyParser.json());
const PORT = 3000;

mongoose.connect("mongodb://localhost:27017/myapp").then(() => {
    console.log("Conexión exitosa a la base de datos");
}).catch((error) => {
    console.error("Error al conectar a la base de datos:", error);
    process.exit(1);
});


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

app.get('/avatars/:nombreArchivo', (req, res) => {
    // Obtener el nombre del archivo de la solicitud
    const nombreArchivo = req.params.nombreArchivo;
    
    // Construir la ruta completa del archivo de avatar
    const rutaAvatar = path.join(__dirname, '../imgavatares/', nombreArchivo);

    // Enviar el archivo de imagen como respuesta
    res.sendFile(rutaAvatar);
});

app.post("/register", createUser);
app.get("/register", getUser);
app.post("/login", loginUser);
app.post("/videos", createVideo);
//app.get("/videos", getVideos);
app.put("/videos/:id", updateVideo);
app.delete("/videos/:id", deleteVideo);
app.post("/usuariosrestringido", crearUsuarioRestringido);
app.get("/usuariosrestringido", obtenerUsuariosRestringidos);
app.get("/usuariosrestringido/cargar", cargarDatosUsuariosRestringidos);
app.put("/usuariosrestringido/:id", editarUsuarioRestringido); // Ruta para editar usuario restringido
app.delete("/usuariosrestringido/:id", eliminarUsuarioRestringido); // Ruta para eliminar usuario restringido


app.get("/videos", requiereautenticar, async (req, res) => {
    try {
      //accede al userId adjunto en la solicitud req.userId
      const userId = req.userId;
  
      // Realiza alguna operación basada en el userId, como buscar los videos asociados al usuario
      const videos = await VideoModel.find({ userId });
      console.log(videos);
      // Devuelve los videos encontrados como respuesta
      res.json(videos);
    } catch (error) {
      console.error('Error al obtener los videos:', error);
      res.status(500).json({ error: 'Hubo un error al obtener los videos' });
    }
  });
  

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
