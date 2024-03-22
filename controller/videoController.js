const VideoModel = require('../models/videomodel.js');

const PostVideo = async (req, res) => {
    try {
        const { nombre, urlYoutube } = req.body;
        const userId = req.userId; // Obtener el ID de usuario del token JWT
        console.log(userId);
        // Crear una instancia del video asociada al ID de usuario
        const video = new VideoModel({
            nombre,
            urlYoutube,
            userId
        });
        console.log(video);
        // Guardar el video en la base de datos
        const videoGuardado = await video.save();
        console.log(videoGuardado);
        res.status(201).json(videoGuardado);
    } catch (error) {
        console.error('Error al crear el video:', error);
        res.status(500).json({ error: 'Hubo un error al intentar crear el video' });
    }
};

const GetVideo = async (req, res) => {
    try {
        const userId = req.userId; // ID del usuario principal obtenido del token JWT

        // Aquí realizas la lógica para obtener los videos asociados al usuario principal y sus usuarios restringidos
        const videos = await VideoModel.find({ userId });
        console.log(videos);
        if (!videos || videos.length === 0) {
            return res.status(404).json({ error: 'No se encontraron videos para este usuario' });
        } else {
            console.log(videos);
            res.status(200).json(videos);
        }
    } catch (error) {
        console.error('Error al obtener los videos:', error);
        res.status(500).json({ error: 'Hubo un error al obtener los videos' });
    }
};

const PatchVideo = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, urlYoutube } = req.body;
        console.log(id);
        // Actualizar el video en la base de datos
        const videoActualizado = await VideoModel.findByIdAndUpdate(id,
            {
                nombre,
                urlYoutube
            }, { new: true });
        if (!videoActualizado) {
            return res.status(404).json({ error: 'No se encontró el video' });
        }
        res.status(200).json(videoActualizado);
    } catch (error) {
        console.error('Error al editar el video:', error);
        res.status(500).json({ error: 'Hubo un error al intentar editar el video' });
    }
};

const PutVideo = async (req, res) => {
    try {
        const videoId = req.params.id;

        // Eliminar el video de la base de datos
        const videoEliminado = await VideoModel.findByIdAndDelete(videoId);
        if (!videoEliminado) {
            return res.status(404).json({ error: 'No se encontró el video' });
        }
        res.status(200).json({ message: 'Video eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar el video:', error);
        res.status(500).json({ error: 'Hubo un error al intentar eliminar el video' });
    }
};

module.exports = {
    PostVideo,
    GetVideo,
    PatchVideo,
    PutVideo
};
