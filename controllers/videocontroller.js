const VideoModel = require('../models/videomodel.js');

const createVideo = async (req, res) => {
    try {
        const { nombre, urlYoutube } = req.body;
        const userId = req.userId; // Obtener el ID de usuario del token JWT

        // Crear una instancia del video asociada al ID de usuario
        const video = new VideoModel({
            nombre,
            urlYoutube,
            userId
        });

        // Guardar el video en la base de datos
        const savedVideo = await video.save();
        res.status(201).json(savedVideo);
    } catch (error) {
        console.error('Error al crear el video:', error);
        res.status(500).json({ error: 'Hubo un error al intentar crear el video' });
    }
};

const getVideos = async (req, res) => {
    try {
        const userId = req.userId; // ID del usuario principal obtenido del token JWT

        // Aquí realizas la lógica para obtener los videos asociados al usuario principal y sus usuarios restringidos
        const videos = await VideoModel.find({ userId }); 
        console.log(videos);
        if (!videos || videos.length === 0) {
            return res.status(404).json({ error: 'No se encontraron videos para este usuario' });
        }else {
        const videos = await VideoModel.find({ userId }); 
        console.log(videos);
        res.status(200).json(videos);
        }

        res.json(videos);
    } catch (error) {
        console.error('Error al obtener los videos:', error);
        res.status(500).json({ error: 'Hubo un error al obtener los videos' });
    }
};

module.exports = {
    createVideo,
    getVideos
   
};
