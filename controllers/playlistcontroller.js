const PlaylistModel = require('../models/playlistmodel');
// Controlador para crear una nueva playlist
const createPlaylist = async (req, res) => {
    try {
        const { name } = req.body;

        const playlist = new PlaylistModel({
            name,
            videos: [] // Inicialmente la playlist no tiene videos
        });

        const savedPlaylist = await playlist.save();

        res.status(201).json(savedPlaylist);
    } catch (error) {
        console.error('Error al crear la playlist:', error);
        res.status(500).json({ error: 'Hubo un error al intentar crear la playlist' });
    }
};

// Controlador para obtener todas las playlists
const getPlaylists = async (req, res) => {
    try {
        const playlists = await PlaylistModel.find();
        res.json(playlists);
    } catch (error) {
        console.error('Error al obtener las playlists:', error);
        res.status(500).json({ error: 'Hubo un error al intentar obtener las playlists' });
    }
};

// Controlador para agregar un video a una playlist
const addVideoToPlaylist = async (req, res) => {
    try {
        const { playlistId, videoId } = req.params;

        const playlist = await PlaylistModel.findById(playlistId);
        if (!playlist) {
            return res.status(404).json({ error: 'La playlist no existe' });
        }

        const video = await VideoModel.findById(videoId);
        if (!video) {
            return res.status(404).json({ error: 'El video no existe' });
        }

        playlist.videos.push(videoId);
        await playlist.save();

        res.status(200).json({ message: 'Video agregado a la playlist correctamente' });
    } catch (error) {
        console.error('Error al agregar el video a la playlist:', error);
        res.status(500).json({ error: 'Hubo un error al intentar agregar el video a la playlist' });
    }
};


module.exports = { createPlaylist, getPlaylists, addVideoToPlaylist };
