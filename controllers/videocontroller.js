const VideoModel = require("../models/videomodel");

const createVideo = async (req, res) => {
    try {
        const { name, url } = req.body;

        // Crear una instancia del video
        const video = new VideoModel({
            name,
            url,
            playlist: "General" //Asocia automáticamente al Playlist General, sin funcion aun...
        });

        // Guardar el video en la base de datos
        const savedVideo = await video.save();

        res.status(201).json(savedVideo);
    } catch (error) {
        console.error('Error al crear el video:', error);
        res.status(500).json({ error: 'Hubo un error al intentar crear el video' }); //ERROR EN EL SERVIDOR
    }
};


const getVideos = async (req, res) => {
    try {
        const videos = await VideoModel.find();
        // Convertir las URL directas de YouTube a URL 
        const videosWithEmbeddedURLs = videos.map(video => {
            video.url = convertToEmbeddedURL(video.url);
            return video;
        });
        res.json(videosWithEmbeddedURLs);
    } catch (error) {
        console.error('Error al obtener los videos:', error);
        res.status(500).json({ error: 'Hubo un error al intentar obtener los videos' });
    }
};

// Función para convertir una URL directa de YouTube a una URL 
function convertToEmbeddedURL(url) {
    // URL directas de YouTube
    const videoId = url.split('v=')[1];
    return `https://www.youtube.com/embed/${videoId}`;
}


const updateVideo = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, url } = req.body;

        const updatedVideo = await VideoModel.findByIdAndUpdate(id, { name, url }, { new: true });//lo devuelve actualizado

        res.status(200).json(updatedVideo);
    } catch (error) {
        console.error('Error al actualizar el video:', error);
        res.status(500).json({ error: 'Hubo un error al intentar actualizar el video' });
    }
};

const deleteVideo = async (req, res) => {
    try {
        const { id } = req.params;
        console.log(id);
        await VideoModel.findByIdAndDelete(id);

        res.status(200).json({ message: 'Video eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar el video:', error);
        res.status(500).json({ error: 'Hubo un error al intentar eliminar el video' });
    }
};

module.exports = { createVideo, getVideos, updateVideo, deleteVideo };
